import { app } from "../mod.ts";

export default () =>
  app.cli.command("routes", "List the server routes.")
    .action(() => {
      app.server.router.showRoutes();
    });
