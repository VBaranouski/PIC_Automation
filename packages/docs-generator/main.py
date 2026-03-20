"""
SE-DevTools - Schneider Electric Developer Productivity CLI
============================================================

Commands:
  release-notes-short    Simple issue table release notes from a JIRA version
  release-notes-detailed Full AI-generated document (PICASso format) from a JIRA version
  pptx-release-notes   SE-branded PPTX presentation from a JSON spec file
  meeting-notes        Meeting notes from transcript files (Claude AI)
  test-cases           Test cases from JIRA user stories (Claude AI)
  user-stories         User Stories from Confluence spec + Figma mockups (Claude AI)

Usage:
  python main.py release-notes-short --version "2.4.1" [--project PROJ] [--publish]
  python main.py release-notes-detailed --version "2.4.1" [--project PROJ] [--spec "spec.txt"] [--publish]
  python main.py pptx-release-notes --spec "spec.json"
  python main.py meeting-notes --file "standup.txt" | --all
  python main.py test-cases --story PROJ-452 [--story PROJ-453 ...]
  python main.py user-stories --confluence-url "https://..." [--figma-url "https://..."] [--example-story PROJ-123] [--epic PROJ-800]
"""

from __future__ import annotations

import sys

import click

from src.ai.claude_client import ClaudeClient
from src.clients.confluence_client import ConfluenceClient
from src.clients.figma_client import FigmaClient
from src.clients.jira_client import JiraClient
from src.config.settings import load_settings
from src.generators.bug_report import BugReportGenerator
from src.generators.email_summary import EmailSummaryGenerator
from src.generators.story_coverage import StoryCoverageGenerator
from src.generators.release_notes_detailed import FullReleaseNotesGenerator
from src.generators.pptx_release_notes import PptxReleaseNotesGenerator
from src.generators.meeting_notes import MeetingNotesGenerator
from src.generators.release_notes_short import ReleaseNotesGenerator
from src.generators.test_cases import TestCasesGenerator
from src.generators.user_stories import UserStoriesGenerator


# ---------------------------------------------------------------------------
# CLI group
# ---------------------------------------------------------------------------

@click.group()
@click.version_option(version="1.0.0", prog_name="SE-DevTools")
@click.pass_context
def cli(ctx: click.Context) -> None:
    """SE-DevTools: Schneider Electric Automated Documentation & Testing CLI."""
    ctx.ensure_object(dict)
    try:
        ctx.obj["settings"] = load_settings()
    except (FileNotFoundError, ValueError) as exc:
        click.echo(click.style(f"\n[ERROR] {exc}\n", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# release-notes command
# ---------------------------------------------------------------------------

@cli.command("release-notes-short")
@click.option(
    "--version", "-v",
    default=None,
    help="JIRA version / release name (e.g. '2.4.1' or 'Sprint 42').",
)
@click.option(
    "--version-id",
    default=None,
    help="JIRA version numeric ID (alternative to --version name).",
)
@click.option(
    "--project", "-p",
    default=None,
    show_default=True,
    help="JIRA project key. Overrides the value in config.yaml.",
)
@click.option(
    "--publish",
    is_flag=True,
    default=False,
    help="Publish generated HTML to Confluence after creation.",
)
@click.option(
    "--release-date",
    default=None,
    help="Override the release date shown in the output (e.g. '28 March 2026').",
)
@click.option(
    "--style",
    default="default",
    show_default=True,
    type=click.Choice(["default", "hacker"], case_sensitive=False),
    help="Visual style for the HTML output.",
)
@click.pass_context
def release_notes_cmd(
    ctx: click.Context,
    version: str | None,
    version_id: str | None,
    project: str | None,
    publish: bool,
    release_date: str | None,
    style: str,
) -> None:
    """Generate release notes from a JIRA version/release."""
    if not version and not version_id:
        raise click.UsageError("Provide either --version or --version-id.")

    settings = ctx.obj["settings"]
    label = version_id or version
    click.echo(click.style(f"\n[SE-DevTools] Generating Release Notes for version '{label}'", bold=True))

    jira = JiraClient(settings.jira)
    confluence = ConfluenceClient(settings.confluence) if publish else None
    generator = ReleaseNotesGenerator(jira, settings, confluence=confluence, style=style)

    try:
        txt_path, html_path = generator.generate(
            version_name=version,
            version_id=version_id,
            project_key=project,
            publish_to_confluence=publish,
            release_date_override=release_date,
        )
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  TXT  -> {txt_path}")
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# meeting-notes command
# ---------------------------------------------------------------------------

@cli.command("meeting-notes")
@click.option(
    "--file", "-f",
    "filename",
    default=None,
    help="Specific transcript filename inside input/transcripts/ (e.g. 'standup.txt').",
)
@click.option(
    "--all",
    "process_all",
    is_flag=True,
    default=False,
    help="Process ALL transcript .txt files in input/transcripts/.",
)
@click.pass_context
def meeting_notes_cmd(ctx: click.Context, filename: str | None, process_all: bool) -> None:
    """Generate meeting notes from transcript files using Claude AI."""
    settings = ctx.obj["settings"]

    if not filename and not process_all:
        click.echo(
            click.style(
                "\n  Please provide --file <filename> or --all to process all transcripts.\n",
                fg="yellow",
            ),
            err=True,
        )
        sys.exit(1)

    click.echo(click.style("\n[SE-DevTools] Generating Meeting Notes", bold=True))

    claude = ClaudeClient(settings.ai)
    generator = MeetingNotesGenerator(claude, settings)

    try:
        if process_all:
            results = generator.generate_all()
            if results:
                click.echo(click.style(f"\n  Done! Processed {len(results)} transcript(s).", fg="green", bold=True))
                for txt_path, html_path in results:
                    click.echo(f"  TXT  -> {txt_path}")
                    click.echo(f"  HTML -> {html_path}")
        else:
            txt_path, html_path = generator.generate(filename)
            click.echo(click.style("\n  Done!", fg="green", bold=True))
            click.echo(f"  TXT  -> {txt_path}")
            click.echo(f"  HTML -> {html_path}")

    except FileNotFoundError as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# test-cases command
# ---------------------------------------------------------------------------

@cli.command("test-cases")
@click.option(
    "--story", "-s",
    "story_ids",
    multiple=True,
    required=True,
    help="JIRA story ID to generate test cases for. Repeatable: -s PROJ-1 -s PROJ-2.",
)
@click.pass_context
def test_cases_cmd(ctx: click.Context, story_ids: tuple[str, ...]) -> None:
    """Generate test cases from JIRA user stories using Claude AI."""
    settings = ctx.obj["settings"]

    click.echo(
        click.style(
            f"\n[SE-DevTools] Generating Test Cases for {len(story_ids)} story(s): "
            + ", ".join(story_ids),
            bold=True,
        )
    )

    jira = JiraClient(settings.jira)
    claude = ClaudeClient(settings.ai)
    generator = TestCasesGenerator(jira, claude, settings)

    try:
        html_paths = generator.generate_multiple(list(story_ids))
        click.echo(click.style(f"\n  Done! Generated {len(html_paths)} file(s).", fg="green", bold=True))
        for html_path in html_paths:
            click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# release-notes-detailed command
# ---------------------------------------------------------------------------

@cli.command("release-notes-detailed")
@click.option(
    "--version", "-v",
    required=True,
    help="JIRA version / release name (e.g. 'PIC-2026-RC-9.1-hotfix').",
)
@click.option(
    "--project", "-p",
    default=None,
    help="JIRA project key. Overrides the value in config.yaml.",
)
@click.option(
    "--spec", "-s",
    "spec_filename",
    default=None,
    help="Spec file in input/release_notes_detailed/ with feature descriptions (auto-detected if omitted).",
)
@click.option(
    "--publish",
    is_flag=True,
    default=False,
    help="Publish generated HTML to Confluence after creation.",
)
@click.pass_context
def full_release_notes_cmd(
    ctx: click.Context,
    version: str,
    project: str | None,
    spec_filename: str | None,
    publish: bool,
) -> None:
    """Generate a full AI-powered release notes document (PICASso format) from JIRA data."""
    settings = ctx.obj["settings"]

    click.echo(click.style(f"\n[SE-DevTools] Generating Full Release Notes for version '{version}'", bold=True))

    jira = JiraClient(settings.jira)
    claude = ClaudeClient(settings.ai)
    confluence = ConfluenceClient(settings.confluence) if publish else None
    generator = FullReleaseNotesGenerator(jira, claude, settings, confluence=confluence)

    try:
        html_path = generator.generate(
            version_name=version,
            project_key=project,
            spec_filename=spec_filename,
            publish_to_confluence=publish,
        )
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# pptx-release-notes command
# ---------------------------------------------------------------------------

@cli.command("pptx-release-notes")
@click.option(
    "--spec", "-s",
    "spec_path",
    required=True,
    help="Path to JSON spec file with presentation content (see output/full_release_notes/template/pptx_spec_template.json).",
)
@click.pass_context
def pptx_release_notes_cmd(ctx: click.Context, spec_path: str) -> None:
    """Generate SE-branded PPTX release notes from a JSON spec file."""
    settings = ctx.obj["settings"]

    click.echo(click.style(f"\n[SE-DevTools] Generating PPTX Release Notes from '{spec_path}'", bold=True))

    generator = PptxReleaseNotesGenerator(settings)

    try:
        pptx_path = generator.generate(spec_path)
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  PPTX -> {pptx_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# bug-report command
# ---------------------------------------------------------------------------

@cli.command("bug-report")
@click.option("--style", type=click.Choice(["default", "hacker"], case_sensitive=False), default="default", help="Visual style for the report.")
@click.option("--since", default=None, help="Only include defects created on or after this date (ISO format, e.g. '2026-03-01').")
@click.pass_context
def bug_report_cmd(ctx: click.Context, style: str, since: str | None) -> None:
    """Generate a SIT / UAT / Production bug & defect report from JIRA."""
    settings = ctx.obj["settings"]

    click.echo(click.style("\n[SE-DevTools] Generating Bug & Defect Report", bold=True))
    click.echo(f"  Style: {style}")
    if since:
        click.echo(f"  Since: {since}")
    click.echo("  Querying JIRA for three reporter groups...")

    jira = JiraClient(settings.jira)
    generator = BugReportGenerator(jira, settings, style=style)

    try:
        html_path = generator.generate(since=since)
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# email-summary command
# ---------------------------------------------------------------------------

@cli.command("email-summary")
@click.pass_context
def email_summary_cmd(ctx: click.Context) -> None:
    """Generate a short executive email summary (SVP/VP level) from the bug/defect data."""
    settings = ctx.obj["settings"]

    click.echo(click.style("\n[SE-DevTools] Generating Executive Email Summary", bold=True))

    jira = JiraClient(settings.jira)
    generator = EmailSummaryGenerator(jira, settings)

    try:
        html_path = generator.generate()
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# story-coverage command
# ---------------------------------------------------------------------------

@cli.command("story-coverage")
@click.pass_context
def story_coverage_cmd(ctx: click.Context) -> None:
    """Generate a story-coverage summary: how many user stories were tested via defects."""
    settings = ctx.obj["settings"]

    click.echo(click.style("\n[SE-DevTools] Generating Story Coverage Summary", bold=True))
    click.echo("  Fetching defects and resolving parent story links...")

    jira = JiraClient(settings.jira)
    generator = StoryCoverageGenerator(jira, settings)

    try:
        html_path = generator.generate()
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# user-stories command
# ---------------------------------------------------------------------------

@cli.command("user-stories")
@click.option(
    "--confluence-url",
    required=True,
    help="Full Confluence page URL containing the functional specification.",
)
@click.option(
    "--figma-url",
    default=None,
    help="Figma design URL (file + node-id). Screenshot will be embedded in HTML output.",
)
@click.option(
    "--example-story",
    "example_stories",
    multiple=True,
    help="JIRA story ID to use as a writing-format reference. Repeatable: --example-story PROJ-1 --example-story PROJ-2.",
)
@click.option(
    "--epic",
    default=None,
    help="Parent Epic/Feature JIRA key for additional context (e.g. PIC-8802).",
)
@click.option(
    "--project", "-p",
    default=None,
    help="JIRA project key. Overrides the value in config.yaml.",
)
@click.pass_context
def user_stories_cmd(
    ctx: click.Context,
    confluence_url: str,
    figma_url: str | None,
    example_stories: tuple[str, ...],
    epic: str | None,
    project: str | None,
) -> None:
    """Generate User Stories from a Confluence spec and optional Figma mockups using Claude AI."""
    settings = ctx.obj["settings"]

    click.echo(click.style("\n[SE-DevTools] Generating User Stories", bold=True))
    click.echo(f"  Spec:  {confluence_url}")
    if figma_url:
        click.echo(f"  Figma: {figma_url}")
    if example_stories:
        click.echo(f"  Examples: {', '.join(example_stories)}")
    if epic:
        click.echo(f"  Epic:  {epic}")

    confluence = ConfluenceClient(settings.confluence)
    figma = FigmaClient(settings.figma) if (figma_url and settings.figma.api_token) else None
    jira = JiraClient(settings.jira) if (example_stories or epic) else None
    claude = ClaudeClient(settings.ai)

    generator = UserStoriesGenerator(confluence, figma, jira, claude, settings)

    try:
        html_path = generator.generate(
            confluence_url=confluence_url,
            figma_url=figma_url,
            example_story_ids=list(example_stories) if example_stories else None,
            epic_key=epic,
            project_key=project,
        )
        click.echo(click.style("\n  Done!", fg="green", bold=True))
        click.echo(f"  HTML -> {html_path}")
    except Exception as exc:
        click.echo(click.style(f"\n  [ERROR] {exc}", fg="red"), err=True)
        import sys; sys.exit(1)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    cli()
