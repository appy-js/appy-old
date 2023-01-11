import { esbuild, esbuildSveltePlugin, sveltePreprocess } from "./dev_deps.ts";
import { App } from "./mod.ts";

export async function getBundler(app: App, isSSR = false, isDev = true) {
  const res = await esbuild.build({
    assetNames: `[dir]/[name]${isDev ? "" : "-[hash]"}`,
    bundle: true,
    entryPoints: app.server.entryPoints,
    entryNames: `[dir]/[name]${isDev ? "" : "-[hash]"}${isSSR ? ".ssr" : ""}`,
    format: "esm",
    loader: {
      ".ico": "file",
      ".jpg": "file",
      ".jpeg": "file",
      ".png": "file",
      ".svg": "file",
    },
    metafile: true,
    minify: !isDev,
    outbase: app.config.appDirectory,
    outdir: app.config.outDirectory,
    platform: "neutral",
    plugins: [
      {
        name: "resolve-svelte",
        setup(b) {
          b.onResolve({ filter: /^svelte$|^svelte\// }, (args) => {
            return {
              path: [
                Deno.cwd(),
                "node_modules",
                args.path,
                "index.mjs",
              ].join("/"),
            };
          });
        },
      },
      esbuildSveltePlugin({
        compilerOptions: {
          css: false,
          generate: isSSR ? "ssr" : "dom",
          hydratable: true,
        },
        preprocess: sveltePreprocess(),
      }),
    ],
    sourcemap: true,
    splitting: true,
    target: ["chrome99", "firefox99", "safari15"],
    treeShaking: true,
    watch: isDev
      ? {
        onRebuild: async (_error, result) => {
          if (result) {
            await writeManifest(app, result, isSSR);
          }
        },
      }
      : false,
    write: true,
  });

  await writeManifest(app, res, isSSR);

  return res;
}

async function writeManifest(
  app: App,
  res: esbuild.BuildResult,
  isSSR = false,
) {
  if (res?.metafile) {
    const manifest: Record<
      string,
      { css: string | undefined; js: string } | string
    > = {};
    const inputs = res?.metafile?.inputs;
    const outputs = res?.metafile?.outputs;

    Object.keys(outputs).map((outputKey) => {
      if (
        outputs[outputKey].entryPoint?.startsWith(`${app.config.appDirectory}/`)
      ) {
        manifest[outputs[outputKey].entryPoint as string] = {
          css: res.metafile?.outputs?.[outputKey]?.cssBundle,
          js: outputKey,
        };
      } else if (outputs[outputKey].inputs) {
        const key = Object.keys(outputs[outputKey].inputs)?.[0];

        if (key?.startsWith(`${app.config.appDirectory}/`) && inputs[key]) {
          manifest[key] = outputKey;
        }
      }
    });

    await Deno.writeTextFile(
      `${app.config.outDirectory}/${isSSR ? "ssr-" : ""}manifest.json`,
      JSON.stringify(manifest ?? {}, null, "  "),
      { create: true },
    );
  }
}
