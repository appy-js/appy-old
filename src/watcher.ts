import App from "./app.ts";

export class Watcher {
  #app!: App;
  #watcher!: Deno.FsWatcher;

  constructor(app: App) {
    this.#app = app;
  }

  async start() {
    const watcher = Deno.watchFs([], { recursive: true });

    for await (const event of watcher) {
      this.#app.logger.info(">>>> event", event);
    }
  }
}

export function getWatcher(app: App) {
  return new Watcher(app);
}
