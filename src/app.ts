import { Logger } from "std/log/logger.ts";
import { basename } from "std/path/mod.ts";
import { Config, getConfig } from "./config.ts";
import { getLogger } from "./logger.ts";
import { getServer, Server } from "./server.ts";
import { getWatcher, Watcher } from "./watcher.ts";

/**
 * The app class that runs everything.
 */
export default class App {
  constructor(name?: string) {
    this.#name = name ?? basename(Deno.cwd());
  }

  /**
   * The app's config.
   */
  #config!: Config;

  get config() {
    return this.#config;
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
   * The app's watcher for development tools.
   */
  #watcher!: Watcher;

  get watcher(): Watcher {
    return this.#watcher;
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
  async init() {
    this.#config = getConfig(this.#name);
    this.#logger = await getLogger(this);
    this.#server = getServer(this);
    this.#watcher = getWatcher(this);
  }

  async start() {
    await this.init();
    this.#watcher.start();
    this.#server.start();
  }
}
