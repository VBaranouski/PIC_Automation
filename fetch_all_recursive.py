"""
Recursively fetch ALL Confluence pages under a parent page ID.
Saves full text content + a master index JSON.
"""
import json, urllib.request, ssl, sys, os, re, time

OUT_DIR = "/tmp/confluence_all"
ROOT_PAGE_ID = "450757876"  # 1.3. Release Management Flow

# ── Read .env ──────────────────────────────────────────────────────────────────
env = {}
with open('/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/.env') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.split('#')[0].strip()

base_url = env['CONFLUENCE_BASE_URL'].rstrip('/')
token    = env['CONFLUENCE_PERSONAL_TOKEN']

# ── SSL ctx ────────────────────────────────────────────────────────────────────
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode    = ssl.CERT_NONE
HEADERS = {"Authorization": f"Bearer {token}"}

def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
        return json.loads(r.read())

def get_children(page_id):
    """Return list of {id, title} for direct children."""
    results = []
    start = 0
    while True:
        data = get(f"{base_url}/rest/api/content/{page_id}/child/page?limit=50&start={start}")
        batch = data.get('results', [])
        results.extend(batch)
        if len(batch) < 50:
            break
        start += 50
    return [{"id": p['id'], "title": p['title']} for p in results]

def get_page_content(page_id):
    """Return full page data with body.storage expanded."""
    return get(f"{base_url}/rest/api/content/{page_id}?expand=body.storage,version,metadata.labels")

def html_to_text(html):
    """Strip HTML tags to plain text."""
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'&quot;', '"', text)
    text = re.sub(r'&#39;', "'", text)
    text = re.sub(r'&nbsp;', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ── Recursive fetch ────────────────────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)

all_pages = {}   # page_id -> metadata dict
fetch_errors = []

def safe_filename(page_id, title):
    safe = re.sub(r'[^\w\s\-.]', '_', title)[:60]
    return f"{page_id}_{safe}.txt"

def fetch_tree(page_id, depth=0, parent_id=None):
    indent = "  " * depth
    try:
        data = get_page_content(page_id)
    except Exception as e:
        print(f"{indent}ERROR fetching {page_id}: {e}")
        fetch_errors.append({"id": page_id, "error": str(e)})
        return

    title   = data.get('title', 'Unknown')
    version = data.get('version', {}).get('number', 0)
    body_html = data.get('body', {}).get('storage', {}).get('value', '')
    text    = html_to_text(body_html)

    print(f"{indent}[{page_id}] {title}  ({len(text)} chars)")

    # Save text file
    fname = safe_filename(page_id, title)
    with open(f"{OUT_DIR}/{fname}", 'w', encoding='utf-8') as f:
        f.write(f"TITLE: {title}\nID: {page_id}\nVERSION: {version}\nPARENT: {parent_id or 'root'}\nDEPTH: {depth}\n\n")
        f.write(text)

    all_pages[page_id] = {
        "title": title,
        "version": version,
        "depth": depth,
        "parent": parent_id,
        "chars": len(text),
        "file": fname,
        "children": []
    }

    # Recurse into children
    try:
        children = get_children(page_id)
    except Exception as e:
        print(f"{indent}  ERROR getting children of {page_id}: {e}")
        children = []

    for child in children:
        all_pages[page_id]["children"].append(child["id"])
        fetch_tree(child["id"], depth + 1, page_id)
        time.sleep(0.1)  # be polite

# ── Start from root ────────────────────────────────────────────────────────────
print(f"Starting recursive fetch from root: {ROOT_PAGE_ID}")
print(f"Output directory: {OUT_DIR}\n")

# Also fetch the root page itself
fetch_tree(ROOT_PAGE_ID, depth=0, parent_id=None)

# ── Save master index ──────────────────────────────────────────────────────────
index = {
    "root": ROOT_PAGE_ID,
    "total_pages": len(all_pages),
    "errors": fetch_errors,
    "pages": all_pages
}
with open(f"{OUT_DIR}/_index.json", 'w', encoding='utf-8') as f:
    json.dump(index, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"DONE. Fetched {len(all_pages)} pages, {len(fetch_errors)} errors.")
print(f"Index saved to {OUT_DIR}/_index.json")

# Print tree summary
print("\nPAGE TREE:")
def print_tree(page_id, depth=0):
    if page_id not in all_pages:
        return
    p = all_pages[page_id]
    print(f"{'  '*depth}[{page_id}] {p['title']} ({p['chars']} chars)")
    for child_id in p.get('children', []):
        print_tree(child_id, depth + 1)

print_tree(ROOT_PAGE_ID)
