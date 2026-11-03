// Clears the running API's in-memory state; acceptance runs this before every check.
const port = process.env.PORT ?? 3000;
const res = await fetch(`http://127.0.0.1:${port}/__reset`, { method: "POST" });
if (!res.ok) throw new Error(`reset failed: ${res.status}`);
