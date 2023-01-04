import { renderFile } from "npm:pug@^3.0.2";

export function render() {
  renderFile(`${Deno.cwd()}/app/routes/index.pug`, { name: "Tester" });
}
