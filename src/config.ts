/**
 * The app's logger config.
 */
export interface LoggerConfig {
  /**
   * The redact options.
   */
  redact: {
    /**
     * The censor string to redact with. By default, it is '[redacted]'.
     */
    censor?: string;

    /**
     * The paths pattern to redact in the args. By default, it is [].
     */
    paths?: string[];

    /**
     * Indicate if the matched paths should be removed instead of redacted. By default, it is false.
     */
    remove?: boolean;
  };
}

/**
 * The app's user config.
 */
export interface UserConfig {
  logger: LoggerConfig;
}

/**
 * The app's config.
 */
export class Config {
  /**
   * The app's directory.
   */
  #appDirectory!: string;

  get appDirectory() {
    return this.#appDirectory;
  }

  /**
   * The app's environment.
   */
  #env!: "development" | "staging" | "production" | string;

  get env() {
    return this.#env;
  }

  /**
   * The app's logger config.
   */
  #logger!: LoggerConfig;

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

  constructor(name: string) {
    this.#appDirectory = "app";
    this.#env = Deno.env.get("APP_ENV") || "development";
    this.#logger = {
      redact: {
        censor: Deno.env.get("LOGGER_REDACT_CENSOR") || "[redacted]",
        paths: Deno.env.get("LOGGER_REDACT_PATHS")?.split(",") || [],
        remove: Boolean(Deno.env.get("LOGGER_REDACT_REMOVE")) || false,
      },
    };
    this.#name = name;
  }
}

export function getConfig(name: string) {
  return new Config(name);
}