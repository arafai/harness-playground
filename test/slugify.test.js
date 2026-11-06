import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("lower-cases and joins words with a dash", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("trims leading and trailing separators", () => {
  assert.equal(slugify("  Hello  "), "hello");
});

test("collapses runs of non-alphanumerics into one dash", () => {
  assert.equal(slugify("Hello,  World!"), "hello-world");
});

test("removes leading and trailing dashes", () => {
  assert.equal(slugify("--!Hello!--"), "hello");
});

test("treats non-ASCII characters as non-alphanumeric", () => {
  assert.equal(slugify("Café au lait"), "caf-au-lait");
  assert.equal(slugify("日本"), "");
});
