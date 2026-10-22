# Second Key CLI — the offline edition

A pause-and-verify protocol for agents that act for older people, in one
Node file. No dependencies, no account, no network. Nothing you paste
leaves the machine.

## Why it exists
Agents serving elderly users get asked to do consequential things fast:
move money, answer urgent messages from "family," share personal data.
Scam callers design those moments. Second Key gives the agent a rule —
stop, say it plain, check first — as a tool it can run before it complies.

## Install
You need Node 18 or newer. That is all.

    node second-key-cli.js

## Screen a message
    node second-key-cli.js screen "Grandma, it's me. I was arrested..."
    node second-key-cli.js screen --file message.txt

Returns JSON: `verdict` (proceed / verify / stop), the elder-fraud patterns
matched (grandparent bail, IRS or Social Security threat, fake tech
support, prize-with-a-fee, romance, bank fraud department, Medicare card,
guaranteed-investment) with the signals found in plain words, guidance,
a word-for-word confirmation script, and a trusted-contact note draft.

Exit codes make it scriptable: 0 = proceed, 1 = verify, 2 = stop.

## Restate a planned action
    node second-key-cli.js statement --amount 4000 \
      --recipient "a man named David Cole" --method "wire transfer" \
      --new-recipient --purpose "roof repairs" \
      --name Margaret --contact Ana

Returns a plain-language statement of the plan ("You are about to send
$4,000 by wire transfer... A wire transfer cannot be undone."), graded by
readability rules in the code (sentence length, plain words, reading
grade), plus a risk level, cooling-off hours, the four-step checklist
(read it out loud / check on a number you trust / wait / tell your trusted
contact), and the note to send. Add `--html` for the large-print page.

Amount defaults to irreversible unless you pass `--reversible` — wires,
gift cards, and crypto do not come back, and the tool treats silence as
the risky answer.

## The hosted edition
The same protocol runs as a free-tier API and web page (agents can call
it; families can paste into it), and as an MCP server for agent clients.
The CLI is the offline twin: same engine file, same verdicts.

## Honest limits
Second Key is a pause-and-verify protocol. It is not legal, medical, or
financial advice. It checks text against a fixed pattern library; it
cannot promise to catch every trick. It gives your agent a moment, the
facts in plain words, and a person to check with.
