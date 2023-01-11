import { esbuild } from "./dev_deps.ts";
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
   * The app's client bundler.
   */
  #clientBundler!: esbuild.BuildResult;

  get clientBundler() {
    return this.#clientBundler;
  }

  /**
   * The app's server bundler.
   */
  #serverBundler!: esbuild.BuildResult;

  get serverBundler() {
    return this.#serverBundler;
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
    try {
      await Deno.remove(this.#app.config.outDirectory, { recursive: true });
    } catch (_err) {
      await Deno.mkdir(this.#app.config.outDirectory);
    }

    this.#clientBundler = await getBundler(
      this.#app,
      false,
      ["", "development"].includes(Deno.env.get("ESBUILD_MODE") ?? ""),
    );

    this.#serverBundler = await getBundler(
      this.#app,
      true,
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
    this.#clientBundler?.stop?.();
    this.#serverBundler?.stop?.();
    this.#watcher?.close();
  }
}

export function getWatcher(app: App) {
  return new Watcher(app);
}
