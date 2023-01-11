import { App } from "./app.ts";
import { Watcher } from "./watcher.ts";

export type { Config } from "./config.ts";
export type { Context, MiddlewareHandler, Next } from "./deps.ts";
export { App, Watcher };

export const app = new App();
