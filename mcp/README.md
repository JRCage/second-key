# Second Key — MCP server

Two tools an agent calls before it complies or acts for an older person:

- `screen_message` — paste a message, email, or call script; get
  proceed / verify / stop against an elder-fraud pattern library, with
  the signals found and what to do next.
- `consequence_statement` — describe a planned action (amount, who,
  method, can it be undone); get a plain-language restatement that
  passes readability rules, a risk level, cooling-off hours, the
  four-step verification checklist with a word-for-word confirmation
  script, and a trusted-contact note draft.

## Run it
Zero dependencies, Node 18+:

    node second-key-mcp.built.js

Build it from the canonical engine (the same files the hosted API runs):

    node build-mcp.mjs        # inlines ../site/functions/api/_engine.js + _patterns.js

Client config (stdio):

    {
      "mcpServers": {
        "second-key": { "command": "node", "args": ["/path/to/second-key-mcp.built.js"] }
      }
    }

Optional: set `SECOND_KEY_API` to the hosted base URL
(`https://second-key-662.pages.dev`) to run against the hosted tier
instead of the local engine. Default is local and offline.

## Registry status (2026-10-21)
- `server.json` in this folder follows the official MCP Registry schema
  (2025-09-29) and names the server `io.github.JRCage/second-key`.
  Publishing needs the GitHub repo to exist and namespace auth via
  `mcp-publisher login github` — the repo is not created yet (shared
  JRCage account; account-level changes are Joe's call). Package marked
  READY, listing BLOCKED-ON-JOE (repo creation).
- The old modelcontextprotocol/servers repo list is a reference list,
  not the registry; do not submit there expecting discovery.
- Directory listings (mcp.so, Smithery, Glama, PulseMCP) mostly index
  GitHub-hosted servers — same repo gate.

## Honest limits
A pause-and-verify protocol. Not legal, medical, or financial advice.
The screen checks text against a fixed pattern library; it cannot catch
every trick.
