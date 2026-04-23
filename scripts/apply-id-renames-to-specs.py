"""
Generates and runs sed replacements across spec files using the rename mapping.
Usage: python3 scripts/apply-id-renames-to-specs.py
"""
import json
import subprocess
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAPPING = os.path.join(ROOT, 'tmp', 'id-rename-mapping.json')

SPEC_FILES = [
    'specs/releases-stages2-7-test-cases.md',
    'specs/cross-cutting-wf11-15-test-cases.md',
    'specs/releases-stage1-creation-scoping-test-cases.md',
    'specs/landing-page-test-cases.md',
    'specs/products-test-cases.md',
    'docs/ai/knowledge-base/corpus/scenario-index.md',
    'docs/ai/knowledge-base/feature-registry/releases.md',
    'docs/ai/knowledge-base/knowledge/data-protection.md',
    'docs/ai/knowledge-base/knowledge/reports-dashboards.md',
    'docs/ai/knowledge-base/knowledge/product-requirements.md',
    'docs/ai/knowledge-base/change-impact.md',
]

with open(MAPPING) as f:
    renames = json.load(f)

print(f"Loaded {len(renames)} renames from mapping file")

for filepath in SPEC_FILES:
    fullpath = os.path.join(ROOT, filepath)
    if not os.path.exists(fullpath):
        print(f"  SKIP (not found): {filepath}")
        continue

    with open(fullpath, 'r') as f:
        content = f.read()

    count = 0
    for r in renames:
        old_id = r['oldId']
        new_id = r['newId']
        if old_id in content:
            content = content.replace(old_id, new_id)
            count += 1

    with open(fullpath, 'w') as f:
        f.write(content)

    print(f"  {filepath}: {count} IDs replaced")

print("\nDone.")
