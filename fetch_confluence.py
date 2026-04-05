import json, urllib.request, ssl, sys, os, re, time

# Read env file
env = {}
with open('/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/.env') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            # Strip inline comments
            v = v.split('#')[0].strip()
            env[k.strip()] = v

base_url = env.get('CONFLUENCE_BASE_URL', '').rstrip('/')
personal_token = env.get('CONFLUENCE_PERSONAL_TOKEN', '')

print(f"Base URL: {base_url}", file=sys.stderr)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {"Authorization": f"Bearer {personal_token}", "Content-Type": "application/json"}

def get_page(page_id):
    url = f"{base_url}/rest/api/content/{page_id}?expand=body.storage,version"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())

def get_children(page_id):
    url = f"{base_url}/rest/api/content/{page_id}/child/page?limit=50"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read()).get('results', [])

# Known page IDs from child listing
child_pages = [
    {"id": "450757881", "title": "1.3.1. Release Status States"},
    {"id": "450757886", "title": "1.3.2. Release Creation"},
    {"id": "450758253", "title": "1.3.3. Release Update"},
    {"id": "450758381", "title": "1.3.4. FCSR Readiness Review"},
    {"id": "450758400", "title": "1.3.5. Formal Cybersecurity Review"},
    {"id": "450758656", "title": "1.3.6. Post FCSR Actions"},
    {"id": "450758662", "title": "1.3.7. Final Acceptance"},
    {"id": "467653580", "title": "1.3.8. Release History"},
    {"id": "502420575", "title": "1.3.9. Tooltips in the Release Management Workflow"},
    {"id": "558601191", "title": "1.3.10. Stage Responsible Users in the Workflow and on the Sidebar"},
    {"id": "558601259", "title": "1.3.11. New SBOM Status Field + Updated Validations"},
    {"id": "558601608", "title": "1.3.12. Improved Process and Product Requirements Status Upload"},
    {"id": "558602014", "title": "1.3.13. Penetration Testing Conditions (CSSR Tab - Security Defects Section)"},
]

out_dir = "/tmp/confluence_release"
import os
os.makedirs(out_dir, exist_ok=True)

all_content = {}
for pg in child_pages:
    page_id = pg['id']
    title = pg['title']
    print(f"\nFetching: {title} ({page_id})")
    try:
        data = get_page(page_id)
        content_val = data.get('body', {}).get('storage', {}).get('value', '') or data.get('body', {}).get('view', {}).get('value', '')
        # Try to extract text content using simple html stripping
        import re
        text = re.sub(r'<[^>]+>', ' ', content_val)
        text = re.sub(r'\s+', ' ', text).strip()
        
        all_content[page_id] = {
            "title": title,
            "version": data.get('version', {}).get('number', 0),
            "raw_html": content_val[:500],  # first 500 chars
            "text": text[:3000]  # first 3000 chars of clean text
        }
        
        # Save full content
        fname = f"{out_dir}/{page_id}_{title[:40].replace('/', '_').replace(' ', '_')}.txt"
        with open(fname, 'w') as f:
            f.write(f"TITLE: {title}\nID: {page_id}\n\n")
            f.write(text)
        print(f"  -> Saved {len(text)} chars")
    except Exception as e:
        print(f"  ERROR: {e}")
        all_content[page_id] = {"title": title, "error": str(e)}

# Save summary
with open(f"{out_dir}/summary.json", 'w') as f:
    json.dump(all_content, f, indent=2, ensure_ascii=False)
print(f"\n\nAll content saved to {out_dir}/")
print("Summary JSON written.")
