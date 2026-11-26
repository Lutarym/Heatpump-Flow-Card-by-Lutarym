// Prueft alle Geraeteprofile im Ordner dist/Profile und schreibt die Liste
// dist/Profile/liste.json. Wer ein Profil hinzufuegt, legt nur die Datei ab
// und baut. Bei einem Fehler bricht der Build ab.
import fs from "fs";
import path from "path";
import { EINHEITEN, istName } from "../src/namen.js";

const ORDNER = "dist/Profile";
const KENNUNG = /^[a-z0-9_-]{2,40}$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;
const SUCHARTEN = ["integration", "core", "firmware"];

function versionVergleich(a, b) {
  const x = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const y = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

const istObjekt = (w) => Boolean(w) && typeof w === "object" && !Array.isArray(w);
const fremdeAngaben = (o, erlaubt) => Object.keys(o).filter((k) => !erlaubt.includes(k)).sort();

function pruefeVariante(v, f) {
  const wo = (istObjekt(v) && v.id) || "?";
  if (!istObjekt(v)) {
    f.push("Variante ist kein Objekt");
    return;
  }
  if (!KENNUNG.test(String(v.id || ""))) f.push(`${wo}: id`);
  if (!v.name) f.push(`${wo}: name`);
  if (!Array.isArray(v.geraete) || !v.geraete.length || !v.geraete.every((g) => istObjekt(g) && Array.isArray(g.hersteller) && g.hersteller.length)) {
    f.push(`${wo}: geraete ohne hersteller`);
  }
  const q = v.quelle;
  if (!istObjekt(q)) {
    f.push(`${wo}: quelle fehlt`);
  } else {
    if (!/^https:\/\//.test(String(q.adresse || ""))) f.push(`${wo}: quelle.adresse muss mit https:// beginnen`);
    if (!DATUM.test(String(q.abgelesen || ""))) f.push(`${wo}: quelle.abgelesen fehlt (JJJJ-MM-TT)`);
    if (q.aktualisiert && !DATUM.test(String(q.aktualisiert))) f.push(`${wo}: quelle.aktualisiert (JJJJ-MM-TT)`);
    const fremd = fremdeAngaben(q, ["entwickler", "adresse", "version", "aktualisiert", "abgelesen"]);
    if (fremd.length) f.push(`${wo}: unbekannte Angaben in quelle ${fremd.join(", ")}`);
  }
  if (!istObjekt(v.suche) || !SUCHARTEN.includes(v.suche.art)) f.push(`${wo}: suche.art`);
  const fremd = fremdeAngaben(v, ["id", "name", "geraete", "quelle", "suche", "heishamon", "getestet", "werte"]);
  if (fremd.length) f.push(`${wo}: unbekannte Angaben ${fremd.join(", ")}`);
  if (!istObjekt(v.werte) || !Object.keys(v.werte).length) {
    f.push(`${wo}: werte leer`);
    return;
  }
  Object.entries(v.werte).forEach(([name, w]) => {
    if (!istName(name)) {
      f.push(`${wo}: unbekannter Name ${name}`);
      return;
    }
    const regeln = Array.isArray(w) ? w : istObjekt(w) ? w.suche : null;
    if (!Array.isArray(regeln) || !regeln.length || !regeln.every((r) => typeof r === "string" && r.trim())) {
      f.push(`${wo} ${name}: suche leer`);
    }
    if (istObjekt(w)) {
      if (w.einheit !== undefined) {
        [].concat(w.einheit).forEach((e) => {
          if (!(EINHEITEN[name] || []).includes(e)) f.push(`${wo} ${name}: Einheit ${e} nicht umrechenbar`);
        });
      }
      if (w.zustaende !== undefined && (!istObjekt(w.zustaende) || !Object.values(w.zustaende).every((z) => typeof z === "number" && Number.isFinite(z)))) {
        f.push(`${wo} ${name}: zustaende`);
      }
      const fremdW = fremdeAngaben(w, ["suche", "einheit", "zustaende"]);
      if (fremdW.length) f.push(`${wo} ${name}: unbekannte Angaben ${fremdW.join(", ")}`);
    }
  });
}

function pruefeDatei(p, datei, vergeben, kartenVersion) {
  const f = [];
  if (!istObjekt(p)) return ["keine Profildatei"];
  if (p.format !== "lutarym-geraeteprofil" || p.version !== 2) f.push("format oder version");
  if (!KENNUNG.test(String(p.id || "")) || p.id === "liste") f.push("id");
  if (datei !== `${p.id}.json`) f.push("Dateiname passt nicht zur id");
  if (!p.name) f.push("name");
  const fremd = fremdeAngaben(p, ["format", "version", "id", "name", "karte_ab", "varianten"]);
  if (fremd.length) f.push(`unbekannte Angaben ${fremd.join(", ")}`);
  if (!/^\d+\.\d+\.\d+$/.test(String(p.karte_ab || ""))) f.push("karte_ab fehlt oder ist keine Version wie 6.0.0");
  else if (versionVergleich(p.karte_ab, kartenVersion) > 0) f.push(`karte_ab ${p.karte_ab} ist neuer als die Karte ${kartenVersion}`);
  if (!Array.isArray(p.varianten) || !p.varianten.length) {
    f.push("keine Variante");
    return f;
  }
  // Dateien und Varianten haben je eigene Kennungen, beide eindeutig.
  [["datei", p.id]].concat(p.varianten.map((v) => ["variante", istObjekt(v) ? v.id : ""])).forEach(([art, k]) => {
    const schluessel = `${art}:${k}`;
    if (vergeben[schluessel]) f.push(`Kennung ${k} doppelt (${vergeben[schluessel]})`);
    vergeben[schluessel] = datei;
  });
  p.varianten.forEach((v) => pruefeVariante(v, f));
  return f;
}

function eintrag(datei, p) {
  const hersteller = [];
  const varianten = p.varianten.map((v) => {
    let modelle = 0;
    v.geraete.forEach((g) => {
      g.hersteller.forEach((h) => {
        if (!hersteller.includes(h)) hersteller.push(h);
      });
      modelle += Array.isArray(g.modelle) ? g.modelle.length : 0;
    });
    return {
      id: v.id,
      name: v.name,
      art: v.suche.art,
      integration: v.suche.integration || "",
      heishamon: v.heishamon === true,
      getestet: v.getestet === true,
      entwickler: v.quelle.entwickler || "",
      version: v.quelle.version || "",
      aktualisiert: v.quelle.aktualisiert || "",
      abgelesen: v.quelle.abgelesen || "",
      modelle,
      werte: Object.keys(v.werte).length,
    };
  });
  return { id: p.id, datei, name: p.name, karte_ab: p.karte_ab, hersteller, varianten };
}

/** Prueft den Ordner und schreibt liste.json. Liefert die Zahl der Dateien und Varianten. */
export function baueProfilliste(kartenVersion) {
  const dateien = fs.readdirSync(ORDNER).filter((n) => n.endsWith(".json") && n !== "liste.json").sort();
  const vergeben = {};
  const fehler = [];
  const gelesen = [];
  dateien.forEach((datei) => {
    let p;
    try {
      p = JSON.parse(fs.readFileSync(path.join(ORDNER, datei), "utf8"));
    } catch (e) {
      fehler.push(`${datei}: kein gueltiges JSON (${e.message})`);
      return;
    }
    const f = pruefeDatei(p, datei, vergeben, kartenVersion);
    if (f.length) f.forEach((x) => fehler.push(`${datei}: ${x}`));
    else gelesen.push([datei, p]);
  });
  if (fehler.length) {
    throw new Error(`Profile fehlerhaft:\n  ${fehler.join("\n  ")}`);
  }
  gelesen.sort((a, b) => {
    const x = a[1].name.toLowerCase();
    const y = b[1].name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
  const liste = { format: "lutarym-profilliste", version: 1, profile: gelesen.map(([datei, p]) => eintrag(datei, p)) };
  fs.writeFileSync(path.join(ORDNER, "liste.json"), `${JSON.stringify(liste, null, 2)}\n`);
  return { dateien: gelesen.length, varianten: liste.profile.reduce((s, d) => s + d.varianten.length, 0) };
}
