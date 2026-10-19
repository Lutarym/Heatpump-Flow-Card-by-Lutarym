// Baut aus den Modulen in src/ die eine Datei, die HACS und Home Assistant laden.
import * as esbuild from "esbuild";

const optionen = {
  entryPoints: ["src/index.js"],
  outfile: "dist/heatpump-flow-card-by-lutarym.js",
  bundle: true,
  format: "esm",
  target: "es2020",
  minify: false,
  legalComments: "inline",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(optionen);
  await ctx.watch();
} else {
  await esbuild.build(optionen);
}
