/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { createSwaggerSpec } = require("../swagger");

function getArgValue(args, key) {
  const idx = args.indexOf(key);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml({ title, specObject, redocScriptSrc }) {
  // Embed the full spec so the HTML is completely static (no /api-docs.json fetch).
  const specJson = JSON.stringify(specObject).replace(/</g, "\\u003c");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="redoc-container"></div>
    <script src="${escapeHtml(redocScriptSrc)}"></script>
    <script>
      window.__OPENAPI_SPEC__ = ${specJson};
      Redoc.init(window.__OPENAPI_SPEC__, {}, document.getElementById('redoc-container'));
    </script>
  </body>
</html>
`;
}

async function main() {
  const args = process.argv.slice(2);

  const outFile =
    getArgValue(args, "--out") ||
    path.join(process.cwd(), "docs", "api-redoc.html");

  const title = getArgValue(args, "--title") || "API Docs (ReDoc)";
  const port = Number(getArgValue(args, "--port") || process.env.PORT || 3000);
  const redocScriptSrc =
    getArgValue(args, "--redoc-script") || "./redoc.standalone.js";

  const spec = createSwaggerSpec(port);
  const html = buildHtml({ title, specObject: spec, redocScriptSrc });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, "utf8");

  console.log(`ReDoc HTML generated: ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

