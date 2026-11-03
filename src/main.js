import { createApi } from "./server.js";

const port = Number(process.env.PORT ?? 3000);
createApi().listen(port, () => console.log(`api listening on ${port}`));
