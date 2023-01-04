import { extname } from "std/path/mod.ts";
import { debounce } from "std/async/debounce.ts";
import App from "./app.ts";
import { formatPug } from "./dev.ts";

export class Watcher {
  #app!: App;

  #isProcessing!: boolean;

  #processingFiles!: string[];

  #watcher!: Deno.FsWatcher;

  constructor(app: App) {
    this.#app = app;
    this.#isProcessing = false;
  }

  async start() {
    this.#watcher = Deno.watchFs([this.#app.config.appDirectory], {
      recursive: true,
    });

    const process = debounce(async (e: Deno.FsEvent) => {
      const { kind, paths } = e;
      let op = "";

      switch (kind) {
        case "create":
        case "remove":
          op = `${kind}d`;
          break;

        case "modify":
          op = "modified";
          break;
      }

      await Promise.all(
        await paths.map(async (path) => {
          if (op) {
            this.#app.logger.info(
              `File ${op}: ${path.replace(`${Deno.cwd()}/`, "")}`,
            );
          }

          switch (extname(path)) {
            case ".pug":
              await formatPug(this.#app, path);
              break;
          }
        }),
      );

      setTimeout(() => {
        this.#isProcessing = false;
      }, 100);
    }, 200);

    for await (const event of this.#watcher) {
      if (this.#isProcessing) {
        continue;
      }

      this.#isProcessing = true;
      process(event);
    }
  }
}

export function getWatcher(app: App) {
  return new Watcher(app);
}
