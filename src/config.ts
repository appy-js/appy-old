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
   * The app's src directory.
   */
  #appDirectory!: string;

  get appDirectory() {
    return this.#appDirectory;
  }

  /**
   * The Deno's cache directory.
   */
  #denoNpmCacheDirectory!: string;

  set denoNpmCacheDirectory(dir: string) {
    this.#denoNpmCacheDirectory = dir;
  }

  get denoNpmCacheDirectory() {
    return this.#denoNpmCacheDirectory;
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

  /**
   * The app's output directory.
   */
  #outDirectory!: string;

  get outDirectory() {
    return this.#outDirectory;
  }

  constructor(name: string) {
    this.#appDirectory = "app";
    this.#outDirectory = "dist";
    this.#env = Deno.env.get("APP_ENV") || "development";
    this.#logger = {
      redact: {
        censor: Deno.env.get("LOGGER_REDACT_CENSOR") || "[redacted]",
        paths: Deno.env.get("LOGGER_REDACT_PATHS")?.split(",") || [],
        remove: Boolean(Deno.env.get("LOGGER_REDACT_REMOVE")),
      },
    };
    this.#name = name;
  }
}

export function getConfig(name: string) {
  const config = new Config(name);

  return config;
}
