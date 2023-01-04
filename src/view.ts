import prettier from "npm:prettier@^2.8.1";
import prettierPluginPug from "npm:@prettier/plugin-pug@^2.3.0";
import { renderFile } from "npm:pug@^3.0.2";

export async function format() {
  const decoder = new TextDecoder("utf-8");
  const code = decoder.decode(
    await Deno.readFile("./app/routes/index.pug"),
  );

  return prettier.format(code, {
    parser: "pug",
    plugins: [prettierPluginPug],
  });
}

export function render() {
  renderFile(`${Deno.cwd()}/app/routes/index.pug`, { name: "Tester" });
}
