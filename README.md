# harness-playground

A tiny repository for end-to-end tests of the ai-harness mini-pilot.
It holds one small function with a known bug and a CI workflow on GitHub-hosted runners.

## HTTP API

`npm start` serves a small API on `PORT` (default 3000), used as the `api` platform of live epic runs:

- `GET /health`
- `GET /slug?text=...` returns `{ "slug": "..." }`
- `POST /items` with `{ "title": "..." }` saves an item and returns `{ id, title, slug }` with 201. The title is stored exactly as sent. The base slug is `slugify(title)`; if that slug is taken, `-2`, `-3`, ... is appended (`launch-plan`, `launch-plan-2`, ...). A missing, empty, blank or non-string title, a title with no ASCII letters or digits, or malformed JSON returns 400 `{ "error": "..." }`.
- `GET /items` returns `{ "items": [...] }` in creation order
- `GET /items/:slug` returns the item with that exact (decoded) slug, or 404 `{ "error": "not found" }`
- `POST /__reset` clears the list (ids restart at 1); `npm run reset:acceptance` calls it before each acceptance check
