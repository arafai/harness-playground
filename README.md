# harness-playground

A tiny repository for end-to-end tests of the ai-harness mini-pilot.
It holds one small function with a known bug and a CI workflow on GitHub-hosted runners.

## HTTP API

`npm start` serves a small API on `PORT` (default 3000), used as the `api` platform of live epic runs:

- `GET /health`
- `GET /slug?text=...` returns `{ "slug": "..." }`
- `GET /items` and `POST /items` with `{ "title": "..." }` keep a list in memory
- `POST /__reset` clears that list; `npm run reset:acceptance` calls it before each acceptance check
