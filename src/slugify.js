/**
 * Turns a title into a URL slug: lower case, words joined by single dashes.
 * @param {string} title
 * @param {{ maxLength?: number }} [options] maxLength caps the slug length,
 *   cutting at the last dash within the limit when there is one (hard cut
 *   otherwise); the result never ends in a dash. Non-integers are rounded
 *   down, values <= 0 give "", and undefined or NaN means no limit.
 * @returns {string}
 */
export function slugify(title, { maxLength } = {}) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (typeof maxLength !== "number" || Number.isNaN(maxLength)) return slug;
  const limit = Math.floor(maxLength);
  if (slug.length <= limit) return slug;
  if (limit <= 0) return "";
  let cut = slug.slice(0, limit);
  if (slug[limit] !== "-" && cut.includes("-")) {
    cut = cut.slice(0, cut.lastIndexOf("-"));
  }
  return cut.replace(/-+$/, "");
}
