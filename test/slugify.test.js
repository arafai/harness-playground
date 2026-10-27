import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("lower-cases and joins words with a dash", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("trims leading and trailing separators", () => {
  assert.equal(slugify("  Hello  "), "hello");
});

test("collapses runs of spaces into one dash", () => {
  assert.equal(slugify("Hello   World"), "hello-world");
});

test("collapses mixed punctuation runs into one dash", () => {
  assert.equal(slugify("Hello, ... World!?"), "hello-world");
  assert.equal(slugify("a_b/c&&d"), "a-b-c-d");
});

test("trims runs of leading and trailing separators", () => {
  assert.equal(slugify("--a--b--"), "a-b");
  assert.equal(slugify("  !!Hi!!  "), "hi");
});

test("returns an empty string when there are no alphanumerics", () => {
  assert.equal(slugify("---"), "");
});

test("maxLength cuts at the last dash within the limit", () => {
  assert.equal(slugify("hello world foo", { maxLength: 8 }), "hello");
  assert.equal(slugify("hello world foo", { maxLength: 11 }), "hello-world");
  assert.equal(slugify("ab cd ef", { maxLength: 5 }), "ab-cd");
});

test("maxLength hard-cuts when there is no dash", () => {
  assert.equal(slugify("abcdefghij", { maxLength: 4 }), "abcd");
});

test("maxLength result never ends in a dash and respects the limit", () => {
  const out = slugify("hello world", { maxLength: 6 });
  assert.equal(out, "hello");
  for (let n = 1; n < 20; n++) {
    const s = slugify("one two three four five", { maxLength: n });
    assert.ok(s.length <= n);
    assert.ok(!s.endsWith("-"));
  }
});

test("slugs within the limit and missing option are unchanged", () => {
  assert.equal(slugify("Hello World", { maxLength: 11 }), "hello-world");
  assert.equal(slugify("Hello World", { maxLength: 50 }), "hello-world");
  assert.equal(slugify("Hello World", {}), "hello-world");
  assert.equal(slugify("Hello World", { maxLength: undefined }), "hello-world");
});

test("maxLength <= 0 gives an empty string; non-integers round down", () => {
  assert.equal(slugify("hello", { maxLength: 0 }), "");
  assert.equal(slugify("hello", { maxLength: -3 }), "");
  assert.equal(slugify("abcdef", { maxLength: 3.9 }), "abc");
});
