import { BuildResult } from "https://deno.land/x/esbuild@v0.16.15/mod.js";
import { App } from "./app.ts";
import { getBundler } from "./bundler.ts";

/**
 * The watcher that provides all the DX goodies.
 */
export class Watcher {
  /**
   * The app's instance.
   */
  #app!: App;

  /**
   * The app's bundler.
   */
  #bundler!: BuildResult;

  get bundler() {
    return this.#bundler;
  }

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
    this.#bundler = await getBundler(
      this.#app,
      ["", "development"].includes(Deno.env.get("ESBUILD_MODE") ?? ""),
    );

    this.#watcher = Deno.watchFs([this.#app.config.appDirectory], {
      recursive: true,
    });

    const process = (_e: Deno.FsEvent) => {
      this.#isProcessing = false;
    };

    for await (const event of this.#watcher) {
      if (this.#isProcessing) {
        continue;
      }

      this.#isProcessing = true;
      process(event);
    }
  }

  stop() {
    this.#bundler?.stop?.();
    this.#watcher?.close();
  }
}

export function getWatcher(app: App) {
  return new Watcher(app);
}
