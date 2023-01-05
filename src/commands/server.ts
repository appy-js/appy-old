import { signal } from "std/signal/mod.ts";
import { app } from "../mod.ts";

export default () =>
  app.cli.command("server", "Run the server.")
    .action(async () => {
      app.server?.start();

      for await (const _ of signal("SIGINT", "SIGTERM")) {
        app.logger.info("Shutting down gracefully...");
        app.stop();
        Deno.exit(0);
      }
    });
