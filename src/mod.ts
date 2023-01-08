import { App } from "./app.ts";
import { Config } from "./config.ts";
import { Watcher } from "./watcher.ts";

export { App, Watcher };
export type { Config };

export const app = new App();
await app.init();
