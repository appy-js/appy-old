import { bold, dim, italic } from "std/fmt/colors.ts";
import { getLogger as getDenoLogger, handlers, setup } from "std/log/mod.ts";
import { App } from "./app.ts";
import { has, set } from "./utils.ts";

export async function getLogger(app: App, name?: string) {
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

          const redactedArgs = logRecord.args.map((arg: unknown) => {
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
          });

          return app.config.env === "development"
            ? `${bold(logRecord.loggerName)} ${dim(dateTime.toISOString())} ${
              italic(bold(logRecord.levelName))
            }: ${logRecord.msg} ${
              redactedArgs?.length > 0
                ? JSON.stringify(
                  redactedArgs,
                  null,
                  app.config.env === "development" ? "  " : "",
                )
                : ""
            }`
            : JSON.stringify({
              args: redactedArgs,
              level: logRecord.levelName,
              msg: logRecord.msg,
              name: logRecord.loggerName,
              time: dateTime.toISOString(),
            });
        },
      }),
    },
    loggers: {
      [name || app.config.name]: {
        handlers: ["console"],
        level: LOG_LEVEL,
      },
    },
  });

  return getDenoLogger(name || app.config.name);
}
