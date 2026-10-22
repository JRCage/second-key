#!/usr/bin/env node
// Second Key CLI — the pause-and-verify protocol, offline, in one file.
// No dependencies. Node 18+. Nothing you paste leaves the machine.
//
//   node second-key-cli.js screen "the message text"
//   node second-key-cli.js screen --file message.txt
//   node second-key-cli.js statement --amount 4000 --recipient "a man named David Cole" \
//        --method "wire transfer" --new-recipient --irreversible \
//        --purpose "roof repairs" --name Margaret --contact Ana
//   node second-key-cli.js statement ... --html   (large-print page instead of JSON)
//
// Exit codes: screen → 0 proceed, 1 verify, 2 stop. statement → 0.
// ==== BEGIN PROTOCOL CORE (same engine as the hosted API) ====
__PATTERNS_AND_ENGINE__
// ==== END PROTOCOL CORE ====

const fs = require("node:fs");
const args = process.argv.slice(2);
const cmd = args[0];

function flag(name) { return args.includes("--" + name); }
function opt(name) {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : undefined;
}

if (cmd === "screen") {
  let text = args[1] && !args[1].startsWith("--") ? args[1] : "";
  const file = opt("file");
  if (file) text = fs.readFileSync(file, "utf8");
  if (!text.trim()) {
    console.error('usage: second-key-cli.js screen "text" | screen --file msg.txt');
    process.exit(64);
  }
  const out = screenMessage(text);
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.verdict === "stop" ? 2 : out.verdict === "verify" ? 1 : 0);
}

if (cmd === "statement") {
  const input = {
    principal_name: opt("name") || "",
    verb: opt("verb") || "send",
    method: opt("method") || "",
    amount: Number(opt("amount")),
    recipient: opt("recipient") || "",
    purpose: opt("purpose") || "",
    trusted_contact_name: opt("contact") || "",
    is_new_recipient: flag("new-recipient"),
    reversible: flag("reversible"),
  };
  const out = buildStatement(input);
  if (out.error) {
    console.error(JSON.stringify(out, null, 2));
    process.exit(64);
  }
  if (flag("html")) console.log(renderStatementHtml(out));
  else console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

console.log(`Second Key CLI — a pause-and-verify protocol for agents acting for older people.

Commands:
  screen "text" | screen --file msg.txt
      Judge a message: proceed / verify / stop, with the patterns matched.
      Exit code 0 = proceed, 1 = verify, 2 = stop.
  statement --amount N --recipient "..." [--method "wire transfer"]
            [--new-recipient] [--irreversible is default; --reversible to change]
            [--purpose "..."] [--name FirstName] [--contact FirstName] [--html]
      Plain-language restatement + checklist + trusted-contact draft.`);
process.exit(cmd ? 64 : 0);
