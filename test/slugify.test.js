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

test("maxLength cuts at the last dash within the limit", () => {
  assert.equal(slugify("Hello brave new world", { maxLength: 11 }), "hello-brave");
  assert.equal(slugify("Hello brave new world", { maxLength: 12 }), "hello-brave");
  assert.equal(slugify("Hello brave", { maxLength: 11 }), "hello-brave");
});

test("maxLength cuts a long first word", () => {
  assert.equal(slugify("Supercalifragilistic", { maxLength: 5 }), "super");
  assert.equal(slugify("Supercalifragilistic day", { maxLength: 5 }), "super");
});
