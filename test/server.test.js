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

const post = (body) => fetch(`${base}/items`, { method: "POST", body });
const reset = () => fetch(`${base}/__reset`, { method: "POST" });

test("gives repeated titles unique slugs", async () => {
  await reset();
  const slugs = [];
  for (const title of ["Launch Plan", "Launch Plan 2", "Launch Plan"]) {
    const res = await post(JSON.stringify({ title }));
    assert.equal(res.status, 201);
    slugs.push((await res.json()).slug);
  }
  assert.deepEqual(slugs, ["launch-plan", "launch-plan-2", "launch-plan-3"]);
});

test("gets an item by slug and 404s otherwise", async () => {
  await reset();
  await post(JSON.stringify({ title: "Launch Plan" }));
  await post(JSON.stringify({ title: "Launch Plan" }));
  const res = await fetch(`${base}/items/launch-plan-2`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { id: 2, title: "Launch Plan", slug: "launch-plan-2" });
  for (const path of ["/items/nope", "/items/", "/items/a/b", "/items/%E0%A4%A"]) {
    const miss = await fetch(`${base}${path}`);
    assert.equal(miss.status, 404, path);
    assert.deepEqual(await miss.json(), { error: "not found" });
  }
  const del = await fetch(`${base}/items/launch-plan`, { method: "DELETE" });
  assert.equal(del.status, 404);
  assert.equal((await fetch(`${base}/items/launch-plan`, { method: "POST" })).status, 404);
});

test("refuses invalid titles and malformed JSON, and keeps running", async () => {
  const bodies = ["{}", '{"title":""}', '{"title":"   "}', '{"title":5}', '{"title":"!!!"}', '{"title":"日本"}', "{not json", "null"];
  for (const body of bodies) {
    const res = await post(body);
    assert.equal(res.status, 400, body);
    assert.equal(typeof (await res.json()).error, "string");
  }
  assert.equal((await fetch(`${base}/health`)).status, 200);
});

test("stores titles unchanged, lists in order and restarts ids after reset", async () => {
  await reset();
  await post(JSON.stringify({ title: "  Hello,  World! " }));
  await post(JSON.stringify({ title: "Second" }));
  const { items } = await (await fetch(`${base}/items`)).json();
  assert.deepEqual(items, [
    { id: 1, title: "  Hello,  World! ", slug: "hello-world" },
    { id: 2, title: "Second", slug: "second" },
  ]);
  await reset();
  const again = await (await post(JSON.stringify({ title: "Second" }))).json();
  assert.equal(again.id, 1);
});
