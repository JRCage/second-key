// Second Key — protocol engine (deterministic, no LLM).
//
// Two tools, one ladder: PROCEED / VERIFY / STOP.
//   screenMessage(text)      — judge an inbound message or request.
//   buildStatement(input)    — restate a PLANNED action in plain language,
//                              with the protocol checklist.
//   readability(text)        — the plain-language rules, enforced in code.
//
// The pattern library is data (_patterns.js). The same ids and ladder are
// mirrored in the Android port (android/.../Protocol.kt) and the CLI.
import { PATTERNS, GENERIC_SIGNALS } from "./_patterns.js";

// ---------------------------------------------------------------- screen

function matchSignals(text, signals) {
  const hits = [];
  for (const s of signals) {
    if (s.re.test(text)) hits.push(s);
  }
  return hits;
}

export function screenMessage(rawText) {
  const text = String(rawText || "");
  const matchedPatterns = [];
  let anyHard = false;

  for (const p of PATTERNS) {
    const hits = matchSignals(text, p.signals);
    const score = hits.reduce((a, s) => a + s.points, 0);
    if (hits.length && score >= 3) {
      if (hits.some((s) => s.hard)) anyHard = true;
      matchedPatterns.push({
        id: p.id,
        name: p.name,
        what_it_is: p.whatItIs,
        score,
        signals: hits.map((s) => ({ id: s.id, label: s.label, hard: !!s.hard })),
      });
    }
  }
  matchedPatterns.sort((a, b) => b.score - a.score);

  const genericHits = matchSignals(text, GENERIC_SIGNALS);
  const genericScore = genericHits.reduce((a, s) => a + s.points, 0);
  const hardGenerics = genericHits.filter((s) => s.hard);
  if (hardGenerics.length) anyHard = true;
  const moneyAsk = genericHits.some((s) => s.id === "money-ask");

  let verdict;
  if (
    (matchedPatterns.length && anyHard) ||
    hardGenerics.length >= 2 ||
    (hardGenerics.length >= 1 && moneyAsk)
  ) {
    verdict = "stop";
  } else if (matchedPatterns.length || genericScore >= 3 || hardGenerics.length >= 1) {
    verdict = "verify";
  } else {
    verdict = "proceed";
  }

  const guidance = {
    stop: [
      "Do not send money. Do not share numbers, codes, or passwords.",
      "End the call or the chat. You do not owe them a reason.",
      "Check with a person you trust, or call the real office on a number you already have — never a number from the message.",
    ],
    verify: [
      "Do not act on this message yet.",
      "Check through a channel you chose: the number on your bank card, or a number you saved long ago.",
      "Never use a number or a link from the message itself.",
    ],
    proceed: [
      "No known trick matched this message.",
      "Stay normal-careful. If it starts asking for money, gift cards, or codes, check again before you act.",
    ],
  }[verdict];

  return {
    service: "second-key",
    tool: "screen",
    verdict,
    action:
      verdict === "stop"
        ? "Stop. Do not comply. Tell your trusted contact."
        : verdict === "verify"
          ? "Pause. Verify through an independent channel before you act."
          : "Proceed with normal care.",
    matched_patterns: matchedPatterns,
    generic_signals: genericHits.map((s) => ({ id: s.id, label: s.label, hard: !!s.hard })),
    guidance,
    confirmation_script:
      verdict === "proceed"
        ? null
        : "Say this: “Before I send money or share numbers, I always check first. I will hang up and call back on the number I already have. If this is real, it will still be real after I check.”",
    trusted_contact_draft:
      verdict === "proceed"
        ? null
        : "Hi. My assistant ran a check on a message I got. The check said: " +
          (verdict === "stop"
            ? "it matches a known trick, and I should not act on it."
            : "parts of it need a check before I act.") +
          " I have not sent any money or shared any numbers. Please call me when you can.",
  };
}

// ------------------------------------------------------------ readability

const JARGON = [
  "utilize", "utilise", "facilitate", "initiate", "transaction", "transmit",
  "remittance", "beneficiary", "irrevocable", "consequently", "furthermore",
  "additionally", "approximately", "sufficient", "assistance", "regarding",
  "prior to", "in order to", "leverage", "implement", "expedite", "forthwith",
];

export const READABILITY_RULES = {
  max_sentence_words: 16,
  max_avg_words_per_sentence: 12,
  max_fk_grade: 6.5,
};

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function readability(text) {
  const sentences = String(text)
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const perSentence = sentences.map((s) => s.split(/\s+/).filter(Boolean));
  const wordCounts = perSentence.map((w) => w.length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const totalSyllables = perSentence.flat().reduce((a, w) => a + countSyllables(w), 0);
  const avg = sentences.length ? totalWords / sentences.length : 0;
  const longest = wordCounts.length ? Math.max(...wordCounts) : 0;
  const fk =
    sentences.length && totalWords
      ? 0.39 * (totalWords / sentences.length) + 11.8 * (totalSyllables / totalWords) - 15.59
      : 0;
  const lower = String(text).toLowerCase();
  const jargon = JARGON.filter((j) => new RegExp(`\\b${j}\\b`).test(lower));
  const checks = {
    longest_sentence_words: longest,
    longest_ok: longest <= READABILITY_RULES.max_sentence_words,
    avg_words_per_sentence: Math.round(avg * 10) / 10,
    avg_ok: avg <= READABILITY_RULES.max_avg_words_per_sentence,
    fk_grade: Math.round(fk * 10) / 10,
    fk_ok: fk <= READABILITY_RULES.max_fk_grade,
    jargon_found: jargon,
    jargon_ok: jargon.length === 0,
  };
  return {
    sentences: sentences.length,
    words: totalWords,
    rules: READABILITY_RULES,
    ...checks,
    pass: checks.longest_ok && checks.avg_ok && checks.fk_ok && checks.jargon_ok,
  };
}

// ------------------------------------------------------------- statement

const RISKY_METHODS = ["wire", "crypto", "bitcoin", "gift card", "cash", "zelle", "cash app", "venmo"];

function money(n) {
  return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function buildStatement(input) {
  const b = input || {};
  const principal = String(b.principal_name || "").trim();
  const verb = String(b.verb || "send").trim() || "send";
  const method = String(b.method || "").trim();
  const amount = Number(b.amount);
  const recipient = String(b.recipient || "").trim();
  const purpose = String(b.purpose || "").trim();
  const isNew = !!b.is_new_recipient;
  const reversible = !!b.reversible;
  const contactName = String(b.trusted_contact_name || "").trim();

  if (!recipient) return { error: "no_recipient", detail: "Send {recipient} — who or what gets the money or the change." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "bad_amount", detail: "Send {amount} as a number above zero." };

  // Risk score → cooling-off ladder.
  let points = 0;
  const flags = [];
  if (!reversible) { points += 2; flags.push("This cannot be undone once it is done."); }
  if (isNew) { points += 2; flags.push("The recipient is new. You have not paid them before."); }
  if (amount >= 5000) { points += 2; flags.push("The amount is large: " + money(amount) + "."); }
  else if (amount >= 1000) { points += 1; flags.push("The amount is not small: " + money(amount) + "."); }
  if (method && RISKY_METHODS.some((m) => method.toLowerCase().includes(m))) {
    points += 1;
    flags.push("The way this is paid (" + method + ") is the way trick callers ask for most.");
  }
  const risk = points >= 4 ? "high" : points >= 2 ? "elevated" : "standard";
  const coolHours = risk === "high" ? 48 : risk === "elevated" ? 24 : 1;

  // The plain-language statement. Built from short template sentences;
  // readability() below grades it, and the tests fail the build if it
  // breaks the rules.
  const s = [];
  s.push(principal ? `${principal}, read this page before any money moves.` : "Read this page before any money moves.");
  s.push(`You are about to ${verb} ${money(amount)}${method ? " by " + method : ""}.`);
  s.push(`The money goes to ${recipient}.`);
  s.push(isNew ? "You have not sent money to this person before." : "You have sent money to this person before.");
  if (purpose) s.push(`The reason given is ${purpose.replace(/\.+$/, "")}.`);
  if (!reversible) {
    s.push(method ? `A ${method} cannot be undone.` : "This payment cannot be undone.");
    s.push("Once the money is sent, it is gone for good.");
    s.push("No bank can pull it back.");
  } else {
    s.push("This can be undone after it is sent, if you act fast.");
  }
  s.push(`Wait ${coolHours === 1 ? "at least one hour" : coolHours + " hours"} before you ${verb} it.`);
  const statementText = s.join(" ");

  const checklist = [
    {
      step: 1,
      title: "Read it out loud",
      text: "Read the words above out loud, or ask your agent to read them to you. Slow is good. A trick falls apart when it is said out loud.",
    },
    {
      step: 2,
      title: "Check on a number you trust",
      text: "Call the person or the office on a number you saved long ago, or the number on your bank card. Never use a number from the message that asked for the money.",
      script:
        "Say this: “Before I send money, I always check first. I will call back on the number I have for you. If this is real, it will still be real after I check.”",
    },
    {
      step: 3,
      title: "Wait",
      text:
        coolHours === 1
          ? "Wait at least one hour. Do one other thing first. If it still makes sense after, it is your call."
          : `Wait ${coolHours} hours before you send this. Real bills can wait. Trick callers cannot wait — that is one way to tell them apart.`,
    },
    {
      step: 4,
      title: "Tell your trusted contact",
      text: contactName
        ? `Send ${contactName} the note below, or call them and read this page.`
        : "Send the note below to the person you trust most with money calls, or call them and read this page.",
    },
  ];

  const draft =
    `Hi${contactName ? " " + contactName.split(" ")[0] : ""}. ` +
    `${principal || "I"} am about to ${verb} ${money(amount)}${method ? " by " + method : ""} to ${recipient}. ` +
    (purpose ? `The reason given is ${purpose.replace(/\.+$/, "")}. ` : "") +
    `The Second Key check says to wait ${coolHours === 1 ? "one hour" : coolHours + " hours"} first. ` +
    `Nothing has been sent yet. Please call ${principal || "me"} when you can.`;

  const read = readability(statementText);

  return {
    service: "second-key",
    tool: "statement",
    statement: statementText,
    statement_sentences: s,
    risk_level: risk,
    risk_flags: flags,
    cooling_off_hours: coolHours,
    checklist,
    trusted_contact_draft: draft,
    readability: read,
    note: "This is a pause-and-verify protocol. It is not legal, medical, or financial advice.",
  };
}

export function renderStatementHtml(result) {
  const esc = (t) =>
    String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sentences = result.statement_sentences.map((x) => `<p>${esc(x)}</p>`).join("\n");
  const steps = result.checklist
    .map(
      (c) =>
        `<li><strong>${esc(c.title)}.</strong> ${esc(c.text)}${c.script ? `<br><em>${esc(c.script)}</em>` : ""}</li>`,
    )
    .join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Second Key — read this first</title>
<style>
body{font-family:Georgia,serif;font-size:24px;line-height:1.65;max-width:34em;margin:2em auto;padding:0 1em;color:#111;background:#fff}
h1{font-size:32px;line-height:1.3}
li{margin-bottom:.9em}
.note{font-size:19px;color:#444}
@media print{body{font-size:22pt}}
</style></head><body>
<h1>Read this before any money moves</h1>
${sentences}
<h1>Then do these four things</h1>
<ol>${steps}</ol>
<h1>A note you can send</h1>
<p>${esc(result.trusted_contact_draft)}</p>
<p class="note">${esc(result.note)}</p>
</body></html>`;
}
