import re
MD='docs/ai/automation-testing-plan.md'
HTML='docs/ai/automation-testing-plan.html'
md=open(MD).read()
html=open(HTML).read()
wfs=re.findall(r'^## WORKFLOW (\d+)',md,re.M)
items=re.findall(r'^\s*- \[[ x]\] ',md,re.M)
print('MD:',len(md.splitlines()),'lines |',len(wfs),'WFs:',','.join(wfs),'|',len(items),'items')
hn=sorted(set(int(x) for x in re.findall(r'\bn:(\d+),',html) if int(x)<=20))
hi=len(re.findall(r'\[(?:true|false),\s*"',html))
print('HTML:',len(html.splitlines()),'lines | WF n:',hn,'|',hi,'items')
print('WF12 sections in HTML:',len(re.findall(r'"12\.\d+',html)))
print('WF13 sections in HTML:',len(re.findall(r'"13\.\d+',html)))
print('WF16 present:',('n:16,' in html))
print('Section 3.8 present:',('3.8 Product Configuration' in html))
