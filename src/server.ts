import { expandGlob } from "std/fs/mod.ts";
import { serve } from "std/http/server.ts";
import { Context, Hono, serveStatic } from "./deps.ts";
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
   * The app's UI entry points.
   */
  #entryPoints!: string[];

  get entryPoints() {
    return this.#entryPoints;
  }

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
    this.#entryPoints = [];
    this.#router = new Hono();
  }

  async init() {
    for await (
      const file of expandGlob(
        `${this.#app.config.appDirectory}\/routes\/**\/*.{svelte,ts}`,
      )
    ) {
      if (file.isFile && file.name.endsWith(".svelte")) {
        this.#entryPoints.push(file.path.replace(`${Deno.cwd()}/`, ""));
      }
    }
  }

  async start() {
    // TODO: figure out how to transform the path at ESBuild.
    this.#router.use(
      "/:build{(assets|routes)}/*",
      serveStatic({ root: "./public/build" }),
    );

    const htmlTpl = await Deno.readTextFile(
      `${this.#app.config.appDirectory}/index.html`,
    );

    this.#router.get("/team-members", async (c) => {
      const routePath = "routes/team-members/index";
      const { default: app } = await import(
        `${Deno.cwd()}/${this.#app.config.outDirectory}/${routePath}.ssr.js`
      );

      const rendered = app.render();

      return c.html(
        htmlTpl
          .replace("<!--app-head-->", rendered.head)
          .replace("<!--app-html-->", rendered.html)
          .replace(
            "<!--app-client-entry-->",
            `<script type="module">import App from "/build/${routePath}.js";\nnew App({ target: document.getElementById('app'), hydrate: true });</script>`,
          ),
      );
    });

    this.#router.use(
      "/*",
      serveStatic({ root: "./public" }),
    );

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

export async function getServer(app: App) {
  const server = new Server(app);
  await server.init();

  return server;
}
