export * as esbuild from "https://deno.land/x/esbuild@v0.16.15/mod.js";
import esbuildSveltePluginImport from "npm:esbuild-svelte@^0.7.3";
import sveltePreprocessImport from "npm:svelte-preprocess@^5.0.0";
import "npm:typescript@^4.9.4";

export const esbuildSveltePlugin =
  (esbuildSveltePluginImport as unknown as typeof esbuildSveltePluginImport.default);
export const sveltePreprocess =
  (sveltePreprocessImport as unknown as typeof sveltePreprocessImport.default);
