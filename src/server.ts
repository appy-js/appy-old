import { serve } from "std/http/server.ts";
import { Hono } from "hono";
import { App } from "./app.ts";

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

  /**
   * The Vite dev server process.
   */
  #vite!: Deno.Process;

  constructor(app: App) {
    this.#abortController = new AbortController();
    this.#app = app;
    this.#router = new Hono();
  }

  async start() {
    if (this.#app.config.env === "development") {
      this.#vite = Deno.run({
        cmd: [
          "deno",
          "run",
          "-A",
          "npm:vite@^3.2.5",
        ],
        stdout: "inherit",
        stderr: "inherit",
      });
    }

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
    this.#vite?.close();
    this.#abortController.abort();
  }
}

export function getServer(app: App) {
  return new Server(app);
}
