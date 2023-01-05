import { App } from "./app.ts";

/**
 * The worker that runs all the background tasks.
 */
export class Worker {
  /**
   * The app instance.
   */
  #app: App;

  constructor(app: App) {
    this.#app = app;
  }

  start() {}

  stop() {}
}

export function getWorker(app: App) {
  return new Worker(app);
}
