import { getLogger as getDenoLogger, handlers, setup } from "std/log/mod.ts";
import { App } from "./app.ts";
import { has, set } from "./utils.ts";

export async function getLogger(app: App) {
  const LOG_LEVEL = app.config.env === "development" ? "DEBUG" : "INFO";

  await setup({
    handlers: {
      console: new handlers.ConsoleHandler(LOG_LEVEL, {
        formatter: (logRecord) => {
          let dateTime = logRecord.datetime;

          if (app.config.env === "development") {
            const tzOffset = (new Date()).getTimezoneOffset() * 60000;
            dateTime = new Date(dateTime.getTime() - tzOffset);
          }

          const redactedArgs = JSON.stringify(
            logRecord.args.map((arg: unknown) => {
              const newArg = { ...{}, ...arg as Record<string, unknown> };

              app.config.logger.redact.paths?.forEach((p: string) => {
                if (has(newArg as Record<string, unknown>, p)) {
                  set(
                    newArg as Record<string, unknown>,
                    p,
                    app.config.logger.redact.remove
                      ? undefined
                      : app.config.logger.redact.censor,
                  );
                }
              });

              return newArg;
            }),
            null,
            app.config.env === "development" ? "  " : "",
          );

          return `name=${logRecord.loggerName} time=${dateTime.toISOString()} level=${logRecord.levelName} msg=${logRecord.msg} args=${
            app.config.env !== "development" && logRecord.args.length > 0
              ? "\n"
              : ""
          }${redactedArgs}`;
        },
      }),
    },
    loggers: {
      [app.config.name]: {
        handlers: ["console"],
        level: LOG_LEVEL,
      },
    },
  });

  return getDenoLogger(app.config.name);
}
