import * as esbuild from "https://deno.land/x/esbuild@v0.16.15/mod.js";
import sveltePluginImport from "npm:esbuild-svelte@^0.7.3";
import sveltePreprocessImport from "npm:svelte-preprocess@^5.0.0";
import "npm:svelte@^3.55.0";
import "npm:typescript@^4.9.4";
import { App } from "./mod.ts";

const sveltePlugin =
  (sveltePluginImport as unknown as typeof sveltePluginImport.default);
const sveltePreprocess =
  (sveltePreprocessImport as unknown as typeof sveltePreprocessImport.default);

export async function getBundler(app: App, isDev = true) {
  try {
    await Deno.remove(app.config.outDirectory, { recursive: true });
  } catch (_err) {
    await Deno.mkdir(app.config.outDirectory);
  }

  const res = await esbuild.build({
    bundle: true,
    entryPoints: ["app/routes/index.svelte"],
    entryNames: `[dir]/[name]${isDev ? "" : "-[hash]"}`,
    format: "esm",
    metafile: true,
    minify: !isDev,
    outbase: app.config.appDirectory,
    outdir: app.config.outDirectory,
    platform: "neutral",
    plugins: [
      sveltePlugin({
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
    const manifest: Record<string, { css: string | undefined; js: string }> =
      {};

    Object.keys(res?.metafile?.outputs).map((o) => {
      const entryPoint = res?.metafile?.outputs?.[o]?.entryPoint;
      if (
        entryPoint?.startsWith(`${app.config.appDirectory}/`) &&
        res.metafile?.inputs?.[entryPoint]
      ) {
        manifest[entryPoint] = {
          css: res.metafile?.outputs?.[o]?.cssBundle,
          js: o,
        };
      }
    });

    await Deno.writeTextFile(
      `${app.config.outDirectory}/manifest.json`,
      JSON.stringify(manifest ?? {}, null, "  "),
      { create: true },
    );
  }
}
