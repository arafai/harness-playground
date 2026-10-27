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
