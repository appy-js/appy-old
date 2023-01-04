export type { Config } from "./config.ts";
export { default as App } from "./app.ts";
export * as utils from "./utils.ts";
export const viteConfig = {
  server: {
    host: Deno.env.get("HOST") || "localhost",
    port: Number(Deno.env.get("PORT")) || 3000,
  },
};
