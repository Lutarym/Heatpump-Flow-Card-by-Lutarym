/**
 * Import und Export von Sprachen und Geraeteprofilen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { detectIntegration, erkenneAlle, profilFuer } from "../erkennung.js";
import { DEFAULT_CONFIG } from "../felder.js";
import { escapeHtml } from "../hilfsfunktionen.js";
import { AUTO_PROFIL, PROFILE, eigeneProfile, eigenesProfil, eingebautesProfil, erkenneMitProfil, pruefeProfil } from "../profile.js";
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
    this._zeigeProfilKnoepfe();
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
