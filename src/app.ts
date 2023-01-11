import { Logger } from "std/log/logger.ts";
import { basename } from "std/path/mod.ts";
import { CAC } from "./deps.ts";
import { addCommands, getCLI } from "./cli.ts";
import { Config, getConfig } from "./config.ts";
import { getLogger } from "./logger.ts";
import { getServer, Server } from "./server.ts";
import { getWorker, Worker } from "./worker.ts";
import { getWatcher, Watcher } from "./watcher.ts";

/**
 * The app class that runs everything.
 */
export class App {
  /**
   * The app's config.
   */
  #config!: Config;

  get config() {
    return this.#config;
  }

  /**
   * The app's CLI.
   */
  #cli!: CAC;

  get cli(): CAC {
    return this.#cli;
  }

  /**
   * The app's logger.
   */
  #logger!: Logger;

  get logger() {
    return this.#logger;
  }

  /**
   * The app's name.
   */
  #name!: string;

  get name() {
    return this.#name;
  }

  /**
   * The app's server.
   */
  #server!: Server;

  get server(): Server {
    return this.#server;
  }

  /**
   * The app's worker.
   */
  #worker!: Worker;

  get worker(): Worker {
    return this.#worker;
  }

  /**
   * The app's watcher.
   */
  #watcher!: Watcher;

  get watcher(): Watcher {
    return this.#watcher;
  }

  constructor(name?: string) {
    this.#name = name ?? basename(Deno.cwd());
  }

  /**
   * Initialize the app instance with the singletons below:
   *
   * - cache
   * - db
   * - logger
   * - server
   * - worker
   */
  async #init() {
    this.#config = getConfig(this.#name);
    this.#cli = getCLI(this);
    this.#logger = await getLogger(this, Deno.args?.[0] ?? "");
    this.#server = await getServer(this);
    this.#worker = getWorker(this);
    this.#watcher = getWatcher(this);

    globalThis.addEventListener("error", (err) => this.#logger.error(err));
    globalThis.addEventListener(
      "unhandledrejection",
      (err) => this.#logger.error(err),
    );

    addCommands();
  }

  /**
   * Start the CLI parsing and running the matched command's action.
   */
  async start() {
    await this.#init();
    this.#cli.parse(["", ""].concat(Deno.args));
  }

  /**
   * Stop the app by gracefully shutting down everything.
   */
  stop() {
    this.#server?.stop();
    this.#worker?.stop();
    this.#watcher?.stop();
  }
}
