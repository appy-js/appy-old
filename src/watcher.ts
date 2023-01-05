import { extname } from "std/path/mod.ts";
import { debounce } from "std/async/debounce.ts";
import { App } from "./app.ts";
import { formatPug } from "./dev.ts";

/**
 * The watcher that provides all the DX goodies.
 */
export class Watcher {
  /**
   * The app's instance.
   */
  #app!: App;

  /**
   * Indicate if the processing is happening.
   */
  #isProcessing!: boolean;

  /**
   * The FS watcher.
   */
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
      await Promise.all(
        await e.paths.map(async (path) => {
          switch (extname(path)) {
            case ".pug":
              await formatPug(path);
              break;
          }
        }),
      );

      setTimeout(() => {
        this.#isProcessing = false;
      }, 150);
    }, 250);

    for await (const event of this.#watcher) {
      if (this.#isProcessing) {
        continue;
      }

      this.#isProcessing = true;
      process(event);
    }
  }

  stop() {
    this.#watcher?.close();
  }
}

export function getWatcher(app: App) {
  return new Watcher(app);
}
