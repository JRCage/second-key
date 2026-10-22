# Second Key — a pause-and-verify protocol for agents serving elderly users

Agents that act for older people get asked to do consequential things
fast: move money, answer urgent messages from "family," share codes and
account numbers. Scam callers design those moments. Second Key gives
the agent a rule it can run **before** it complies — stop, say it
plain, check first.

Two checks, one protocol:

- **Scam screen** — paste a message, email, or call script. Get back
  `proceed` / `verify` / `stop` against an elder-fraud pattern library
  (grandparent bail, IRS / Social Security threats, fake tech support,
  prize-with-a-fee, romance, bank fraud department, Medicare card,
  guaranteed investment), with the signals found in plain words, what
  to do next, a word-for-word confirmation script, and a
  trusted-contact note draft.
- **Consequence statement** — describe a planned action (amount, who,
  method, can it be undone). Get back a plain-language restatement
  checked against readability rules, a risk level, cooling-off hours,
  the four-step verification checklist with a confirmation script, and
  a trusted-contact note draft.

Privacy posture: the local editions run fully offline. Nothing you
paste leaves the machine.

## Three ways to run it

### 1. MCP server (this repo, npm)

Zero dependencies, Node 18+. Exposes `screen_message` and
`consequence_statement` as native MCP tools over stdio.

    npx second-key-mcp

or from this repo:

    node mcp/second-key-mcp.built.js

Client config:

    {
      "mcpServers": {
        "second-key": { "command": "npx", "args": ["-y", "second-key-mcp"] }
      }
    }

Optional: set `SECOND_KEY_API` to the hosted base URL
(`https://second-key-662.pages.dev`) to run against the hosted tier
instead of the local engine. Default is local and offline. Registry
metadata: [`mcp/server.json`](mcp/server.json) —
`io.github.JRCage/second-key`.

### 2. Hosted API

Live at https://second-key-662.pages.dev (x402-metered, free eval
tier):

- `POST /api/screen` — the scam screen ($0.10)
- `POST /api/statement` — the consequence statement ($0.25)
- `POST /api/setup` — assisted setup intake ($25)

### 3. Offline CLI (Gumroad)

The same protocol as one self-contained Node file — the founding
edition, $19 one-time:

**https://showme2.gumroad.com/l/second-key**

    node gumroad/second-key-cli.js screen "Grandma, it's me. I was arrested..."
    node gumroad/second-key-cli.js statement --amount 4000 --to "a bail bondsman" --method "gift cards"

Exit codes make it scriptable: 0 = proceed, 1 = verify, 2 = stop.

## Layout

- `site/functions/api/_engine.js` + `_patterns.js` — the canonical
  protocol engine and elder-fraud pattern library. Everything else is
  built from these two files.
- `mcp/` — the MCP server. `second-key-mcp.built.js` is the single-file
  build (engine inlined by `build-mcp.mjs`); `package.json` +
  `server.json` are the npm / MCP Registry metadata.
- `gumroad/` — the offline CLI source (`second-key-cli.js`) and its
  template.
- `tests/` — gate tests: every fixture verdict, the statement fixture,
  readability. Run: `node tests/run-tests.mjs` (exit 1 on any failure).

## Honest limits

A pause-and-verify protocol. Not legal, medical, or financial advice.
The screen checks text against a fixed pattern library; it cannot
catch every trick. It is a second key, not the only lock.

## License

MIT — see [LICENSE](LICENSE).
