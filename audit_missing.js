const fs = require("fs"), vm = require("vm");
const p = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.html";
const t = fs.readFileSync(p, "utf8");

const m = t.match(/<script id="doc-auto-case-details" type="application\/json">([\s\S]*?)<\/script>/);
const details = JSON.parse(m[1].trim());

const between = (a, b) => { const s = t.indexOf(a), e = t.indexOf(b, s); return t.slice(s, e); };

const code = [
  between("const DOC_SCENARIO_CASES = {", "const AUTO_CASE_STATUS = {"),
  between("function getExplicitPlanRefs(explicitAutoCases) {", "/* pipeline stages for workflows 4–10 */"),
  between("function splitSpecs(specText) {", "function countWF(wf) {"),
  "module.exports = { WF, resolveAutoCases };"
].join("\n\n");

const sandbox = { module: { exports: {} }, exports: {}, DOC_AUTO_CASE_DETAILS: details };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const { WF, resolveAutoCases } = sandbox.module.exports;
const normalize = id => String(id).replace(/^(?:ATC|ACT)-/, "");

const parseDesc = desc => {
  const s = String(desc || "").trim();
  const mm = s.match(/^`([^`]+)`\s+—\s+(.+)$/);
  return mm ? { specPath: "tests/" + mm[1].replace(/^\/+/, ""), title: mm[2] } : { specPath: "", title: s };
};

const rows = [];
for (const wf of WF) {
  wf.sections.forEach((sec, si) => sec.items.forEach((item, ii) => {
    const cases = resolveAutoCases(wf, si, ii, item[0], item[3]);
    if (!cases) return;
    for (const [id, desc] of cases) {
      const nid = normalize(id);
      const d = details[nid];
      const ok = !!d && ["title", "spec_path", "steps", "expected_results"].every(k => Object.prototype.hasOwnProperty.call(d, k));
      if (!ok) {
        const parsed = parseDesc(desc);
        rows.push({ id: nid, wf: wf.n, section: sec.title || "(no section)", scenario: item[1], spec: parsed.specPath, title: parsed.title });
      }
    }
  }));
}

rows.sort((a, b) => a.id.localeCompare(b.id) || a.wf - b.wf);
console.log("MISSING COUNT:", rows.length);
rows.forEach(r => console.log(" ", r.id, "| WF" + r.wf, "|", r.section, "|", r.spec));
