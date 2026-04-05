# Normalized Requirements Schema

Normalize Jira stories, Confluence specs, and free-text stories into the same JSON shape before generating test cases.

```json
{
  "source_type": "jira | confluence | free_text",
  "source_ref": "PIC-123 | CONF-123456 | product-owner-can-edit-product",
  "source_title": "short title",
  "generated_on": "2026-03-27",
  "source_url": "optional original URL",
  "summary": "plain-language summary",
  "description": "plain-text body",
  "business_goal": "what the user or business needs",
  "actors": ["Product Owner"],
  "preconditions": ["authenticated user exists"],
  "acceptance_criteria": [
    {
      "id": "AC1",
      "text": "plain text acceptance criterion",
      "priority": "High | Medium | Low"
    }
  ],
  "rules_and_constraints": ["permission rule", "validation rule"],
  "entities": ["Product", "Digital Offer"],
  "test_data_notes": ["sample product must exist in Draft"],
  "permissions": ["Product Owner can edit draft products"],
  "figma_links": ["optional design URL"],
  "attachments": [
    {
      "name": "optional attachment name",
      "type": "image | doc | other",
      "reference": "URL or file reference"
    }
  ],
  "ambiguities": ["missing validation message text"],
  "assumptions": ["free-text story describes draft products only"]
}
```

## Normalization rules

- Convert rich text to plain text while preserving headings, bullets, and lists in readable order.
- Split acceptance criteria into discrete items and assign stable IDs `AC1`, `AC2`, and so on.
- Preserve unknown or missing information in `ambiguities`; do not invent it.
- Use `assumptions` only when they are necessary to continue and clearly label them.
- If a Figma link is present, keep it in `figma_links` and include any retrieved design summary in `attachments` or `rules_and_constraints`.

## Minimum completeness

A normalized bundle is complete enough for test-case generation only when it contains:

- `source_type`
- `source_ref`
- `source_title`
- `description`
- at least one `acceptance_criteria` item, or one explicit `rules_and_constraints` item if the input has no formal ACs

If the input is too vague, produce a partial normalized bundle and mark the missing items under `ambiguities`.
