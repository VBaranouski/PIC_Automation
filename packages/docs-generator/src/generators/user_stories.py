"""
User Stories generator.
Fetches a Confluence functional specification and optional Figma mockups,
uses Claude AI to generate JIRA-ready User Stories, renders HTML output.
"""

from __future__ import annotations

import base64
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional

from jinja2 import Environment, FileSystemLoader

from src.ai.claude_client import ClaudeClient, UserStory
from src.clients.confluence_client import ConfluenceClient
from src.clients.figma_client import FigmaClient
from src.clients.jira_client import JiraClient, JiraIssue
from src.config.settings import Settings
from src.utils.date_utils import today_str
from src.utils.file_utils import ensure_dir, sanitize_filename, write_text


# ---------------------------------------------------------------------------
# HTML → plain text helper
# ---------------------------------------------------------------------------

class _HTMLStripper(HTMLParser):
    """Strips HTML tags and extracts plain text from Confluence storage format."""

    def __init__(self) -> None:
        super().__init__()
        self._parts: list[str] = []

    def handle_data(self, data: str) -> None:
        stripped = data.strip()
        if stripped:
            self._parts.append(stripped)

    def get_text(self) -> str:
        return "\n".join(self._parts)


def _html_to_text(html_str: str) -> str:
    """Extract plain text from an HTML/XHTML string."""
    stripper = _HTMLStripper()
    stripper.feed(html_str)
    return stripper.get_text()


def _extract_confluence_page_id(url: str) -> str:
    """
    Parse a Confluence page ID from a URL.
    Supports /pages/<id>/ and /pages/<id> patterns.
    Raises ValueError if no numeric page ID is found.
    """
    match = re.search(r"/pages/(\d+)", url)
    if not match:
        raise ValueError(
            f"Cannot extract Confluence page ID from URL: {url}\n"
            "Expected format: .../pages/123456/..."
        )
    return match.group(1)


def _format_story_for_prompt(story: JiraIssue) -> str:
    """Format a JIRA story as text for the Claude prompt (example reference)."""
    lines = [
        f"  Key: {story.key}",
        f"  Title: {story.summary}",
    ]
    if story.description:
        lines.append(f"  Description: {story.description[:500]}")
    if story.acceptance_criteria:
        lines.append(f"  Acceptance Criteria: {story.acceptance_criteria[:500]}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

class UserStoriesGenerator:
    """
    Orchestrates:
      Confluence spec fetch → Figma screenshot (optional) → JIRA examples (optional)
      → Claude AI → Jinja2 render → HTML output.
    """

    def __init__(
        self,
        confluence: ConfluenceClient,
        figma: Optional[FigmaClient],
        jira: Optional[JiraClient],
        claude: ClaudeClient,
        settings: Settings,
    ) -> None:
        self._confluence = confluence
        self._figma = figma
        self._jira = jira
        self._claude = claude
        self._settings = settings
        self._jinja = Environment(
            loader=FileSystemLoader(settings.paths.templates_dir),
            autoescape=False,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def generate(
        self,
        confluence_url: str,
        figma_url: Optional[str] = None,
        example_story_ids: Optional[list[str]] = None,
        epic_key: Optional[str] = None,
        project_key: Optional[str] = None,
    ) -> str:
        """
        Full pipeline: fetch → AI generate → render → write HTML.
        Returns the html_filepath as a string.
        """
        out_dir = ensure_dir(self._settings.paths.output_user_stories)

        # --- 1. Fetch Confluence spec ---
        print("  Fetching Confluence specification...")
        page_id = _extract_confluence_page_id(confluence_url)
        page_data = self._confluence.get_page(page_id)
        page_title = page_data.get("title", "Specification")
        body_html = page_data.get("body", {}).get("storage", {}).get("value", "")
        spec_text = _html_to_text(body_html)
        print(f"  Page: {page_title} ({len(spec_text)} chars)")

        # --- 2. Fetch Figma screenshot (optional) ---
        figma_screenshot_data_url: Optional[str] = None
        figma_deep_link: Optional[str] = figma_url

        if figma_url and self._figma:
            print("  Fetching Figma screenshot...")
            try:
                saved_paths = self._figma.screenshot_from_url(figma_url, out_dir)
                if saved_paths:
                    img_bytes = saved_paths[0].read_bytes()
                    b64 = base64.b64encode(img_bytes).decode("utf-8")
                    figma_screenshot_data_url = f"data:image/png;base64,{b64}"
                    print(f"  Screenshot saved: {saved_paths[0].name}")
            except Exception as exc:
                print(f"  [WARNING] Could not fetch Figma screenshot: {exc}")

        # --- 3. Fetch example stories for format reference (optional) ---
        example_stories_text = ""
        if example_story_ids and self._jira:
            print(f"  Fetching {len(example_story_ids)} example story(s) for format reference...")
            examples: list[str] = []
            for sid in example_story_ids:
                try:
                    story = self._jira.get_story(sid)
                    examples.append(_format_story_for_prompt(story))
                    print(f"  Example: {sid} — {story.summary}")
                except Exception as exc:
                    print(f"  [WARNING] Could not fetch example story {sid}: {exc}")
            if examples:
                example_stories_text = "\n\n".join(examples)

        # --- 4. Fetch Epic context (optional) ---
        epic_context = ""
        if epic_key and self._jira:
            print(f"  Fetching Epic context: {epic_key}...")
            try:
                epic = self._jira.get_story(epic_key)
                epic_context = f"{epic.key}: {epic.summary}"
                if epic.description:
                    epic_context += f"\n{epic.description[:800]}"
                print(f"  Epic: {epic.summary}")
            except Exception as exc:
                print(f"  [WARNING] Could not fetch Epic {epic_key}: {exc}")

        # --- 5. Build Figma context text for prompt ---
        figma_prompt_context = ""
        if figma_url:
            try:
                parsed = FigmaClient.parse_figma_url(figma_url)
                figma_prompt_context = (
                    f"Figma design file: {parsed.file_key}"
                    + (f", node: {parsed.node_id}" if parsed.node_id else "")
                    + "\nThis is the UI design mockup for the features described in the specification above."
                )
            except Exception:
                figma_prompt_context = f"Figma design reference: {figma_url}"

        # --- 6. Generate stories via Claude AI ---
        print("  Generating User Stories via Claude AI...")
        stories = self._claude.generate_user_stories(
            spec_text=spec_text,
            epic_context=epic_context,
            example_stories_text=example_stories_text,
            figma_context=figma_prompt_context,
        )
        print(f"  Generated {len(stories)} user story(s).")

        # --- 7. Render HTML ---
        html_content = self._render_html(
            page_title=page_title,
            confluence_url=confluence_url,
            figma_url=figma_deep_link,
            figma_screenshot_data_url=figma_screenshot_data_url,
            epic_key=epic_key,
            epic_context=epic_context,
            stories=stories,
        )

        # --- 8. Write output ---
        html_path = self._write_output(page_title, html_content)
        print(f"  Written: {html_path}")
        return str(html_path)

    # ------------------------------------------------------------------
    # Internal steps
    # ------------------------------------------------------------------

    def _render_html(
        self,
        page_title: str,
        confluence_url: str,
        figma_url: Optional[str],
        figma_screenshot_data_url: Optional[str],
        epic_key: Optional[str],
        epic_context: str,
        stories: list[UserStory],
    ) -> str:
        template = self._jinja.get_template("user_stories.html.j2")
        return template.render(
            page_title=page_title,
            confluence_url=confluence_url,
            figma_url=figma_url,
            figma_screenshot_data_url=figma_screenshot_data_url,
            epic_key=epic_key,
            epic_context=epic_context,
            stories=stories,
            generated_date=today_str(self._settings.output.date_format),
            branding=self._settings.branding,
        )

    def _write_output(self, page_title: str, html: str) -> Path:
        date_str = today_str(self._settings.output.date_format)
        safe_title = sanitize_filename(page_title)[:40]
        base_name = self._settings.output.user_stories_filename_pattern.format(
            title=safe_title,
            date=date_str,
        )
        out_dir = ensure_dir(self._settings.paths.output_user_stories)
        return write_text(html, out_dir / f"{base_name}.html")
