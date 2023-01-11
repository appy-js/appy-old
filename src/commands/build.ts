import { getBundler } from "../bundler.ts";
import { app } from "../mod.ts";

export default () =>
  app.cli.command("build", "Build the assets using ESBuild.")
    .action(async () => {
      try {
        await Deno.remove(app.config.outDirectory, { recursive: true });
      } catch (_err) {
        await Deno.mkdir(app.config.outDirectory);
      }

      const client = await getBundler(app, false, false);
      client.stop?.();

      const server = await getBundler(app, true, false);
      server.stop?.();
      Deno.exit(0);
    });
