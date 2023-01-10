import { esbuild, esbuildSveltePlugin, sveltePreprocess } from "./dev_deps.ts";
import { App } from "./mod.ts";

export async function getBundler(app: App, isDev = true) {
  try {
    await Deno.remove(app.config.outDirectory, { recursive: true });
  } catch (_err) {
    await Deno.mkdir(app.config.outDirectory);
  }

  const res = await esbuild.build({
    assetNames: `[dir]/[name]${isDev ? "" : "-[hash]"}`,
    bundle: true,
    entryPoints: ["app/routes/index.svelte"],
    entryNames: `[dir]/[name]${isDev ? "" : "-[hash]"}`,
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
          hydratable: true,
        },
        preprocess: sveltePreprocess(),
      }),
    ],
    splitting: true,
    target: ["chrome99", "firefox99", "safari15"],
    treeShaking: true,
    watch: isDev
      ? {
        onRebuild: async (_error, result) => {
          if (result) {
            await writeManifest(app, result);
          }
        },
      }
      : false,
    write: true,
  });

  await writeManifest(app, res);

  return res;
}

async function writeManifest(app: App, res: esbuild.BuildResult) {
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
      `${app.config.outDirectory}/manifest.json`,
      JSON.stringify(manifest ?? {}, null, "  "),
      { create: true },
    );
  }
}
