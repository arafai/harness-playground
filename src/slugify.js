/**
 * Turns a title into a URL slug: lower case, words joined by single dashes.
 * @param {string} title
 * @param {{ maxLength?: number }} [options] cap the length, cutting at a word boundary
 * @returns {string}
 */
export function slugify(title, { maxLength } = {}) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (maxLength === undefined || slug.length <= maxLength) return slug;
  const limit = Math.max(0, maxLength);
  const cut = slug.lastIndexOf("-", limit);
  return slug.slice(0, cut > 0 ? cut : limit);
}
