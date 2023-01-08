import { getBundler } from "../bundler.ts";
import { app } from "../mod.ts";

export default () =>
  app.cli.command("build", "Build the assets using ESBuild.")
    .action(async () => {
      const result = await getBundler(app, false);
      result.stop?.();
      Deno.exit(0);
    });
