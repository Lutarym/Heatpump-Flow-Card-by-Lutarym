/**
 * Import und Export von Sprachen und Geraeteprofilen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { FIELD_DOMAIN, detectIntegration, erkenneAlle, profilFuer } from "../erkennung.js";
import { DEFAULT_CONFIG } from "../felder.js";
import { escapeHtml, kopiereText, rawState, attr } from "../hilfsfunktionen.js";
import { CARD_VERSION } from "../konstanten.js";
import { AUTO_PROFIL, PROFILE, eigeneProfile, eigenesProfil, eingebautesProfil, erkenneMitProfil, profilBereiche, pruefeProfil } from "../profile.js";
import { PROFIL_STAND } from "../hersteller.js";
import { SPRACH_NAMEN, pruefeSprache, registriereSprachen, sprachpaketFuer } from "../sprachen.js";
import { SPRACHEN, t, tf, wertText } from "../texte.js";

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

  /** Kennung der Gruppe fuer eigene Profile ohne eingebautes Gegenstueck. */
  _eigeneGruppe() {
    return "__eigen";
  },

  /** Hersteller zu einer Profilkennung, "auto" bei automatischer Erkennung. */
  _herstellerVon(id) {
    if (!id || id === AUTO_PROFIL) return AUTO_PROFIL;
    const pr = PROFILE.find((x) => x.id === id);
    if (pr) return pr.hersteller;
    return eigeneProfile(this._config).some((p) => p.id === id) ? this._eigeneGruppe() : AUTO_PROFIL;
  },

  /** Alle Profile eines Herstellers, eingebaute und eigene. */
  _profileVon(hersteller) {
    if (hersteller === this._eigeneGruppe()) {
      return eigeneProfile(this._config)
        .filter((p) => !PROFILE.some((pr) => pr.id === p.id))
        .map((p) => ({ id: p.id, name: p.name, integrationName: p.name, entwickler: p.entwickler || "", eigen: true }));
    }
    return PROFILE.filter((pr) => pr.hersteller === hersteller);
  },

  /** Erstes Profil eines Herstellers, bei "auto" bleibt es "auto". */
  _erstesProfilVon(hersteller) {
    if (hersteller === AUTO_PROFIL) return AUTO_PROFIL;
    const liste = this._profileVon(hersteller);
    return liste.length ? liste[0].id : AUTO_PROFIL;
  },

  /** Erstes Feld: automatisch oder ein Hersteller. */
  _herstellerOptionen() {
    const namen = [...new Set(PROFILE.map((pr) => pr.hersteller))].sort((x, y) => x.localeCompare(y));
    const html = [`<option value="${AUTO_PROFIL}">${escapeHtml(this._t("o_p_auto"))}</option>`];
    namen.forEach((n) => {
      const ungetestet = PROFILE.filter((pr) => pr.hersteller === n).every((pr) => !pr.getestet);
      const zusatz = ungetestet ? ` ${this._t("o_p_ungetestet")}` : "";
      html.push(`<option value="${escapeHtml(n)}">${escapeHtml(n + zusatz)}</option>`);
    });
    if (this._profileVon(this._eigeneGruppe()).length) {
      html.push(`<option value="${this._eigeneGruppe()}">${escapeHtml(this._t("o_p_eigene_gruppe"))}</option>`);
    }
    return html.join("");
  },

  /** Text eines Profils im zweiten Feld: Integration und Entwickler. */
  _profilBeschriftung(pr) {
    const eigene = eigeneProfile(this._config);
    const ersetzt = !pr.eigen && eigene.find((p) => p.id === pr.id);
    let text = pr.integrationName || pr.name;
    if (pr.entwickler) text += ` · ${tf(this._t("o_p_von"), { n: pr.entwickler })}`;
    if (ersetzt) text += ` ${this._t("o_p_angepasst")}`;
    else if (pr.eigen) text += ` ${this._t("o_p_eigen")}`;
    else if (!pr.getestet) text += ` ${this._t("o_p_ungetestet")}`;
    return text;
  },

  /** Zweites Feld: die Integrationen des gewaehlten Herstellers. */
  _profilOptionen() {
    const hersteller = this._herstellerVon(this._config.profil);
    if (hersteller === AUTO_PROFIL) return `<option value="${AUTO_PROFIL}">${escapeHtml(this._t("o_p_auto"))}</option>`;
    return this._profileVon(hersteller)
      .map((pr) => `<option value="${escapeHtml(pr.id)}">${escapeHtml(this._profilBeschriftung(pr))}</option>`)
      .join("");
  },

  /** Name eines Profils fuer Meldungen. */
  _profilName(id) {
    const eigen = eigeneProfile(this._config).find((p) => p.id === id);
    if (eigen) return eigen.name;
    const pr = PROFILE.find((x) => x.id === id);
    if (!pr) return id;
    return pr.entwickler ? `${pr.name} (${pr.entwickler})` : wertText(pr.name, this._sp());
  },

  /**
   * Zeigt beide Felder passend zur Konfiguration. Bei "auto" und mehreren
   * erkannten Integrationen erscheint eine Auswahl, welche gelten soll.
   */
  _zeigeProfilAuswahl() {
    const sr = this.shadowRoot;
    const id = this._config.profil || AUTO_PROFIL;
    const hersteller = this._herstellerVon(id);
    const hWahl = sr.getElementById("opt-hersteller");
    if (hWahl) {
      hWahl.innerHTML = this._herstellerOptionen();
      hWahl.value = hersteller;
    }
    const pWahl = sr.getElementById("opt-profil");
    if (pWahl) {
      pWahl.innerHTML = this._profilOptionen();
      pWahl.value = hersteller === AUTO_PROFIL ? AUTO_PROFIL : id;
    }
    const zeile = sr.getElementById("ed-geraet-zeile");
    if (zeile) zeile.hidden = hersteller === AUTO_PROFIL || this._profileVon(hersteller).length < 2;
    const wahlBox = sr.getElementById("ed-profil-wahl");
    const wahl = sr.getElementById("opt-profil-wahl");
    const kandidaten = id === AUTO_PROFIL && this._hass ? erkenneAlle(this._hass) : [];
    if (wahlBox && wahl) {
      wahlBox.hidden = kandidaten.length < 2;
      wahl.innerHTML = [`<option value="">${escapeHtml(this._t("o_p_bitte"))}</option>`]
        .concat(kandidaten.map((k) =>
          `<option value="${escapeHtml(k.id)}">${escapeHtml(tf(this._t("o_p_kandidat"), { n: this._profilName(k.id), z: k.felder }))}</option>`))
        .join("");
      wahl.value = "";
    }
    this._zeigeProfilInfo(id === AUTO_PROFIL ? (kandidaten[0] && kandidaten[0].id) || "" : id, id === AUTO_PROFIL);
    this._zeigeProfilKnoepfe();
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
  _zeigeProfilInfo(id, auto) {
    const box = this.shadowRoot.getElementById("ed-profil-info");
    if (!box) return;
    if (!id) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const e = escapeHtml;
    const eigen = eigeneProfile(this._config).find((p) => p.id === id);
    const pr = PROFILE.find((x) => x.id === id);
    const daten = eigen || eingebautesProfil(id);
    const felder = daten ? Object.keys(daten.felder) : [];
    const zeilen = [];
    const zeile = (titel, inhalt) => zeilen.push(`<dt>${e(this._t(titel))}</dt><dd>${inhalt}</dd>`);
    const jaNein = (ja, textJa, textNein) =>
      `<span class="${ja ? "ja" : "nein"}">${e(this._t(ja ? textJa : textNein))}</span>`;

    // Integration und Herkunft
    const integration = (eigen && eigen.integration) || (pr && pr.integration) || "";
    const name = eigen ? eigen.name : pr ? pr.integrationName || pr.name : id;
    zeile("pi_integration", `${e(name)}${integration ? ` <span class="grau">(${e(integration)})</span>` : ""}`);
    const entwickler = (eigen && eigen.entwickler) || (pr && pr.entwickler) || "";
    const quelle = !eigen && pr && pr.quelle && /^https:\/\//.test(pr.quelle) ? pr.quelle : "";
    if (entwickler || quelle) {
      const link = quelle
        ? `<a href="${e(quelle)}" target="_blank" rel="noopener noreferrer">${e(quelle.replace(/^https:\/\//, ""))}</a>`
        : "";
      zeile("pi_entwickler", [e(entwickler), link].filter(Boolean).join(" · "));
    }
    // Version und letzte Aenderung
    if (eigen) {
      zeile("pi_version", `<span class="grau">${e(this._t("pi_eigen"))}</span>`);
    } else if (pr && pr.core) {
      zeile("pi_version", e(this._t("pi_core")));
    } else if (pr && pr.mqtt) {
      zeile("pi_version", e(this._t("pi_mqtt")));
    } else if (pr) {
      if (pr.version) zeile("pi_version", `${e(pr.version)} <span class="grau">(manifest.json)</span>`);
      if (pr.aktualisiert) {
        zeile("pi_aenderung", `${e(this._datum(pr.aktualisiert))} <span class="grau">· ${e(tf(this._t("pi_stand"), { d: this._datum(PROFIL_STAND) }))}</span>`);
      }
    }
    // Beschriebene Bereiche statt aller Feldnamen
    const bereiche = profilBereiche(felder);
    zeile(
      "pi_beschreibt",
      `${e(tf(this._t("pi_felder"), { z: felder.length }))}<div class="chips">${bereiche
        .map((b) => `<b>${e(this._t(b))}</b>`)
        .join("")}</div>`
    );
    // Was in Home Assistant gefunden wurde
    if (this._hass && daten) {
      const gefunden = detectIntegration(this._hass, eigen || (pr && !pr.mqtt && id !== "heishamon_lutarym") ? daten : id);
      let anzahl = 0;
      if (integration) {
        const reg = this._hass.entities || {};
        anzahl = Object.keys(reg).filter((k) => reg[k] && reg[k].platform === integration).length;
      } else {
        anzahl = gefunden.count || 0;
      }
      const zugeordnet = Object.keys(gefunden.entities || {}).filter((f) => felder.includes(f)).length;
      zeile(
        "pi_ha",
        anzahl
          ? e(tf(this._t("pi_ha_text"), { a: anzahl, b: zugeordnet, c: felder.length }))
          : `<span class="nein">${e(this._t("pi_ha_keine"))}</span>`
      );
    }
    // Steuern: Felder, die nur stellbare Entitaeten annehmen
    const steuerArten = ["number", "input_number", "switch", "input_boolean", "select", "input_select", "button", "input_button"];
    const steuerbar = felder.filter((f) => FIELD_DOMAIN[f] && FIELD_DOMAIN[f].every((d) => steuerArten.includes(d))).length;
    zeile(
      "pi_steuern",
      steuerbar
        ? `<span class="ja">${e(tf(this._t("pi_steuern_ja"), { z: steuerbar }))}</span>`
        : `<span class="nein">${e(this._t("pi_steuern_nein"))}</span>`
    );
    const hilfe = Boolean(pr && pr.hilfe);
    zeile("pi_hilfe", jaNein(hilfe, "pi_ja", "pi_hilfe_nein"));
    const getestet = Boolean(pr && pr.getestet && !eigen);
    zeile("pi_getestet", jaNein(getestet, "pi_ja", eigen ? "pi_getestet_eigen" : "pi_getestet_nein"));

    box.innerHTML = `<h5>${e(this._t(auto ? "pi_titel_auto" : "pi_titel"))}</h5><dl>${zeilen.join("")}</dl>
      <div class="ed-bericht">
        <button type="button" id="btn-bericht-github">${e(this._t("pr_github"))}</button>
        <button type="button" id="btn-bericht-kopie" class="is-quiet">${e(this._t("pr_kopieren"))}</button>
      </div>
      <p class="ed-meldung" id="ed-bericht-hinweis">${e(this._t("pr_hinweis"))}</p>`;
    box.hidden = false;
    const hinweis = box.querySelector("#ed-bericht-hinweis");
    box.querySelector("#btn-bericht-github").addEventListener("click", () => {
      const r = this._profilBericht(id, auto);
      const titel = tf(this._t("pr_titel"), { n: this._profilName(id) });
      const { url, gekuerzt } = this._berichtUrl(titel, r);
      window.open(url, "_blank", "noopener,noreferrer");
      if (gekuerzt) hinweis.textContent = this._t("pr_gekuerzt");
    });
    box.querySelector("#btn-bericht-kopie").addEventListener("click", async () => {
      const ok = await kopiereText(this._berichtText(this._profilBericht(id, auto), Infinity));
      hinweis.textContent = this._t(ok ? "pr_kopiert" : "m_datei_fehler");
    });
  },

  /**
   * Sammelt die Daten fuer eine Rueckmeldung zum Profil: was zugeordnet
   * wurde, was fehlt, was von Hand geaendert wurde und welche Entitaeten
   * der Integration ungenutzt sind. Daraus laesst sich das Profil
   * verbessern, ohne die Anlage zu kennen.
   */
  _profilBericht(id, auto) {
    const hass = this._hass || {};
    const eigen = eigeneProfile(this._config).find((p) => p.id === id);
    const pr = PROFILE.find((x) => x.id === id);
    const daten = eigen || eingebautesProfil(id);
    const felder = daten ? Object.keys(daten.felder) : [];
    const integration = (eigen && eigen.integration) || (pr && pr.integration) || "";
    const gefunden = daten
      ? detectIntegration(hass, eigen || (pr && !pr.mqtt && id !== "heishamon_lutarym") ? daten : id).entities || {}
      : {};
    const wert = (eid) => {
      const st = rawState(hass, eid);
      return st === null ? "" : String(st).slice(0, 40);
    };
    const einheit = (eid) => String(attr(hass, eid, "unit_of_measurement", "") || "");
    const zugeordnet = felder
      .filter((f) => gefunden[f])
      .map((f) => ({ feld: f, id: gefunden[f], wert: wert(gefunden[f]), einheit: einheit(gefunden[f]) }));
    const fehlt = felder.filter((f) => !gefunden[f]);
    const konfig = this._config.entities || {};
    const vonHand = Object.keys(konfig)
      .filter((f) => konfig[f] && konfig[f] !== gefunden[f])
      .map((f) => ({ feld: f, id: konfig[f], vorschlag: gefunden[f] || "" }));
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
      id,
      name: this._profilName(id),
      integration,
      getestet: Boolean(pr && pr.getestet && !eigen),
      eigen: Boolean(eigen),
      auto,
      anzahl: integration ? Object.keys(reg).filter((k) => reg[k] && reg[k].platform === integration).length : 0,
      felder: felder.length,
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
      `- Integration: ${r.integration ? `\`${r.integration}\`, ${r.anzahl} entities` : "none (MQTT naming)"}`,
      "",
      `### Assigned fields (${r.zugeordnet.length} of ${r.felder})`,
      "",
    ];
    if (!r.zugeordnet.length) {
      teile.push("none");
    } else if (stufe >= 2) {
      teile.push("_List left out because the link would be too long. Please paste the copied report._");
    } else if (stufe === 1) {
      r.zugeordnet.forEach((a) => teile.push(`- ${a.feld}: ${z(a.id)}`));
    } else {
      teile.push("| Field | Entity | State | Unit |", "|---|---|---|---|");
      r.zugeordnet.forEach((a) => teile.push(`| ${a.feld} | ${z(a.id)} | ${z(a.wert)} | ${z(a.einheit)} |`));
    }
    teile.push("", "### Fields not found", "", r.fehlt.length ? r.fehlt.join(", ") : "none");
    if (r.vonHand.length) {
      teile.push("", "### Changed by hand in the card", "", "| Field | Entity set by user | Profile suggestion |", "|---|---|---|");
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
      "<!-- Which values are wrong, missing or assigned to the wrong field? Which heat pump model? -->",
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

  /** Bedienung von Export, Import und Entfernen der Geraeteprofile. */
  _bindeProfile() {
    const sr = this.shadowRoot;
    const sagen = (text) => {
      const el = sr.getElementById("ed-profil-hinweis");
      if (el) el.textContent = text;
    };
    const aktuell = () => {
      const id = this._config.profil || DEFAULT_CONFIG.profil;
      if (id !== AUTO_PROFIL) return id;
      // Bei "auto" gilt fuer den Export das gerade erkannte Profil.
      const gefunden = erkenneAlle(this._hass);
      return gefunden.length ? gefunden[0].id : "heishamon_lutarym";
    };
    const speichern = (liste, profilId) => {
      this._config = { ...this._config, profile_custom: liste, profil: profilId };
      this._emit();
      this._zeigeProfilAuswahl();
    };

    const aus = sr.getElementById("btn-profil-aus");
    if (aus) {
      aus.addEventListener("click", () => {
        const id = aktuell();
        const daten = eigenesProfil(this._config) || eingebautesProfil(id);
        if (!daten) {
          sagen(this._t("m_p_leer"));
          return;
        }
        const text = JSON.stringify(daten, null, 2);
        try {
          const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `geraeteprofil-${daten.id}.json`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          sagen(tf(this._t("m_p_export_ok"), { n: daten.name }));
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
          const neu = ergebnis.profil;
          const liste = eigeneProfile(this._config).filter((p) => p.id !== neu.id);
          liste.push(neu);
          speichern(liste, neu.id);
          const erkannt = erkenneMitProfil(this._hass, neu);
          const teile = [
            tf(this._t("m_p_import_ok"), { n: neu.name, z: Object.keys(neu.felder).length }),
            tf(this._t("m_p_gefunden"), { z: Object.keys(erkannt.entities).length }),
          ];
          if (ergebnis.unbekannt.length) {
            teile.push(tf(this._t("m_p_unbekannt"), { liste: ergebnis.unbekannt.slice(0, 5).join(", ") }));
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
        const id = aktuell();
        const liste = eigeneProfile(this._config).filter((p) => p.id !== id);
        const eingebaut = PROFILE.find((pr) => pr.id === id && pr.fertig);
        speichern(liste, eingebaut ? id : DEFAULT_CONFIG.profil);
        sagen(this._t(eingebaut ? "m_p_zurueck" : "m_p_entfernt"));
      });
    }
    this._zeigeProfilKnoepfe();
  },

  /** Statuszeile der Erkennung, bei eigenem Profil mit dessen Namen. */
  _erkanntText(found) {
    if (!found.found) return this._t("m_nicht_erkannt");
    const werte = { a: found.count, b: Object.keys(found.entities).length };
    let id = this._config.profil || AUTO_PROFIL;
    let auto = false;
    if (id === AUTO_PROFIL) {
      const gefunden = erkenneAlle(this._hass);
      id = gefunden.length ? gefunden[0].id : "heishamon_lutarym";
      auto = true;
      if (gefunden.length > 1) {
        return tf(this._t("m_erkannt_mehrere"), { z: gefunden.length, n: this._profilName(id) });
      }
    }
    if (id === "heishamon_lutarym" && !eigenesProfil(this._config)) {
      return (auto ? `${this._t("m_auto")} ` : "") + tf(this._t("m_erkannt"), werte);
    }
    const text = tf(this._t("m_erkannt_p"), { ...werte, n: this._profilName(id) });
    return (auto ? `${this._t("m_auto")} ` : "") + text;
  },

  /** "Entfernen" nur, wenn das gewaehlte Profil ein eigenes ist. */
  _zeigeProfilKnoepfe() {
    const sr = this.shadowRoot;
    const weg = sr.getElementById("btn-profil-weg");
    if (weg) weg.hidden = !eigenesProfil(this._config);
    // Erkennung nach dem gewaehlten Profil neu anzeigen.
    if (!this._hass) return;
    const found = detectIntegration(this._hass, profilFuer(this._config, this._hass));
    const gruppe = sr.querySelector(".ed-detect");
    if (gruppe) {
      gruppe.classList.toggle("is-found", found.found);
      gruppe.classList.toggle("is-absent", !found.found);
    }
    const status = sr.querySelector(".ed-detect .ed-status");
    if (status) {
      status.textContent = this._erkanntText(found);
    }
    const adopt = sr.getElementById("btn-adopt");
    if (adopt) adopt.disabled = !found.found;
  },
};
