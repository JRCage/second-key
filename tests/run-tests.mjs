// Second Key — gate tests. Imports the engine straight from the site
// Functions dir (the same file the API routes run) and checks every
// fixture verdict, the consequence-statement fixture, and readability.
// Exit code 1 if anything fails. Results written to results.json.
import { writeFile } from "node:fs/promises";
import { screenMessage, buildStatement, renderStatementHtml } from "../site/functions/api/_engine.js";
import { SCREEN_FIXTURES, STATEMENT_FIXTURE } from "./fixtures.mjs";

const results = { screen: [], statement: null, failures: 0 };

for (const f of SCREEN_FIXTURES) {
  const out = screenMessage(f.text);
  const verdictOk = out.verdict === f.expect;
  const patternOk = f.expectPattern
    ? out.matched_patterns.some((p) => p.id === f.expectPattern)
    : out.matched_patterns.length === 0;
  const ok = verdictOk && patternOk;
  if (!ok) results.failures += 1;
  results.screen.push({
    fixture: f.id,
    expect: f.expect,
    got: out.verdict,
    expect_pattern: f.expectPattern,
    patterns: out.matched_patterns.map((p) => p.id),
    signals: [
      ...out.matched_patterns.flatMap((p) => p.signals.map((s) => s.id)),
      ...out.generic_signals.map((s) => "generic:" + s.id),
    ],
    ok,
  });
  console.log(`${ok ? "PASS" : "FAIL"} screen/${f.id}: expect ${f.expect}, got ${out.verdict}, patterns [${out.matched_patterns.map((p) => p.id).join(", ")}]`);
}

const st = buildStatement(STATEMENT_FIXTURE.input);
const stChecks = {
  risk_ok: st.risk_level === STATEMENT_FIXTURE.expectRisk,
  checklist_ok: Array.isArray(st.checklist) && st.checklist.length === STATEMENT_FIXTURE.expectChecklistSteps,
  script_ok: st.checklist.some((c) => typeof c.script === "string" && c.script.length > 20),
  draft_ok: typeof st.trusted_contact_draft === "string" && st.trusted_contact_draft.includes("4000") === false && st.trusted_contact_draft.includes("$4,000"),
  readability_ok: st.readability && st.readability.pass === true,
  html_ok: renderStatementHtml(st).includes(st.statement_sentences[0].slice(0, 20)),
  cooling_off_ok: st.cooling_off_hours === 48,
};
const stOk = Object.values(stChecks).every(Boolean);
if (!stOk) results.failures += 1;
results.statement = { checks: stChecks, ok: stOk, result: st };
console.log(`${stOk ? "PASS" : "FAIL"} statement/wire-4000: ${JSON.stringify(stChecks)}`);
console.log("statement:", st.statement);
console.log("readability:", JSON.stringify(st.readability));

await writeFile(new URL("./results.json", import.meta.url), JSON.stringify(results, null, 2));
console.log(results.failures === 0 ? "ALL TESTS PASSED" : `${results.failures} FAILURES`);
process.exit(results.failures === 0 ? 0 : 1);
