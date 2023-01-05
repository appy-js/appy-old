import { App } from "./app.ts";
import { Watcher } from "./watcher.ts";

export { App, Watcher };
export type { Config } from "./config.ts";

export const app = new App();
await app.init();

/**
 * The Vite config.
 */
export const viteConfig = {
  clearScreen: false,
  server: {
    host: Deno.env.get("HOST") || "localhost",
    port: (Number(Deno.env.get("PORT")) || 3000) + 1,
  },
};
