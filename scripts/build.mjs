// Baut aus den Modulen in src/ die Dateien, die HACS und Home Assistant laden:
// die Karte selbst und die Hilfedaten, die erst bei Bedarf nachgeladen werden.
// HACS laedt alle .js-Dateien aus dist herunter.
import * as esbuild from "esbuild";
import fs from "fs";

const paket = JSON.parse(fs.readFileSync("package.json", "utf8"));

const gemeinsam = {
  bundle: true,
  format: "esm",
  target: "es2020",
  // Umlaute und japanische Zeichen bleiben lesbar statt \u-Folgen,
  // das spart Platz. Module laedt der Browser immer als UTF-8.
  charset: "utf8",
  // Leerraum und Schreibweise werden gekuerzt, Namen bleiben erhalten,
  // damit Fehlermeldungen in der Browserkonsole lesbar bleiben.
  minifyWhitespace: true,
  minifySyntax: true,
  legalComments: "inline",
  banner: {
    js: `/*! Heatpump Flow Card by Lutarym ${paket.version} | ${paket.license} | https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym */`,
  },
  logLevel: "info",
};

const karte = {
  ...gemeinsam,
  entryPoints: ["src/index.js"],
  outfile: "dist/heatpump-flow-card-by-lutarym.js",
};

const hilfe = {
  ...gemeinsam,
  entryPoints: ["src/hilfe-daten.js"],
  outfile: "dist/heatpump-flow-card-by-lutarym-hilfe.js",
};

if (process.argv.includes("--watch")) {
  for (const o of [karte, hilfe]) {
    const ctx = await esbuild.context(o);
    await ctx.watch();
  }
} else {
  await esbuild.build(karte);
  await esbuild.build(hilfe);
}
