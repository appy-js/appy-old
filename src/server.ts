import { expandGlob } from "std/fs/mod.ts";
import { serve } from "std/http/server.ts";
import { Context, Hono, logger, serveStatic } from "./deps.ts";
import { App } from "./app.ts";
import { MANIFEST, MANIFEST_SSR } from "./bundler.ts";

export { Hono };
export type { Context };

const APP_HEAD_PLACEHOLDER = "<!--app-head-->";
const APP_HTML_PLACEHOLDER = "<!--app-html-->";
const APP_CLIENT_ENTRY_PLACEHOLDER = "<!--app-client-entry-->";
const HANDLER_EXT = "ts";
const UI_EXT = "svelte";
const ROUTE_SEGMENT_DELIMITER = ".";
const HTTP_METHODS = [
  "all",
  "delete",
  "get",
  "head",
  "options",
  "patch",
  "post",
  "put",
] as const;

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
   * The app's UI entry points which will be used to configure esbuild to convert .svelte file into
   * DOM/SSR svelte JS class.
   */
  #entryPoints!: string[];

  get entryPoints() {
    return this.#entryPoints;
  }

  /**
   * The app's UI HTML template.
   */
  #htmlTpl!: string;

  get htmlTpl() {
    return this.#htmlTpl;
  }

  /**
   * The app's esbuild manifest for client-side rendering.
   */
  #manifest!: Record<string, { css: string; js: string } | string>;

  get manifest() {
    return this.#manifest;
  }

  /**
   * The app's esbuild manifest for server-side rendering.
   */
  #manifestSSR!: Record<string, { css: string; js: string } | string>;

  get manifestSSR() {
    return this.#manifestSSR;
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
    this.#htmlTpl = await Deno.readTextFile(
      `${this.#app.config.appDirectory}/index.html`,
    );
    this.#router.use("*", logger((out) => this.#app.logger.info(out)));

    for await (
      const file of expandGlob(
        `${this.#app.config.appDirectory}\/routes\/**\/index.{svelte,ts}`,
      )
    ) {
      if (file.isFile) {
        let route = file.path.replace(
          `${Deno.cwd()}/${this.#app.config.routesDirectory}`,
          "",
        ).replace(new RegExp(`/?index.(${HANDLER_EXT}|${UI_EXT})`), "");

        if (route.trim() === "") {
          route = "/";
        } else {
          route = route.split(ROUTE_SEGMENT_DELIMITER).join("/");
        }

        if (file.path.endsWith(`.${HANDLER_EXT}`)) {
          const handler = await import(file.path);

          HTTP_METHODS.map((m) => {
            if (handler?.[m]) {
              this.#router[m](route, handler?.[m]);
            }
          });
        }

        if (file.path.endsWith(`.${UI_EXT}`)) {
          this.#entryPoints.push(file.path.replace(`${Deno.cwd()}/`, ""));
          this.#router.get(route, (c) => this.#svelteSSR(c, route));
        }
      }
    }
  }

  async start() {
    this.#router.use(
      "/*",
      serveStatic({ root: this.#app.config.staticDirectory }),
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

  async #svelteSSR(c: Context, route: string) {
    this.#manifest = this.#manifest ?? JSON.parse(
      await Deno.readTextFile(`${this.#app.config.outDirectory}/${MANIFEST}`),
    );
    this.#manifestSSR = this.#manifestSSR ?? JSON.parse(
      await Deno.readTextFile(
        `${this.#app.config.outDirectory}/${MANIFEST_SSR}`,
      ),
    );

    const normalisedRoute = route === "/" ? "" : `/${
      route
        .replace(/^\//, "")
        .replaceAll("/", ROUTE_SEGMENT_DELIMITER)
    }`;
    const { default: app } = await import(
      `${Deno.cwd()}/${
        (this
          .#manifestSSR[
            `${this.#app.config.routesDirectory}${normalisedRoute}/index.svelte`
          ] as { css: string; js: string }).js
      }`
    );
    const rendered = app.render();

    return c.html(
      this.#htmlTpl
        .replace(APP_HEAD_PLACEHOLDER, rendered.head)
        .replace(
          APP_HTML_PLACEHOLDER,
          rendered.html.trim()
            .replaceAll("\n</", "</")
            .replaceAll("\n<", "\n      <"),
        )
        .replace(
          APP_CLIENT_ENTRY_PLACEHOLDER,
          `<script type="module">\n      import App from "/${
            (this
              .#manifest[
                `${this.#app.config.routesDirectory}${normalisedRoute}/index.svelte`
              ] as { css: string; js: string }).js.replace(
                `${this.#app.config.staticDirectory}/`,
                "",
              )
          }";\n      new App({ target: document.getElementById('app'), hydrate: true });\n    </script>`,
        ).replace(
          '="./assets/',
          `="${
            this.#app.config.outDirectory.replace(
              this.#app.config.staticDirectory,
              "",
            )
          }/assets/`,
        ),
    );
  }
}

export async function getServer(app: App) {
  const server = new Server(app);
  await server.init();

  return server;
}
