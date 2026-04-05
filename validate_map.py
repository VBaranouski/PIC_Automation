import json

with open('docs/ai/application-map.json') as f:
    d = json.load(f)

print('=== META ===')
print('Version:', d['meta']['version'])
print('Updated:', d['meta']['lastUpdated'])
print('Nodes:', len(d['nodes']))
print('Links:', len(d['links']))

print('\n=== NEW NODES ===')
new_ids = ['manage-release-progress','clone-release','req-versioning','sa-pql-signoff','fcsr-review-stage','post-fcsr-stage']
for nid in new_ids:
    for n in d['nodes']:
        if n['id'] == nid:
            sub_count = len(n.get('subSections', []))
            print(f'  {nid}: type={n["type"]}, subSections={sub_count}')

print('\n=== scope-review-tab ELEMENTS ===')
for n in d['nodes']:
    if n['id'] == 'scope-review-tab':
        for k in n.get('elements', {}).keys():
            print(' ', k)
        print(' confluenceRef:', n.get('confluenceRef'))

print('\n=== release-detail DIALOGS (full list) ===')
for n in d['nodes']:
    if n['id'] == 'release-detail':
        for diag in n.get('dialogs', []):
            print(' ', diag['id'])

print('\n=== LINKS involving new nodes ===')
for lnk in d['links']:
    src, tgt = lnk['source'], lnk['target']
    if src in new_ids or tgt in new_ids:
        print(f'  {src} -> {tgt} [{lnk.get("label","")}]')

print('\n=== WORKFLOW STAGES ===')
for stage in d.get('workflowStages', {}).get('releaseWorkflow', {}).get('stages', []):
    print(f'  Stage: {stage["name"]} | keys: {[k for k in stage.keys()]}')
