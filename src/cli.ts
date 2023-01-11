import { cac } from "npm:cac@^6.7.14";
import { App } from "./app.ts";
import build from "./commands/build.ts";
import routes from "./commands/routes.ts";
import server from "./commands/server.ts";
import watcher from "./commands/watcher.ts";
import worker from "./commands/worker.ts";

export function getCLI(app: App) {
  const cli = cac(app.name);
  cli.help();

  return cli;
}

export function addCommands() {
  build();
  routes();
  server();
  worker();
  watcher();
}
