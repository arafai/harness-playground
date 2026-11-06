import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApi } from "../src/server.js";

let server;
let base;

before(async () => {
  server = createApi();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test("answers its health check", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
});

test("previews a slug", async () => {
  const res = await fetch(`${base}/slug?text=Hello%20World`);
  assert.deepEqual(await res.json(), { slug: "hello-world" });
});

test("adds items, lists them and clears them on reset", async () => {
  const created = await fetch(`${base}/items`, {
    method: "POST",
    body: JSON.stringify({ title: "First Item" }),
  });
  assert.equal(created.status, 201);
  assert.deepEqual((await (await fetch(`${base}/items`)).json()).items, [
    { id: 1, title: "First Item", slug: "first-item" },
  ]);
  await fetch(`${base}/__reset`, { method: "POST" });
  assert.deepEqual((await (await fetch(`${base}/items`)).json()).items, []);
});

test("refuses an item without a title", async () => {
  const res = await fetch(`${base}/items`, { method: "POST", body: "{}" });
  assert.equal(res.status, 400);
});

test("previews a slug collapsing punctuation runs", async () => {
  const res = await fetch(`${base}/slug?text=Hello,%20%20World!`);
  assert.deepEqual(await res.json(), { slug: "hello-world" });
});
