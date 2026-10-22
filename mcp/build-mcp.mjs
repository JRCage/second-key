// Builds the single-file MCP server and the single-file Gumroad CLI by
// inlining the canonical protocol core (site/functions/api/_patterns.js +
// _engine.js) into their templates. The API stays the source of truth;
// rerun this after any pattern/engine change.
//   node mcp/build-mcp.mjs
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const patternsSrc = await readFile(new URL("site/functions/api/_patterns.js", root), "utf8");
const engineSrc = await readFile(new URL("site/functions/api/_engine.js", root), "utf8");

function core() {
  const p = patternsSrc
    .replace("export const PATTERNS", "const PATTERNS")
    .replace("export const GENERIC_SIGNALS", "const GENERIC_SIGNALS");
  const e = engineSrc
    .replace(/import \{ PATTERNS, GENERIC_SIGNALS \} from "\.\/_patterns\.js";/, "")
    .replace("export function screenMessage", "function screenMessage")
    .replace("export function readability", "function readability")
    .replace("export const READABILITY_RULES", "const READABILITY_RULES")
    .replace("export function buildStatement", "function buildStatement")
    .replace("export function renderStatementHtml", "function renderStatementHtml");
  return p + "\n" + e;
}

const mcpTpl = await readFile(new URL("mcp/second-key-mcp.js", root), "utf8");
if (!mcpTpl.includes("__PATTERNS_AND_ENGINE__")) throw new Error("MCP template placeholder missing");
await writeFile(new URL("mcp/second-key-mcp.built.js", root), mcpTpl.replace("__PATTERNS_AND_ENGINE__", core()));
console.log("built mcp/second-key-mcp.built.js");

const cliTpl = await readFile(new URL("gumroad/cli-template.js", root), "utf8");
if (!cliTpl.includes("__PATTERNS_AND_ENGINE__")) throw new Error("CLI template placeholder missing");
await writeFile(new URL("gumroad/second-key-cli.js", root), cliTpl.replace("__PATTERNS_AND_ENGINE__", core()));
console.log("built gumroad/second-key-cli.js");
