import { createServer } from "node:http";
import { slugify } from "./slugify.js";

/**
 * The playground API: a slug preview and a small in-memory list of items.
 * State lives in memory so an acceptance reset only has to clear it.
 */
export function createApi() {
  let items = [];

  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const send = (status, body) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };

    if (req.method === "GET" && url.pathname === "/health") return send(200, { ok: true });
    if (req.method === "GET" && url.pathname === "/slug") {
      return send(200, { slug: slugify(url.searchParams.get("text") ?? "") });
    }
    if (req.method === "GET" && url.pathname === "/items") return send(200, { items });
    if (req.method === "POST" && url.pathname === "/items") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const title = JSON.parse(raw || "{}").title;
      if (typeof title !== "string" || title.trim() === "") {
        return send(400, { error: "title is required" });
      }
      const item = { id: items.length + 1, title, slug: slugify(title) };
      items = [...items, item];
      return send(201, item);
    }
    if (req.method === "POST" && url.pathname === "/__reset") {
      items = [];
      return send(200, { ok: true });
    }
    return send(404, { error: "not found" });
  });
}
