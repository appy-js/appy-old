import { serve } from "std/http/server.ts";
import { App } from "./app.ts";

/**
 * The server that serves all the HTTP requests.
 */
export class Server {
  /**
   * The server's abort controller.
   */
  #ac: AbortController;

  /**
   * The app instance.
   */
  #app: App;

  /**
   * The Vite dev server process.
   */
  #vite!: Deno.Process;

  constructor(app: App) {
    this.#ac = new AbortController();
    this.#app = app;
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

    await serve(async (_request: Request) => {
      const { default: handler } = await import(
        `${Deno.cwd()}/${this.#app.config.appDirectory}/routes/index.ts`
      );
      await handler();

      return new Response(null, { status: 200 });
    }, {
      hostname: Deno.env.get("HOST") || "localhost",
      port: Number(Deno.env.get("PORT")) || 3000,
      signal: this.#ac.signal,

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
    this.#ac.abort();
  }
}

export function getServer(app: App) {
  return new Server(app);
}
