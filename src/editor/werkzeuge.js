/**
 * Geraeteprofile im Editor (Auswahl, Frage, Profilinfo, Import, Export,
 * Aktualisieren von GitHub) und Sprachpakete.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { detectIntegration, erkenneAlle, erkenneMitProfil, profilFuer, standardNamen } from "../erkennung.js";
import { ENTITY_FIELDS } from "../felder.js";
import { escapeHtml, kopiereText, rawState, attr } from "../hilfsfunktionen.js";
import { CARD_VERSION } from "../konstanten.js";
import { ARTEN, UEBERNEHMEN_OHNE_FELD } from "../namen.js";
import {
  AUTO_PROFIL, KEIN_PROFIL, alsDatei, bereitFuer, eigeneVarianten, githubDatei, githubListe, gueltigeEigene, istNeuer,
  ladeFuer, ladeListe, profilBereiche, profileFehler, profileNeuVersuchen, profilKennung, profilListe, pruefeProfil,
  varianteZu, versionVergleich,
} from "../profile.js";
import { SPRACH_NAMEN, pruefeSprache, registriereSprachen, sprachpaketFuer } from "../sprachen.js";
import { SPRACHEN, t, tf } from "../texte.js";

/** Gruppe fuer eigene Profile ohne Datei im Ordner Profile. */
const EIGENE = "__eigen";
/** Vorsilbe fuer Hersteller, deren Profile es nur auf GitHub gibt. */
const GITHUB_GRUPPE = "__gh:";
/** Kennung, die weder im Ordner Profile noch unter den eigenen steht. */
const UNBEKANNT = "__unbekannt";

export const werkzeugeEditor = {
  /** Auswahlliste der Sprachen: automatisch, eingebaute und eigene. */
  _sprachOptionen() {
    const eigene = Array.isArray(this._config.language_custom) ? this._config.language_custom : [];
    const html = [`<option value="auto">${escapeHtml(this._t("e_auto"))}</option>`];
    SPRACHEN.forEach((code) => {
      const ersetzt = eigene.find((p) => p.code === code);
      const name = ersetzt ? `${ersetzt.name} ${this._t("o_p_angepasst")}` : SPRACH_NAMEN[code];
      html.push(`<option value="${code}">${escapeHtml(name)}</option>`);
    });
    eigene
      .filter((p) => p && !SPRACHEN.includes(p.code))
      .forEach((p) => {
        html.push(`<option value="${escapeHtml(p.code)}">${escapeHtml(p.name)} ${escapeHtml(this._t("o_p_eigen"))}</option>`);
      });
    return html.join("");
  },

  /** "Entfernen" nur bei einer eigenen oder angepassten Sprache. */
  _zeigeSprachKnoepfe() {
    const weg = this.shadowRoot.getElementById("btn-sprache-weg");
    const eigene = Array.isArray(this._config.language_custom) ? this._config.language_custom : [];
    if (weg) weg.hidden = !eigene.some((p) => p.code === this._config.language);
  },

  /** Bedienung von Export, Import und Entfernen der Sprachpakete. */
  _bindeSprachen() {
    const sr = this.shadowRoot;
    const sagen = (text) => {
      const el = sr.getElementById("ed-sprache-hinweis");
      if (el) el.textContent = text;
    };
    // Neu aufbauen, damit alle Beschriftungen des Editors die Sprache wechseln.
    const neuAufbauen = (hinweis) => {
      this._built = false;
      this._render();
      const el = this.shadowRoot.getElementById("ed-sprache-hinweis");
      if (el) el.textContent = hinweis;
    };
    const speichern = (liste, code, hinweis) => {
      this._config = { ...this._config, language_custom: liste, language: code };
      registriereSprachen(this._config);
      this._emit();
      neuAufbauen(hinweis);
    };

    const aus = sr.getElementById("btn-sprache-aus");
    if (aus) {
      aus.addEventListener("click", () => {
        const paket = sprachpaketFuer(this._sp());
        const text = JSON.stringify(paket, null, 2);
        try {
          const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `sprache-${paket.code}.json`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          sagen(tf(this._t("m_s_export_ok"), { n: paket.name }));
        } catch {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }

    const datei = sr.getElementById("ed-sprache-datei");
    const ein = sr.getElementById("btn-sprache-ein");
    if (ein && datei) {
      ein.addEventListener("click", () => datei.click());
      datei.addEventListener("change", () => {
        const f = datei.files && datei.files[0];
        if (!f) return;
        const leser = new FileReader();
        leser.onload = () => {
          let roh;
          try {
            roh = JSON.parse(String(leser.result || ""));
          } catch {
            sagen(this._t("m_json"));
            return;
          }
          const erg = pruefeSprache(roh);
          if (erg.fehler) {
            sagen(this._t(erg.fehler));
            return;
          }
          const neu = erg.paket;
          const liste = (Array.isArray(this._config.language_custom) ? this._config.language_custom : [])
            .filter((p) => p.code !== neu.code);
          liste.push(neu);
          // Meldung schon in der neuen Sprache.
          registriereSprachen({ language_custom: liste });
          const teile = [
            tf(t("m_s_import_ok", neu.code), {
              n: neu.name,
              z: Object.keys(neu.texte).length,
              h: Object.keys(neu.hilfe).length,
            }),
          ];
          if (erg.fehlen) teile.push(tf(t("m_s_fehlen", neu.code), { z: erg.fehlen }));
          if (erg.platz.length) {
            teile.push(tf(t("m_s_platz", neu.code), { liste: erg.platz.slice(0, 5).join(", ") }));
          }
          if (erg.unbekannt.length) {
            teile.push(tf(t("m_s_unbekannt", neu.code), { z: erg.unbekannt.length }));
          }
          if (erg.zeichen.length) {
            teile.push(tf(t("m_s_zeichen", neu.code), { liste: erg.zeichen.slice(0, 5).join(", ") }));
          }
          speichern(liste, neu.code, teile.join(". ") + ".");
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(f);
        datei.value = "";
      });
    }

    const weg = sr.getElementById("btn-sprache-weg");
    if (weg) {
      weg.addEventListener("click", () => {
        const code = this._config.language;
        const liste = (Array.isArray(this._config.language_custom) ? this._config.language_custom : [])
          .filter((p) => p.code !== code);
        const eingebaut = SPRACHEN.includes(code);
        registriereSprachen({ language_custom: liste }, code);
        const ziel = eingebaut ? code : "auto";
        speichern(liste, ziel, "");
        const el = this.shadowRoot.getElementById("ed-sprache-hinweis");
        if (el) el.textContent = this._t(eingebaut ? "m_s_zurueck" : "m_s_entfernt");
      });
    }
    this._zeigeSprachKnoepfe();
  },

  /* -------------------- Geraeteprofile -------------------- */

  /** Datei (Eintrag aus liste.json), in der eine Variante steht, sonst null. */
  _dateiVon(id) {
    return profilListe().find((d) => d.varianten.some((v) => v.id === id)) || null;
  },

  /**
   * Gruppe einer eigenen Variante in der Auswahl. Kopien von GitHub stehen
   * beim Hersteller ihrer Datei, auch wenn es den Hersteller nur auf
   * GitHub gibt (eigene Festlegung). Alles andere steht unter "Eigene
   * Profile".
   */
  _gruppeVon(v) {
    if (v.herkunft !== "github" || !v.dateiId) return EIGENE;
    return profilListe().some((d) => d.id === v.dateiId) ? v.dateiId : GITHUB_GRUPPE + v.dateiId;
  },

  /** Gueltige eigene Varianten ohne Gegenstueck im Ordner Profile in einer Gruppe. */
  _eigeneIn(gruppe) {
    return gueltigeEigene(this._config).filter((v) => !this._dateiVon(v.id) && this._gruppeVon(v) === gruppe);
  },

  /** Hersteller, deren Profile es nur auf GitHub gibt: Gruppe, Name, Varianten. */
  _githubHersteller() {
    const out = [];
    gueltigeEigene(this._config).forEach((v) => {
      const g = this._gruppeVon(v);
      if (!g.startsWith(GITHUB_GRUPPE) || this._dateiVon(v.id)) return;
      let h = out.find((x) => x.id === g);
      if (!h) out.push((h = { id: g, name: v.dateiName || v.dateiId, varianten: [] }));
      h.varianten.push(v);
    });
    return out;
  },

  /**
   * Erstes Feld zu einer Kennung: automatisch, kein Profil, eine Datei
   * (Hersteller), die eigenen Profile oder unbekannt.
   */
  _herstellerVon(id) {
    if (!id || id === AUTO_PROFIL) return AUTO_PROFIL;
    if (id === KEIN_PROFIL) return KEIN_PROFIL;
    const d = this._dateiVon(id);
    if (d) return d.id;
    const v = gueltigeEigene(this._config).find((x) => x.id === id);
    return v ? this._gruppeVon(v) : UNBEKANNT;
  },

  /**
   * Varianten eines Herstellers fuer die Auswahl, mit eigenen Anpassungen
   * und den Varianten, die von GitHub dazugekommen sind.
   */
  _variantenVon(h) {
    const alsEigen = (v) => ({
      id: v.id, name: v.name, entwickler: v.quelle.entwickler, getestet: v.getestet, eigen: true, herkunft: v.herkunft,
    });
    if (h === EIGENE || String(h).startsWith(GITHUB_GRUPPE)) return this._eigeneIn(h).map(alsEigen);
    const d = profilListe().find((x) => x.id === h);
    if (!d) return [];
    const eigene = gueltigeEigene(this._config);
    return d.varianten.map((v) => {
      const e = eigene.find((x) => x.id === v.id);
      return { id: v.id, name: v.name, entwickler: v.entwickler, getestet: v.getestet, ersetzt: Boolean(e), herkunft: e ? e.herkunft : "" };
    }).concat(this._eigeneIn(h).map(alsEigen));
  },

  /** Text einer Variante in der Auswahl: Integration und Entwickler. */
  _variantenText(v) {
    let text = v.name;
    if (v.entwickler) text += ` · ${tf(this._t("o_p_von"), { n: v.entwickler })}`;
    if (v.herkunft === "github") text += ` ${this._t("o_p_github")}`;
    else if (v.ersetzt) text += ` ${this._t("o_p_angepasst")}`;
    else if (v.eigen) text += ` ${this._t("o_p_eigen")}`;
    else if (!v.getestet) text += ` ${this._t("o_p_ungetestet")}`;
    return text;
  },

  /**
   * Erstes Feld: automatisch, die Hersteller aus dem Ordner Profile und
   * von GitHub, eigene Profile und kein Profil. In der Frage nur die
   * Hersteller.
   */
  _herstellerOptionen(frage, id) {
    const e = escapeHtml;
    const html = [frage
      ? `<option value="">${e(this._t("o_p_bitte"))}</option>`
      : `<option value="${AUTO_PROFIL}">${e(this._t("o_p_auto"))}</option>`];
    profilListe()
      .map((d) => ({ id: d.id, name: d.name, varianten: d.varianten }))
      .concat(this._githubHersteller())
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((d) => {
        const ungetestet = d.varianten.every((v) => !v.getestet);
        html.push(`<option value="${e(d.id)}">${e(d.name + (ungetestet ? ` ${this._t("o_p_ungetestet")}` : ""))}</option>`);
      });
    if (frage) return html.join("");
    if (this._eigeneIn(EIGENE).length) html.push(`<option value="${EIGENE}">${e(this._t("o_p_eigene_gruppe"))}</option>`);
    html.push(`<option value="${KEIN_PROFIL}">${e(this._t("o_p_keins"))}</option>`);
    if (this._herstellerVon(id) === UNBEKANNT) html.push(`<option value="${UNBEKANNT}">${e(id)}</option>`);
    return html.join("");
  },

  /** Zweites Feld: die Varianten des gewaehlten Herstellers. */
  _profilOptionen(h, id) {
    const e = escapeHtml;
    if (h === AUTO_PROFIL) return `<option value="${AUTO_PROFIL}">${e(this._t("o_p_auto"))}</option>`;
    if (h === KEIN_PROFIL) return `<option value="${KEIN_PROFIL}">${e(this._t("o_p_keins"))}</option>`;
    if (h === UNBEKANNT) return `<option value="${e(id)}">${e(id)}</option>`;
    return this._variantenVon(h).map((v) => `<option value="${e(v.id)}">${e(this._variantenText(v))}</option>`).join("");
  },

  /** Name einer Variante fuer Meldungen: Hersteller und Integration. */
  _varianteName(v) {
    if (!v) return "";
    if (v.dateiName && v.dateiName !== v.name) return `${v.dateiName}, ${v.name}`;
    return v.name;
  },

  /** Name zu einer Kennung, auch wenn die Datei noch nicht geladen ist. */
  _nameZu(id) {
    const v = varianteZu(this._config, id);
    if (v) return this._varianteName(v);
    const d = this._dateiVon(id);
    const lv = d && d.varianten.find((x) => x.id === id);
    return lv ? `${d.name}, ${lv.name}` : id;
  },

  /** Stellt ein Profil ein und zeigt alles passend dazu. */
  _setzeProfil(id) {
    this._config = { ...this._config, profil: id };
    this._emit();
    this._zeigeProfilAuswahl();
  },

  /**
   * Laedt die Profile fuer den Editor: immer die Liste fuer die Auswahl,
   * dazu was die Konfiguration braucht. Danach zeigt er alles neu an.
   */
  _ladeProfile() {
    const fuer = this._config;
    if (!fuer || this._profileFuer === fuer) return;
    this._profileFuer = fuer;
    Promise.all([ladeListe().catch(() => null), ladeFuer(fuer).catch(() => null)]).then(() => {
      if (this._config !== fuer || !this._built) return;
      this._zeigeProfilAuswahl();
    });
  },

  /** "Erneut suchen": automatisch suchen, Fehlgeschlagenes neu laden. */
  _erneutSuchen() {
    profileNeuVersuchen();
    this._profileFuer = null;
    this._setzeProfil(AUTO_PROFIL);
  },

  /**
   * Zeigt Auswahl, Frage, Profilinfo und Status passend zur Konfiguration.
   * Bei "auto" und mehreren erkannten Varianten erscheint eine Auswahl,
   * welche gelten soll. Ohne Treffer fragt der Editor nach einem Profil.
   */
  _zeigeProfilAuswahl() {
    const sr = this.shadowRoot;
    if (!sr || !this._config) return;
    this._ladeProfile();
    const id = profilKennung(this._config);
    const h = this._herstellerVon(id);
    const hWahl = sr.getElementById("opt-hersteller");
    if (hWahl) {
      hWahl.innerHTML = this._herstellerOptionen(false, id);
      hWahl.value = h;
    }
    const pWahl = sr.getElementById("opt-profil");
    if (pWahl) {
      pWahl.innerHTML = this._profilOptionen(h, id);
      pWahl.value = h === AUTO_PROFIL || h === KEIN_PROFIL ? h : id;
    }
    const bereit = bereitFuer(this._config);
    const kandidaten = id === AUTO_PROFIL && bereit && this._hass ? erkenneAlle(this._hass, this._config) : [];
    const wahlBox = sr.getElementById("ed-profil-wahl");
    const wahl = sr.getElementById("opt-profil-wahl");
    if (wahlBox && wahl) {
      wahlBox.hidden = kandidaten.length < 2;
      wahl.innerHTML = [`<option value="">${escapeHtml(this._t("o_p_bitte"))}</option>`]
        .concat(kandidaten.map((k) =>
          `<option value="${escapeHtml(k.id)}">${escapeHtml(tf(this._t("o_p_kandidat"), { n: this._nameZu(k.id), z: k.felder }))}</option>`))
        .join("");
      wahl.value = "";
    }
    // Frage nach einem Profil: nur bei "auto", wenn alles geladen ist und
    // keine Variante passt. Hersteller und Integration stehen dann in der Frage.
    const frage = id === AUTO_PROFIL && bereit && Boolean(this._hass) && profilListe().length > 0
      && !profileFehler(this._config) && kandidaten.length === 0;
    this._zeigeFrage(frage);
    const hZeile = sr.getElementById("ed-hersteller-zeile");
    if (hZeile) hZeile.hidden = frage;
    const zeile = sr.getElementById("ed-geraet-zeile");
    if (zeile) zeile.hidden = frage || [AUTO_PROFIL, KEIN_PROFIL, UNBEKANNT].includes(h) || this._variantenVon(h).length < 2;
    let v = null;
    if (bereit && id === AUTO_PROFIL) v = kandidaten.length ? varianteZu(this._config, kandidaten[0].id) : null;
    else if (bereit) v = varianteZu(this._config, id);
    this._zeigeProfilInfo(v, id === AUTO_PROFIL);
    this._zeigeProfilKnoepfe(kandidaten);
  },

  /** Kasten mit der Frage nach einem bestimmten Profil. */
  _zeigeFrage(zeigen) {
    const sr = this.shadowRoot;
    const box = sr.getElementById("ed-profilfrage");
    if (!box) return;
    box.hidden = !zeigen;
    if (!zeigen) return;
    const hSel = sr.getElementById("frage-hersteller");
    if (!hSel) return;
    const vorher = hSel.value;
    hSel.innerHTML = this._herstellerOptionen(true);
    hSel.value = [...hSel.options].some((o) => o.value === vorher) ? vorher : "";
    this._frageVarianten();
  },

  /** Varianten in der Frage zum gewaehlten Hersteller. */
  _frageVarianten() {
    const sr = this.shadowRoot;
    const hSel = sr.getElementById("frage-hersteller");
    const vSel = sr.getElementById("frage-variante");
    const laden = sr.getElementById("btn-frage-laden");
    if (!hSel || !vSel) return;
    const liste = hSel.value ? this._variantenVon(hSel.value) : [];
    vSel.innerHTML = [`<option value="">${escapeHtml(this._t("o_p_bitte"))}</option>`]
      .concat(liste.map((v) => `<option value="${escapeHtml(v.id)}">${escapeHtml(this._variantenText(v))}</option>`))
      .join("");
    vSel.value = liste.length === 1 ? liste[0].id : "";
    if (laden) laden.disabled = !vSel.value;
  },

  /** Datum JJJJ-MM-TT in der Schreibweise der Sprache. */
  _datum(text) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || ""));
    if (!m) return "";
    try {
      return new Intl.DateTimeFormat(this._sp(), { dateStyle: "medium", timeZone: "UTC" })
        .format(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))));
    } catch {
      return text;
    }
  },

  /**
   * Kasten "Ueber dieses Profil": Integration, Entwickler, Quelle, Version,
   * letzte Aenderung, beschriebene Bereiche, was in Home Assistant
   * gefunden wurde, Steuerung, Hilfe und ob das Profil getestet ist.
   */
  _zeigeProfilInfo(v, auto) {
    const box = this.shadowRoot.getElementById("ed-profil-info");
    if (!box) return;
    if (!v) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const e = escapeHtml;
    const werte = Object.keys(v.werte || {});
    const quelle = v.quelle || {};
    const integration = (v.suche && v.suche.integration) || "";
    const vonGithub = v.herkunft === "github";
    const eigen = v.eigen && !vonGithub;
    const zeilen = [];
    const zeile = (titel, inhalt) => zeilen.push(`<dt>${e(this._t(titel))}</dt><dd>${inhalt}</dd>`);
    const jaNein = (ja, textJa, textNein) =>
      `<span class="${ja ? "ja" : "nein"}">${e(this._t(ja ? textJa : textNein))}</span>`;

    // Integration und Herkunft
    zeile("pi_integration", `${e(v.name)}${integration ? ` <span class="grau">(${e(integration)})</span>` : ""}`);
    const adresse = /^https:\/\//.test(String(quelle.adresse || "")) ? quelle.adresse : "";
    if (quelle.entwickler || adresse) {
      const link = adresse
        ? `<a href="${e(adresse)}" target="_blank" rel="noopener noreferrer">${e(adresse.replace(/^https:\/\//, ""))}</a>`
        : "";
      zeile("pi_entwickler", [e(quelle.entwickler || ""), link].filter(Boolean).join(" · "));
    }
    // Version und letzte Aenderung
    if (eigen) {
      zeile("pi_version", `<span class="grau">${e(this._t("pi_eigen"))}</span>`);
    } else if (v.suche && v.suche.art === "core") {
      zeile("pi_version", e(this._t("pi_core")));
    } else if (quelle.version) {
      // Bei Firmware die Version der Firmware, sonst die der manifest.json.
      const herkunft = v.suche && v.suche.art === "firmware" ? this._t("pi_firmware") : "manifest.json";
      zeile("pi_version", `${e(quelle.version)} <span class="grau">(${e(herkunft)})</span>`);
    }
    if (!eigen && (quelle.aktualisiert || quelle.abgelesen)) {
      const teile = [];
      if (quelle.aktualisiert) teile.push(e(this._datum(quelle.aktualisiert)));
      if (quelle.abgelesen) teile.push(`<span class="grau">${teile.length ? "· " : ""}${e(tf(this._t("pi_stand"), { d: this._datum(quelle.abgelesen) }))}</span>`);
      zeile("pi_aenderung", teile.join(" "));
    }
    // Beschriebene Bereiche statt aller Namen
    zeile(
      "pi_beschreibt",
      `${e(tf(this._t("pi_felder"), { z: werte.length }))}<div class="chips">${profilBereiche(werte)
        .map((b) => `<b>${e(this._t(b))}</b>`)
        .join("")}</div>`
    );
    // Was in Home Assistant gefunden wurde
    let gefundenEnt = {};
    if (this._hass) {
      const gefunden = detectIntegration(this._hass, v);
      gefundenEnt = gefunden.entities || {};
      let anzahl = 0;
      if (integration) {
        const reg = this._hass.entities || {};
        anzahl = Object.keys(reg).filter((k) => reg[k] && reg[k].platform === integration).length;
      } else {
        anzahl = gefunden.count || 0;
      }
      const zugeordnet = Object.keys(gefundenEnt).filter((n) => werte.includes(n)).length;
      zeile(
        "pi_ha",
        anzahl
          ? e(tf(this._t("pi_ha_text"), { a: anzahl, b: zugeordnet, c: werte.length }))
          : `<span class="nein">${e(this._t("pi_ha_keine"))}</span>`
      );
    }
    // Steuern: Namen, die nur stellbare Entitaeten annehmen
    const steuerArten = ["number", "input_number", "switch", "input_boolean", "select", "input_select", "button", "input_button"];
    // Ist ein solcher Name nur lesbar zugeordnet, zaehlt er nicht.
    const steuerbar = werte.filter((n) => ARTEN[n] && ARTEN[n].every((d) => steuerArten.includes(d))
      && !(gefundenEnt[n] && !steuerArten.includes(gefundenEnt[n].split(".")[0]))).length;
    zeile(
      "pi_steuern",
      steuerbar
        ? `<span class="ja">${e(tf(this._t("pi_steuern_ja"), { z: steuerbar }))}</span>`
        : `<span class="nein">${e(this._t("pi_steuern_nein"))}</span>`
    );
    zeile("pi_hilfe", jaNein(v.heishamon === true, "pi_ja", "pi_hilfe_nein"));
    zeile("pi_getestet", jaNein(v.getestet === true && !eigen, "pi_ja", eigen ? "pi_getestet_eigen" : "pi_getestet_nein"));

    box.innerHTML = `<h5>${e(this._t(auto ? "pi_titel_auto" : "pi_titel"))}</h5><dl>${zeilen.join("")}</dl>
      <div class="ed-bericht">
        <button type="button" id="btn-bericht-github">${e(this._t("pr_github"))}</button>
        <button type="button" id="btn-bericht-kopie" class="is-quiet">${e(this._t("pr_kopieren"))}</button>
      </div>
      <p class="ed-meldung" id="ed-bericht-hinweis">${e(this._t("pr_hinweis"))}</p>`;
    box.hidden = false;
    const hinweis = box.querySelector("#ed-bericht-hinweis");
    box.querySelector("#btn-bericht-github").addEventListener("click", () => {
      const r = this._profilBericht(v, auto);
      const titel = tf(this._t("pr_titel"), { n: this._varianteName(v) });
      const { url, gekuerzt } = this._berichtUrl(titel, r);
      window.open(url, "_blank", "noopener,noreferrer");
      if (gekuerzt) hinweis.textContent = this._t("pr_gekuerzt");
    });
    box.querySelector("#btn-bericht-kopie").addEventListener("click", async () => {
      const ok = await kopiereText(this._berichtText(this._profilBericht(v, auto), Infinity));
      hinweis.textContent = this._t(ok ? "pr_kopiert" : "m_datei_fehler");
    });
  },

  /**
   * Sammelt die Daten fuer eine Rueckmeldung zum Profil: was zugeordnet
   * wurde, was fehlt, was von Hand geaendert wurde und welche Entitaeten
   * der Integration ungenutzt sind. Daraus laesst sich das Profil
   * verbessern, ohne die Anlage zu kennen.
   */
  _profilBericht(v, auto) {
    const hass = this._hass || {};
    const werte = Object.keys(v.werte || {});
    const integration = (v.suche && v.suche.integration) || "";
    const gefunden = detectIntegration(hass, v).entities || {};
    const wert = (eid) => {
      const st = rawState(hass, eid);
      return st === null ? "" : String(st).slice(0, 40);
    };
    const einheit = (eid) => String(attr(hass, eid, "unit_of_measurement", "") || "");
    const zugeordnet = werte
      .filter((n) => gefunden[n])
      .map((n) => ({ feld: n, id: gefunden[n], wert: wert(gefunden[n]), einheit: einheit(gefunden[n]) }));
    const fehlt = werte.filter((n) => !gefunden[n]);
    const konfig = this._config.entities || {};
    const vonHand = Object.keys(konfig)
      .filter((n) => konfig[n] && konfig[n] !== gefunden[n])
      .map((n) => ({ feld: n, id: konfig[n], vorschlag: gefunden[n] || "" }));
    const benutzt = new Set(Object.values(gefunden).concat(Object.values(konfig)));
    const reg = hass.entities || {};
    const uebrig = integration
      ? Object.keys(reg)
        .filter((k) => reg[k] && reg[k].platform === integration && !benutzt.has(k))
        .sort()
        .map((k) => ({ id: k, schluessel: reg[k].translation_key || "", wert: wert(k), einheit: einheit(k) }))
      : [];
    return {
      karte: CARD_VERSION,
      ha: (hass.config && hass.config.version) || "",
      sprache: this._sp(),
      id: v.id,
      name: this._varianteName(v),
      integration,
      getestet: v.getestet === true && !v.eigen,
      eigen: Boolean(v.eigen),
      auto,
      anzahl: integration ? Object.keys(reg).filter((k) => reg[k] && reg[k].platform === integration).length : 0,
      felder: werte.length,
      zugeordnet,
      fehlt,
      vonHand,
      uebrig,
    };
  },

  /**
   * Bericht als Markdown fuer ein GitHub-Issue. Ueberschriften sind
   * englisch, damit jeder Entwickler sie lesen kann. "grenze" begrenzt
   * die Liste der ungenutzten Entitaeten.
   */
  _berichtText(r, grenze, stufe = 0) {
    const z = (t) => String(t).replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
    const teile = [
      "### Profile report",
      "",
      `- Card version: ${r.karte}`,
      `- Home Assistant: ${r.ha || "unknown"}`,
      `- Language: ${r.sprache}`,
      `- Profile: \`${r.id}\` (${z(r.name)})${r.eigen ? ", own profile" : ""}`,
      `- Selected: ${r.auto ? "automatically" : "manually"}`,
      `- Tested: ${r.getestet ? "yes" : "no"}`,
      `- Integration: ${r.integration ? `\`${r.integration}\`, ${r.anzahl} entities` : "none (search by entity ID)"}`,
      "",
      `### Assigned values (${r.zugeordnet.length} of ${r.felder})`,
      "",
    ];
    if (!r.zugeordnet.length) {
      teile.push("none");
    } else if (stufe >= 2) {
      teile.push("_List left out because the link would be too long. Please paste the copied report._");
    } else if (stufe === 1) {
      r.zugeordnet.forEach((a) => teile.push(`- ${a.feld}: ${z(a.id)}`));
    } else {
      teile.push("| Name | Entity | State | Unit |", "|---|---|---|---|");
      r.zugeordnet.forEach((a) => teile.push(`| ${a.feld} | ${z(a.id)} | ${z(a.wert)} | ${z(a.einheit)} |`));
    }
    teile.push("", "### Values not found", "", r.fehlt.length ? r.fehlt.join(", ") : "none");
    if (r.vonHand.length) {
      teile.push("", "### Changed by hand in the card", "", "| Name | Entity set by user | Profile suggestion |", "|---|---|---|");
      r.vonHand.forEach((a) => teile.push(`| ${a.feld} | ${z(a.id)} | ${z(a.vorschlag || "-")} |`));
    }
    if (r.uebrig.length) {
      const liste = r.uebrig.slice(0, grenze);
      teile.push("", `### Unused entities of the integration (${r.uebrig.length})`, "");
      if (liste.length) teile.push("| Entity | translation_key | State | Unit |", "|---|---|---|---|");
      liste.forEach((a) => teile.push(`| ${z(a.id)} | ${z(a.schluessel)} | ${z(a.wert)} | ${z(a.einheit)} |`));
      if (liste.length < r.uebrig.length) {
        teile.push("", `_${r.uebrig.length - liste.length} more not listed (shortened)._`);
      }
    }
    teile.push(
      "",
      "### What is wrong or missing?",
      "",
      "<!-- Which values are wrong, missing or assigned to the wrong name? Which heat pump model? -->",
      ""
    );
    return teile.join("\n");
  },

  /**
   * Adresse fuer ein neues Issue. GitHub nimmt nur Adressen bis etwa
   * 8000 Zeichen an. Ist der Bericht zu lang, wird die Liste der
   * ungenutzten Entitaeten gekuerzt. Der volle Bericht bleibt ueber
   * "Bericht kopieren" erreichbar.
   */
  _berichtUrl(titel, r) {
    const basis = "https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/issues/new";
    const GRENZE = 7500;
    const bau = (grenze, stufe) =>
      `${basis}?title=${encodeURIComponent(titel)}&body=${encodeURIComponent(this._berichtText(r, grenze, stufe))}`;
    // Erst die Liste der ungenutzten Entitaeten kuerzen, dann die
    // Zuordnung knapper schreiben, zuletzt die Zuordnung weglassen.
    let grenze = r.uebrig.length;
    let stufe = 0;
    let url = bau(grenze, stufe);
    while (url.length > GRENZE && grenze > 0) {
      grenze = Math.max(0, grenze - 10);
      url = bau(grenze, stufe);
    }
    while (url.length > GRENZE && stufe < 2) {
      stufe++;
      url = bau(grenze, stufe);
    }
    return { url, gekuerzt: grenze < r.uebrig.length || stufe > 0 };
  },

  /** Speichert Varianten in der Kartenkonfiguration und waehlt die erste. */
  _speichereVarianten(varianten, dateiName, herkunft) {
    const ids = new Set(varianten.map((v) => v.id));
    const bisher = (Array.isArray(this._config.profile_custom) ? this._config.profile_custom : [])
      .filter((p) => p && !ids.has(p.id));
    const neu = varianten.map((v) => ({ ...alsDatei(v).varianten[0], dateiName, herkunft }));
    this._config = { ...this._config, profile_custom: bisher.concat(neu), profil: varianten[0].id };
    this._emit();
    this._zeigeProfilAuswahl();
  },

  /** Bedienung von Frage, Erneut suchen, Profile aktualisieren, Export, Import und Entfernen. */
  _bindeProfile() {
    const sr = this.shadowRoot;
    const sagen = (text) => {
      const el = sr.getElementById("ed-profil-hinweis");
      if (el) el.textContent = text;
    };

    // Frage nach einem bestimmten Profil
    const fHersteller = sr.getElementById("frage-hersteller");
    if (fHersteller) fHersteller.addEventListener("change", () => this._frageVarianten());
    const fVariante = sr.getElementById("frage-variante");
    const fLaden = sr.getElementById("btn-frage-laden");
    if (fVariante && fLaden) fVariante.addEventListener("change", () => { fLaden.disabled = !fVariante.value; });
    if (fLaden) fLaden.addEventListener("click", () => { if (fVariante && fVariante.value) this._setzeProfil(fVariante.value); });
    const fNein = sr.getElementById("btn-frage-nein");
    if (fNein) {
      fNein.addEventListener("click", () => {
        // Die Felder fuer die Entitaeten stehen im erweiterten Editor.
        this._editorModus = "erweitert";
        this._merke("modus", "erweitert");
        this._zeigeModus();
        this._setzeProfil(KEIN_PROFIL);
      });
    }
    const suchen = sr.getElementById("btn-suchen");
    if (suchen) suchen.addEventListener("click", () => this._erneutSuchen());
    const aktualisieren = sr.getElementById("btn-aktualisieren");
    if (aktualisieren) aktualisieren.addEventListener("click", () => this._aktualisiereProfile());

    const aus = sr.getElementById("btn-profil-aus");
    if (aus) {
      aus.addEventListener("click", () => {
        const v = bereitFuer(this._config) && this._hass ? profilFuer(this._config, this._hass) : null;
        if (!v) {
          sagen(this._t("m_p_leer"));
          return;
        }
        const daten = alsDatei(v);
        const text = JSON.stringify(daten, null, 2);
        try {
          const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `geraeteprofil-${v.id}.json`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          sagen(tf(this._t("m_p_export_ok"), { n: this._varianteName(v) }));
        } catch {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }

    const datei = sr.getElementById("ed-profil-datei");
    const ein = sr.getElementById("btn-profil-ein");
    if (ein && datei) {
      ein.addEventListener("click", () => datei.click());
      datei.addEventListener("change", () => {
        const f = datei.files && datei.files[0];
        if (!f) return;
        const leser = new FileReader();
        leser.onload = () => {
          let roh;
          try {
            roh = JSON.parse(String(leser.result || ""));
          } catch {
            sagen(this._t("m_json"));
            return;
          }
          const ergebnis = pruefeProfil(roh);
          if (ergebnis.fehler) {
            sagen(this._t(ergebnis.fehler));
            return;
          }
          if (ergebnis.karte_ab && versionVergleich(ergebnis.karte_ab, CARD_VERSION) > 0) {
            sagen(tf(this._t("m_p_zu_neu"), { v: ergebnis.karte_ab }));
            return;
          }
          const neu = ergebnis.varianten[0];
          this._speichereVarianten(ergebnis.varianten, ergebnis.name, "import");
          const erkannt = this._hass ? erkenneMitProfil(this._hass, neu) : { entities: {} };
          const teile = [
            tf(this._t("m_p_import_ok"), { n: neu.name, z: Object.keys(neu.werte).length }),
            tf(this._t("m_p_gefunden"), { z: Object.keys(erkannt.entities).length }),
          ];
          if (ergebnis.varianten.length > 1) teile.push(tf(this._t("m_p_varianten"), { z: ergebnis.varianten.length }));
          if (ergebnis.unbekannt.length) {
            teile.push(tf(this._t("m_p_unbekannt"), { liste: [...new Set(ergebnis.unbekannt)].slice(0, 5).join(", ") }));
          }
          sagen(teile.join(". ") + ".");
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(f);
        datei.value = "";
      });
    }

    const weg = sr.getElementById("btn-profil-weg");
    if (weg) {
      weg.addEventListener("click", () => {
        const id = profilKennung(this._config);
        const liste = (Array.isArray(this._config.profile_custom) ? this._config.profile_custom : [])
          .filter((p) => p && p.id !== id);
        // Gibt es die Variante im Ordner Profile, gilt sie wieder.
        const eingebaut = Boolean(this._dateiVon(id));
        this._config = { ...this._config, profile_custom: liste, profil: eingebaut ? id : AUTO_PROFIL };
        this._emit();
        this._zeigeProfilAuswahl();
        sagen(this._t(eingebaut ? "m_p_zurueck" : "m_p_entfernt"));
      });
    }
  },

  /**
   * "Profile aktualisieren": laedt auf einmal alle Varianten aus dem Ordner
   * Profile auf GitHub (Zweig main), die neu oder neuer als die vorhandenen
   * sind, prueft sie und speichert sie in dieser Karte. Die Auswahl bleibt,
   * danach sucht der Editor neu. Die Meldung steht unter den Knoepfen.
   */
  async _aktualisiereProfile() {
    const sagen = (text) => {
      const el = this.shadowRoot.getElementById("ed-aktualisieren-meldung");
      if (el) el.textContent = text;
    };
    const knopf = (aus) => {
      const el = this.shadowRoot.getElementById("btn-aktualisieren");
      if (el) el.disabled = aus;
    };
    knopf(true);
    sagen(this._t("m_gh_sucht"));
    let text;
    try {
      text = await this._holeVonGithub();
    } catch {
      text = this._t("m_gh_fehler");
    }
    knopf(false);
    sagen(text);
  },

  /**
   * Vergleicht die Liste auf GitHub mit dem, was die Karte hat (Ordner
   * Profile und gespeicherte Kopien von GitHub). Neuer heisst: spaeteres
   * Pruefdatum, spaetere Aenderung der Integration oder hoehere Version.
   * Nicht geladen werden Varianten, die eine neuere Karte brauchen oder
   * fehlerhaft sind. Eigene Anpassungen (Import) werden nicht ersetzt.
   * Kopien, die der Ordner Profile inzwischen gleich oder neuer hat,
   * fallen weg (eigene Festlegung). Liefert die Meldung.
   */
  async _holeVonGithub() {
    const fern = await githubListe();
    // Erst die eigene Liste: Ohne sie waere alles "neu".
    profileNeuVersuchen();
    await ladeListe().catch(() => null);
    const ja = this._sp() === "ja";
    const name = (d, v) => (d.name && d.name !== v.name ? `${d.name}, ${v.name}` : v.name);
    const kurz = (liste) => liste.slice(0, 5).join(" · ") + (liste.length > 5 ? " …" : "");

    const eingebaut = {};
    profilListe().forEach((d) => d.varianten.forEach((v) => { eingebaut[v.id] = v; }));
    const eigene = eigeneVarianten(this._config);
    const kopien = eigene.filter((v) => v.herkunft === "github");
    const lokal = { ...eingebaut };
    kopien.forEach((v) => {
      if (!lokal[v.id] || istNeuer(v.quelle, lokal[v.id])) lokal[v.id] = v.quelle;
    });

    const kandidaten = [];
    const zuNeu = {};
    const angepasst = [];
    fern.forEach((d) => d.varianten.forEach((v) => {
      const da = lokal[v.id];
      if (da && !istNeuer(v, da)) return;
      if (eigene.some((x) => x.id === v.id && x.herkunft !== "github")) {
        angepasst.push(name(d, v));
        return;
      }
      if (versionVergleich(d.karte_ab, CARD_VERSION) > 0) {
        (zuNeu[d.karte_ab] = zuNeu[d.karte_ab] || []).push(name(d, v));
        return;
      }
      kandidaten.push({ d, v, neu: !da });
    }));

    // Jede Datei nur einmal holen. Ist GitHub dabei nicht erreichbar, wird
    // nichts gespeichert.
    const dateien = {};
    let erreichbar = true;
    await Promise.all([...new Set(kandidaten.map((k) => k.d.datei))].map((datei) =>
      githubDatei(datei)
        .then((erg) => { dateien[datei] = erg; })
        .catch((e) => {
          if (e instanceof SyntaxError) dateien[datei] = { fehler: "m_json" };
          else erreichbar = false;
        })));
    if (!erreichbar) return this._t("m_gh_fehler");

    const geladen = [];
    const aktualisiert = [];
    const neu = [];
    const fehlerhaft = [];
    kandidaten.forEach(({ d, v, neu: istNeu }) => {
      const erg = dateien[d.datei];
      const fv = erg && !erg.fehler ? erg.datei.varianten.find((x) => x.id === v.id) : null;
      if (!fv) {
        fehlerhaft.push(name(d, v));
        return;
      }
      if (versionVergleich(erg.datei.karte_ab, CARD_VERSION) > 0) {
        (zuNeu[erg.datei.karte_ab] = zuNeu[erg.datei.karte_ab] || []).push(name(erg.datei, fv));
        return;
      }
      geladen.push({ ...alsDatei(fv).varianten[0], dateiName: erg.datei.name, dateiId: erg.datei.id, herkunft: "github" });
      (istNeu ? neu : aktualisiert).push(name(erg.datei, fv));
    });

    // Speichern: neue Kopien ersetzen alte, ueberholte Kopien fallen weg.
    // Kopien aus 6.0.0 bekommen die Kennung ihrer Datei.
    const roh = Array.isArray(this._config.profile_custom) ? this._config.profile_custom : [];
    const ids = new Set(geladen.map((v) => v.id));
    const liste = roh
      .filter((p) => {
        if (!p || typeof p !== "object") return true;
        if (ids.has(p.id)) return false;
        if (p.herkunft !== "github") return true;
        const k = kopien.find((x) => x.id === p.id);
        return !(k && eingebaut[p.id] && !istNeuer(k.quelle, eingebaut[p.id]));
      })
      .map((p) => {
        if (!p || p.herkunft !== "github" || p.dateiId) return p;
        const d = fern.find((x) => x.varianten.some((v) => v.id === p.id));
        return d ? { ...p, dateiId: d.id } : p;
      })
      .concat(geladen);
    if (JSON.stringify(liste) !== JSON.stringify(roh)) {
      this._config = { ...this._config, profile_custom: liste };
      this._emit();
    }
    // Neu suchen, die Auswahl bleibt.
    this._profileFuer = null;
    this._zeigeProfilAuswahl();

    const teile = [];
    if (aktualisiert.length) teile.push(tf(this._t("m_gh_aktualisiert"), { z: aktualisiert.length, liste: kurz(aktualisiert) }));
    if (neu.length) teile.push(tf(this._t("m_gh_neu"), { z: neu.length, liste: kurz(neu) }));
    const saetze = [];
    if (teile.length) saetze.push(tf(this._t("m_gh_profile"), { teile: teile.join(ja ? "、" : ", ") }));
    Object.keys(zuNeu)
      .sort(versionVergleich)
      .forEach((v) => saetze.push(tf(this._t("m_gh_zu_neu"), { v, liste: kurz(zuNeu[v]) })));
    if (fehlerhaft.length) saetze.push(tf(this._t("m_gh_fehlerhaft"), { liste: kurz(fehlerhaft) }));
    if (angepasst.length) saetze.push(tf(this._t("m_gh_eigen"), { liste: kurz(angepasst) }));
    return saetze.length ? saetze.join(ja ? "" : " ") : this._t("m_gh_aktuell");
  },

  /**
   * Statuszeile der Erkennung, Rahmenfarbe und die Knoepfe "Aus Integration
   * uebernehmen", "Standardnamen eintragen" und "Eigenes Profil entfernen".
   */
  _zeigeProfilKnoepfe(kandidaten) {
    const sr = this.shadowRoot;
    const weg = sr.getElementById("btn-profil-weg");
    const id = profilKennung(this._config);
    if (weg) weg.hidden = !gueltigeEigene(this._config).some((v) => v.id === id);
    if (!this._hass) return;
    const s = this._status(kandidaten || []);
    const gruppe = sr.querySelector(".ed-detect");
    if (gruppe) {
      gruppe.classList.toggle("is-found", s.found);
      gruppe.classList.toggle("is-absent", !s.found);
    }
    const status = sr.querySelector(".ed-detect .ed-status");
    if (status) status.textContent = s.text;
    const adopt = sr.getElementById("btn-adopt");
    if (adopt) adopt.disabled = !s.found;
    const standard = sr.getElementById("btn-default");
    if (standard) standard.disabled = !(s.v && Object.keys(standardNamen(s.v)).some((n) => ENTITY_FIELDS.some((f) => f.key === n) || UEBERNEHMEN_OHNE_FELD.includes(n)));
  },

  /** Text der Statuszeile und ob Entitaeten gefunden wurden. */
  _status(kandidaten) {
    const id = profilKennung(this._config);
    if (id === KEIN_PROFIL) return { text: this._t("m_keins_gewaehlt"), found: false, v: null };
    if (!bereitFuer(this._config)) return { text: this._t("m_profile_laden"), found: false, v: null };
    const auto = id === AUTO_PROFIL;
    const v = profilFuer(this._config, this._hass);
    if (!v) {
      if (profileFehler(this._config)) return { text: this._t("m_profile_fehler"), found: false, v: null };
      return { text: auto ? this._t("m_kein_profil") : tf(this._t("m_profil_fehlt"), { n: id }), found: false, v: null };
    }
    const name = this._varianteName(v);
    const f = detectIntegration(this._hass, v);
    if (!f.found) return { text: tf(this._t("m_nicht_gefunden"), { n: name }), found: false, v };
    if (auto && kandidaten.length > 1) {
      return { text: tf(this._t("m_erkannt_mehrere"), { z: kandidaten.length, n: name }), found: true, v };
    }
    const text = tf(this._t("m_erkannt_p"), { n: name, a: f.count, b: Object.keys(f.entities).length });
    return { text: (auto ? `${this._t("m_auto")} ` : "") + text, found: true, v };
  },
};
