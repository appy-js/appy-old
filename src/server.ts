import App from "./app.ts";

export class Server {
  #app: App;

  constructor(app: App) {
    this.#app = app;
  }

  start() {
    Deno.serve((_request: Request) => {
      return new Response(null, { status: 200 });
    }, {
      hostname: Deno.env.get("HOST") || "localhost",
      port: Number(Deno.env.get("PORT")) || 3000,

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
}

export function getServer(app: App) {
  return new Server(app);
}
