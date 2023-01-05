import { signal } from "std/signal/mod.ts";
import { app } from "../mod.ts";

export default () =>
  app.cli.command("worker", "Run the worker.")
    .action(async () => {
      app.worker?.start();

      for await (const _ of signal("SIGINT", "SIGTERM")) {
        app.logger.info("Shutting down gracefully...");
        app.stop();
        Deno.exit(0);
      }
    });
