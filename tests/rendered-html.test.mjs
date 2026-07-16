import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Reliant landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Reliant Electric \| Northern Nevada Electrical Construction<\/title>/i);
  assert.match(html, /Built here\./);
  assert.match(html, /20 years/);
  assert.match(html, /NV #0065968/);
  assert.match(html, /Ask Reliant/);
  assert.match(html, /775\.342\.2900/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("ships mobile, motion, and assistant affordances", async () => {
  const [page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /scrollBy/);
  assert.match(page, /knowledge\.find/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
