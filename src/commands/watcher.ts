import { signal } from "std/signal/mod.ts";
import { app } from "../mod.ts";

export default () =>
  app.cli.command("watcher", "Run the watcher.")
    .action(async () => {
      app.watcher.start();

      for await (const _ of signal("SIGINT", "SIGTERM")) {
        app.logger.info("Shutting down gracefully...");
        app.stop();
        Deno.exit(0);
      }
    });
