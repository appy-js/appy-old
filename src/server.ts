import { serve } from "std/http/server.ts";
import { Context, Hono } from "https://deno.land/x/hono@v3.0.0-rc.3/mod.ts";
import { App } from "./app.ts";

export { Hono };
export type { Context };

/**
 * The server that serves all the HTTP requests.
 */
export class Server {
  /**
   * The server's abort controller.
   */
  #abortController: AbortController;

  /**
   * The app instance.
   */
  #app: App;

  /**
   * The router instance.
   */
  #router: Hono;

  get router() {
    return this.#router;
  }

  constructor(app: App) {
    this.#abortController = new AbortController();
    this.#app = app;
    this.#router = new Hono();
  }

  async start() {
    await serve(this.#router.fetch, {
      hostname: Deno.env.get("HOST") || "localhost",
      port: Number(Deno.env.get("PORT")) || 3000,
      signal: this.#abortController.signal,

      onError: (err) => {
        this.#app.logger.error(err);

        return new Response(null, { status: 500 });
      },

      onListen: ({ hostname, port }) => {
        this.#app.logger.info(
          `Listening http://${hostname}:${port.toString()}...`,
        );
      },
    });
  }

  stop() {
    this.#abortController.abort();
  }
}

export function getServer(app: App) {
  return new Server(app);
}
