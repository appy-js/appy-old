import prettier from "npm:prettier@^2.8.1";
import prettierPluginPug from "npm:@prettier/plugin-pug@^2.3.0";
import App from "./app.ts";

export async function formatPug(app: App, path: string) {
  app.logger.info("Formatting with Prettier...");
  const decoder = new TextDecoder("utf-8");
  const formattedCode = prettier.format(
    decoder.decode(
      await Deno.readFile(path),
    ),
    {
      parser: "pug",
      plugins: [prettierPluginPug],
    },
  );

  const encoder = new TextEncoder();
  await Deno.writeFile(path, encoder.encode(formattedCode));
}
