import { Application } from "../deps.ts";

import { logger } from "./middleware/logger.ts";
import { router } from "./router/index.ts";

const app = new Application();

app.use(logger);
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server up on port 8080`);

await app.listen({ port: 8080 });
