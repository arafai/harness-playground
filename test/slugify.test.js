import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("lower-cases and joins words with a dash", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("trims leading and trailing separators", () => {
  assert.equal(slugify("  Hello  "), "hello");
});

test("collapses runs of separators into a single dash", () => {
  assert.equal(slugify("Hello,  World!"), "hello-world");
});
