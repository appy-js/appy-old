import { cac } from "npm:cac@^6.7.14";
import { App } from "./app.ts";
import server from "./commands/server.ts";
import worker from "./commands/worker.ts";
import watcher from "./commands/watcher.ts";

export function getCLI(app: App) {
  const cli = cac(app.name);
  cli.help();

  return cli;
}

export function addCommands() {
  server();
  worker();
  watcher();
}
