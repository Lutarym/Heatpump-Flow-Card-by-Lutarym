/**
 * Stylesheet der Karte mit den Farbdarstellungen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { NEUTRAL } from "../konstanten.js";

export const stilKarte = {
  /**
   * Aktualisiert einen Sollwertregler.
   * key      ist die stellbare Entitaet, auf die geschrieben wird.
   * anzeige  ist optional die Entitaet, deren Wert angezeigt wird.
   *          Damit steht am Regler der tatsaechliche Sollwert des
   *          Kreises, auch wenn die stellbare Entitaet etwas
   *          anderes fuehrt.
   */
  /* -------------------- Styles -------------------- */
  _css() {
    return `
      :host { display: block; }
      .lhc { --c-080c12: #080C12; --c-0b1017: #0B1017; --c-0d1219: #0D1219; --c-0d131b: #0D131B; --c-0e1620: #0E1620; --c-0f151e: #0F151E; --c-0f1826: #0F1826; --c-131a24: #131A24; --c-161d28: #161D28; --c-1b2431: #1B2431; --c-1c2533: #1C2533; --c-1e2836: #1E2836; --c-212b39: #212B39; --c-222c3a: #222C3A; --c-232c3a: #232C3A; --c-26303f: #26303F; --c-2a3446: #2A3446; --c-2a3b52: #2A3B52; --c-2b3546: #2B3546; --c-2e3847: #2E3847; --c-2e4661: #2E4661; --c-33415a: #33415A; --c-3a4557: #3A4557; --c-3a4658: #3A4658; --c-3a4757: #3A4757; --c-3e4c61: #3E4C61; --c-46536a: #46536A; --c-55637a: #55637A; --c-55657f: #55657F; --c-6b7a90: #6B7A90; --c-7e8ca0: #7E8CA0; --c-8fa8c8: #8FA8C8; --c-98a6ba: #98A6BA; --c-c3d0e0: #C3D0E0; --c-c9d3e0: #C9D3E0; --c-ddebfa: #DDEBFA; --c-e8edf4: #E8EDF4; }
      .lhc.thema-hell { --c-080c12: #EEF1F5; --c-0b1017: #EEF1F5; --c-0d1219: #EEF1F5; --c-0d131b: #EEF1F5; --c-0e1620: #EBEEF2; --c-0f151e: #ECEFF3; --c-0f1826: #E8EBF0; --c-131a24: #E7EAEE; --c-161d28: #E4E7EB; --c-1b2431: #DDE0E5; --c-1c2533: #DCDFE4; --c-1e2836: #D9DDE1; --c-212b39: #D6DADF; --c-222c3a: #D5D9DE; --c-232c3a: #D5D8DE; --c-26303f: #D1D5DA; --c-2a3446: #CCD0D5; --c-2a3b52: #C6CAD0; --c-2b3546: #CBCFD5; --c-2e3847: #C9CDD3; --c-2e4661: #BCC0C7; --c-33415a: #BFC3C9; --c-3a4557: #BCC0C6; --c-3a4658: #BBC0C6; --c-3a4757: #BBC0C6; --c-3e4c61: #B5BAC0; --c-46536a: #ADB2B9; --c-55637a: #9EA3AB; --c-55657f: #9CA1A8; --c-6b7a90: #898E96; --c-7e8ca0: #787D86; --c-8fa8c8: #5C636D; --c-98a6ba: #5E656F; --c-c3d0e0: #373E4A; --c-c9d3e0: #343B47; --c-ddebfa: #1D2532; --c-e8edf4: #1B2330; }
      .lhc.thema-kontrast { --c-080c12: #000000; --c-0b1017: #000000; --c-0d1219: #000000; --c-0d131b: #000000; --c-0e1620: #131313; --c-0f151e: #111111; --c-0f1826: #1E1E1E; --c-131a24: #212121; --c-161d28: #2A2A2A; --c-1b2431: #383838; --c-1c2533: #3B3B3B; --c-1e2836: #404040; --c-212b39: #454545; --c-222c3a: #474747; --c-232c3a: #474747; --c-26303f: #4E4E4E; --c-2a3446: #555555; --c-2a3b52: #5E5E5E; --c-2b3546: #565656; --c-2e3847: #595959; --c-2e4661: #6B6B6B; --c-33415a: #686868; --c-3a4557: #6B6B6B; --c-3a4658: #6C6C6C; --c-3a4757: #6C6C6C; --c-3e4c61: #747474; --c-46536a: #7D7D7D; --c-55637a: #8E8E8E; --c-55657f: #919191; --c-6b7a90: #A4A4A4; --c-7e8ca0: #B4B4B4; --c-8fa8c8: #CCCCCC; --c-98a6ba: #CACACA; --c-c3d0e0: #EAEAEA; --c-c9d3e0: #EDEDED; --c-ddebfa: #FDFDFD; --c-e8edf4: #FFFFFF; }
      .lhc.thema-nacht { --c-080c12: #030507; --c-0b1017: #030507; --c-0d1219: #030507; --c-0d131b: #030507; --c-0e1620: #040709; --c-0f151e: #040608; --c-0f1826: #06080B; --c-131a24: #07090B; --c-161d28: #080B0D; --c-1b2431: #0C0E11; --c-1c2533: #0C0F12; --c-1e2836: #0E1014; --c-212b39: #0F1216; --c-222c3a: #101316; --c-232c3a: #101316; --c-26303f: #121519; --c-2a3446: #14171C; --c-2a3b52: #171B1F; --c-2b3546: #15181C; --c-2e3847: #16191D; --c-2e4661: #1C2025; --c-33415a: #1B1F24; --c-3a4557: #1C2026; --c-3a4658: #1D2126; --c-3a4757: #1D2126; --c-3e4c61: #20242A; --c-46536a: #24282E; --c-55637a: #2B3038; --c-55657f: #2D3239; --c-6b7a90: #363C45; --c-7e8ca0: #3F464F; --c-8fa8c8: #4D5460; --c-98a6ba: #4C535F; --c-c3d0e0: #606977; --c-c9d3e0: #616A79; --c-ddebfa: #6D7787; --c-e8edf4: #6E7888; }
      .lhc.thema-ha { --c-080c12: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0b1017: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0d1219: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0d131b: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0e1620: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 1%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0f151e: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 1%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0f1826: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 3%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-131a24: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 3%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-161d28: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 5%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1b2431: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 8%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1c2533: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 9%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1e2836: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 10%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-212b39: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 11%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-222c3a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 12%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-232c3a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 12%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-26303f: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 14%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2a3446: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 16%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2a3b52: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 19%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2b3546: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 16%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2e3847: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 17%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2e4661: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-33415a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 22%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4557: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4658: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4757: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3e4c61: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 27%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-46536a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 31%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-55637a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 38%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-55657f: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 39%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-6b7a90: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 48%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-7e8ca0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 56%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-8fa8c8: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 69%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-98a6ba: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 68%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-c3d0e0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 87%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-c9d3e0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 88%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-ddebfa: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 99%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-e8edf4: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 100%, var(--ha-card-background, var(--card-background-color, #0D131B))); }
      [fill="#080C12" i] { fill: var(--c-080c12); }
      [stroke="#080C12" i] { stroke: var(--c-080c12); }
      [stop-color="#080C12" i] { stop-color: var(--c-080c12); }
      [fill="#0B1017" i] { fill: var(--c-0b1017); }
      [stroke="#0B1017" i] { stroke: var(--c-0b1017); }
      [stop-color="#0B1017" i] { stop-color: var(--c-0b1017); }
      [fill="#0D1219" i] { fill: var(--c-0d1219); }
      [stroke="#0D1219" i] { stroke: var(--c-0d1219); }
      [stop-color="#0D1219" i] { stop-color: var(--c-0d1219); }
      [fill="#0D131B" i] { fill: var(--c-0d131b); }
      [stroke="#0D131B" i] { stroke: var(--c-0d131b); }
      [stop-color="#0D131B" i] { stop-color: var(--c-0d131b); }
      [fill="#0E1620" i] { fill: var(--c-0e1620); }
      [stroke="#0E1620" i] { stroke: var(--c-0e1620); }
      [stop-color="#0E1620" i] { stop-color: var(--c-0e1620); }
      [fill="#0F151E" i] { fill: var(--c-0f151e); }
      [stroke="#0F151E" i] { stroke: var(--c-0f151e); }
      [stop-color="#0F151E" i] { stop-color: var(--c-0f151e); }
      [fill="#0F1826" i] { fill: var(--c-0f1826); }
      [stroke="#0F1826" i] { stroke: var(--c-0f1826); }
      [stop-color="#0F1826" i] { stop-color: var(--c-0f1826); }
      [fill="#131A24" i] { fill: var(--c-131a24); }
      [stroke="#131A24" i] { stroke: var(--c-131a24); }
      [stop-color="#131A24" i] { stop-color: var(--c-131a24); }
      [fill="#161D28" i] { fill: var(--c-161d28); }
      [stroke="#161D28" i] { stroke: var(--c-161d28); }
      [stop-color="#161D28" i] { stop-color: var(--c-161d28); }
      [fill="#1B2431" i] { fill: var(--c-1b2431); }
      [stroke="#1B2431" i] { stroke: var(--c-1b2431); }
      [stop-color="#1B2431" i] { stop-color: var(--c-1b2431); }
      [fill="#1C2533" i] { fill: var(--c-1c2533); }
      [stroke="#1C2533" i] { stroke: var(--c-1c2533); }
      [stop-color="#1C2533" i] { stop-color: var(--c-1c2533); }
      [fill="#1E2836" i] { fill: var(--c-1e2836); }
      [stroke="#1E2836" i] { stroke: var(--c-1e2836); }
      [stop-color="#1E2836" i] { stop-color: var(--c-1e2836); }
      [fill="#212B39" i] { fill: var(--c-212b39); }
      [stroke="#212B39" i] { stroke: var(--c-212b39); }
      [stop-color="#212B39" i] { stop-color: var(--c-212b39); }
      [fill="#222C3A" i] { fill: var(--c-222c3a); }
      [stroke="#222C3A" i] { stroke: var(--c-222c3a); }
      [stop-color="#222C3A" i] { stop-color: var(--c-222c3a); }
      [fill="#232C3A" i] { fill: var(--c-232c3a); }
      [stroke="#232C3A" i] { stroke: var(--c-232c3a); }
      [stop-color="#232C3A" i] { stop-color: var(--c-232c3a); }
      [fill="#26303F" i] { fill: var(--c-26303f); }
      [stroke="#26303F" i] { stroke: var(--c-26303f); }
      [stop-color="#26303F" i] { stop-color: var(--c-26303f); }
      [fill="#2A3446" i] { fill: var(--c-2a3446); }
      [stroke="#2A3446" i] { stroke: var(--c-2a3446); }
      [stop-color="#2A3446" i] { stop-color: var(--c-2a3446); }
      [fill="#2A3B52" i] { fill: var(--c-2a3b52); }
      [stroke="#2A3B52" i] { stroke: var(--c-2a3b52); }
      [stop-color="#2A3B52" i] { stop-color: var(--c-2a3b52); }
      [fill="#2B3546" i] { fill: var(--c-2b3546); }
      [stroke="#2B3546" i] { stroke: var(--c-2b3546); }
      [stop-color="#2B3546" i] { stop-color: var(--c-2b3546); }
      [fill="#2E3847" i] { fill: var(--c-2e3847); }
      [stroke="#2E3847" i] { stroke: var(--c-2e3847); }
      [stop-color="#2E3847" i] { stop-color: var(--c-2e3847); }
      [fill="#2E4661" i] { fill: var(--c-2e4661); }
      [stroke="#2E4661" i] { stroke: var(--c-2e4661); }
      [stop-color="#2E4661" i] { stop-color: var(--c-2e4661); }
      [fill="#33415A" i] { fill: var(--c-33415a); }
      [stroke="#33415A" i] { stroke: var(--c-33415a); }
      [stop-color="#33415A" i] { stop-color: var(--c-33415a); }
      [fill="#3A4557" i] { fill: var(--c-3a4557); }
      [stroke="#3A4557" i] { stroke: var(--c-3a4557); }
      [stop-color="#3A4557" i] { stop-color: var(--c-3a4557); }
      [fill="#3A4658" i] { fill: var(--c-3a4658); }
      [stroke="#3A4658" i] { stroke: var(--c-3a4658); }
      [stop-color="#3A4658" i] { stop-color: var(--c-3a4658); }
      [fill="#3A4757" i] { fill: var(--c-3a4757); }
      [stroke="#3A4757" i] { stroke: var(--c-3a4757); }
      [stop-color="#3A4757" i] { stop-color: var(--c-3a4757); }
      [fill="#3E4C61" i] { fill: var(--c-3e4c61); }
      [stroke="#3E4C61" i] { stroke: var(--c-3e4c61); }
      [stop-color="#3E4C61" i] { stop-color: var(--c-3e4c61); }
      [fill="#46536A" i] { fill: var(--c-46536a); }
      [stroke="#46536A" i] { stroke: var(--c-46536a); }
      [stop-color="#46536A" i] { stop-color: var(--c-46536a); }
      [fill="#55637A" i] { fill: var(--c-55637a); }
      [stroke="#55637A" i] { stroke: var(--c-55637a); }
      [stop-color="#55637A" i] { stop-color: var(--c-55637a); }
      [fill="#55657F" i] { fill: var(--c-55657f); }
      [stroke="#55657F" i] { stroke: var(--c-55657f); }
      [stop-color="#55657F" i] { stop-color: var(--c-55657f); }
      [fill="#6B7A90" i] { fill: var(--c-6b7a90); }
      [stroke="#6B7A90" i] { stroke: var(--c-6b7a90); }
      [stop-color="#6B7A90" i] { stop-color: var(--c-6b7a90); }
      [fill="#7E8CA0" i] { fill: var(--c-7e8ca0); }
      [stroke="#7E8CA0" i] { stroke: var(--c-7e8ca0); }
      [stop-color="#7E8CA0" i] { stop-color: var(--c-7e8ca0); }
      [fill="#8FA8C8" i] { fill: var(--c-8fa8c8); }
      [stroke="#8FA8C8" i] { stroke: var(--c-8fa8c8); }
      [stop-color="#8FA8C8" i] { stop-color: var(--c-8fa8c8); }
      [fill="#98A6BA" i] { fill: var(--c-98a6ba); }
      [stroke="#98A6BA" i] { stroke: var(--c-98a6ba); }
      [stop-color="#98A6BA" i] { stop-color: var(--c-98a6ba); }
      [fill="#C3D0E0" i] { fill: var(--c-c3d0e0); }
      [stroke="#C3D0E0" i] { stroke: var(--c-c3d0e0); }
      [stop-color="#C3D0E0" i] { stop-color: var(--c-c3d0e0); }
      [fill="#C9D3E0" i] { fill: var(--c-c9d3e0); }
      [stroke="#C9D3E0" i] { stroke: var(--c-c9d3e0); }
      [stop-color="#C9D3E0" i] { stop-color: var(--c-c9d3e0); }
      [fill="#DDEBFA" i] { fill: var(--c-ddebfa); }
      [stroke="#DDEBFA" i] { stroke: var(--c-ddebfa); }
      [stop-color="#DDEBFA" i] { stop-color: var(--c-ddebfa); }
      [fill="#E8EDF4" i] { fill: var(--c-e8edf4); }
      [stroke="#E8EDF4" i] { stroke: var(--c-e8edf4); }
      [stop-color="#E8EDF4" i] { stop-color: var(--c-e8edf4); }
      .lhc {
        --ink: var(--c-e8edf4); --muted: var(--c-7e8ca0); --line: var(--c-26303f); --panel: var(--c-131a24);
        background: linear-gradient(180deg, var(--c-131a24) 0%, var(--c-0d131b) 100%);
        /* Knappe Polsterung, damit die Zeichnung die Karte ausfuellt. */
        color: var(--ink); padding: 6px 8px 12px; overflow: hidden;
        position: relative;
      }
      .lhc-alert {
        margin-bottom: 14px; padding: 12px 16px; border-radius: 10px;
        background: #3A1214; border: 1px solid #D6534A; color: #FFD9D6;
        font-size: 14px; font-weight: 500;
      }
      .lhc-alert[hidden] { display: none; }
      .lhc-hint {
        margin-bottom: 14px; padding: 12px 16px; border-radius: 10px;
        background: #2A2313; border: 1px solid #B07B2E; color: #F2DFB0;
        font-size: 14px;
      }
      .lhc-hint[hidden] { display: none; }

      /* Bedienleiste des Demomodus. */
      .lhc-demo {
        margin-bottom: 14px; padding: 12px 14px; border-radius: 10px;
        background: #16233A; border: 1px solid #3E6EA8;
      }
      .lhc-demo[hidden] { display: none; }
      .lhc-demo-kopf {
        display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px;
        flex-wrap: wrap;
      }
      .lhc-demo-hinweis { font-size: 12px; color: var(--c-8fa8c8); }
      .lhc-demo-reihe { display: flex; flex-wrap: wrap; gap: 8px; }
      .lhc-demo-knopf {
        padding: 7px 12px; border-radius: 8px; cursor: pointer; font: inherit;
        font-size: 13px; background: var(--c-0f1826); color: var(--ink);
        border: 1px solid var(--c-2e4661);
      }
      .lhc-demo-knopf.is-on {
        background: #1E3A5C; border-color: #5A9BD8; color: var(--c-ddebfa);
      }
      .lhc-demo-knopf:hover { border-color: #5A9BD8; }
      .lhc-demo-regler {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px 18px; margin-top: 12px;
      }
      .lhc-demo-schieber { display: flex; flex-direction: column; gap: 4px; }
      .lhc-demo-schieber span { font-size: 12px; color: var(--c-8fa8c8); }
      .lhc-demo-schieber b { color: var(--ink); font-weight: 700; }
      .lhc-demo-schieber input {
        -webkit-appearance: none; appearance: none; width: 100%; height: 5px;
        border-radius: 3px; background: var(--c-2a3b52); outline: none;
      }
      .lhc-demo-schieber input::-webkit-slider-thumb {
        -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
        background: #5A9BD8; border: 2px solid var(--c-0f1826); cursor: pointer;
      }
      .lhc-svg { width: 100%; height: auto; display: block; }

      .pipe-shell {
        fill: none; stroke: var(--c-0b1017); stroke-width: 18;
        stroke-linecap: round; stroke-linejoin: round;
      }
      .pipe {
        fill: none; stroke: ${NEUTRAL}; stroke-width: 9;
        stroke-linecap: round; stroke-linejoin: round; transition: stroke 900ms ease;
      }
      /* Signalleitung des Außenfühlers, bewusst keine Rohrleitung */
      /* Laufende Striche zeigen an, dass in genau dieser Leitung
         gerade Wasser stroemt. Kurze Punkte verschwinden beim
         Herunterskalieren, daher bewusst lang und kraeftig. */
      .flowdots {
        fill: none; stroke: #FFFFFF; stroke-width: 7;
        stroke-linecap: round; stroke-dasharray: 14 30;
        opacity: 0;
      }
      .flowdots.is-on { opacity: 0.9; }
      /* Schmalere Leitungen fuer Heizkreise, Zusatzwaerme und Zirkulation,
         damit die Geraete und nicht die Rohre das Bild praegen. Die
         Strichlaenge ergibt wie oben 44, sonst springt die Bewegung. */
      .pipe-shell.duenn { stroke-width: 12; }
      .pipe.duenn { stroke-width: 6; }
      .flowdots.duenn { stroke-width: 4; stroke-dasharray: 12 32; }

      .unit-label {
        /* 11px mit engerer Sperrung, sonst passt "Außentemperatur"
           nicht in die halbe Gehaeusebreite. */
        fill: var(--c-7e8ca0); font-size: 12px; letter-spacing: 0.02em;
      }
      /* Eigene Groesse fuer die beiden Werte im Gehaeuse. Die gemeinsame
         Klasse wird auch ausserhalb verwendet und bleibt unveraendert. */
      .unit-value-s {
        fill: var(--c-e8edf4); font-size: 22px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .verbrauch-v {
        fill: var(--c-e8edf4); font-size: 26px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      #verbrauch-group, #zirkulation-group { transition: opacity 300ms ease; }
      .unit-value {
        fill: var(--c-e8edf4); font-size: 26px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      /* Nicht aktivierte Kreise werden abgeblendet, nicht ausgeblendet.
         So bleibt erkennbar, dass es sie gibt. */
      .is-inaktiv { opacity: 0.28; transition: opacity 600ms ease; }
      #valve-arrow-heiz, #valve-arrow-ww { transition: opacity 400ms ease; }
      .cap { fill: var(--c-98a6ba); font-size: 15px; letter-spacing: 0.02em; }
      .cap-s { fill: var(--c-7e8ca0); font-size: 13px; letter-spacing: 0.02em; }
      .value-l {
        fill: #FFFFFF; font-size: 30px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
        paint-order: stroke; stroke: rgba(0,0,0,0.45); stroke-width: 5px;
      }
      .value-s {
        fill: var(--c-98a6ba); font-size: 14px;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      /* Rot gehoert zum Vorlauf, blau zur Aussentemperatur. Achse,
         Teilstriche, Beschriftung und Markierung teilen sich die Farbe. */
      .kurve-achse { font-size: 15px; letter-spacing: 0.02em; }
      .achse-vl { fill: #FF8A5F; font-size: 13px; }
      .achse-aussen { fill: #6BB7E8; font-size: 13px; }
      /* Gruen kennzeichnet den aktuellen Betriebspunkt. */
      .ist-jetzt { fill: #46C07A; font-size: 13px; }
      .kurve-achse.achse-vl, .kurve-achse.achse-aussen { font-size: 15px; }
      /* Die Farbe kommt von der Achsenklasse, hier nur Groesse und Schnitt. */
      .kurve-marke-t {
        font-size: 14px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .hinweis-s { fill: var(--c-6b7a90); font-size: 11px; }
      .value-sp { fill: rgba(255,255,255,0.85); font-size: 17px; }
      /* Werte der Heizkreise stehen frei unter dem Heizkoerper. */
      .lhc .hk-wert { fill: var(--c-e8edf4); font-size: 22px; }
      .lhc .value-sp.verlauf-text { fill: var(--c-e8edf4); }
      .lhc rect.fest-dunkel { fill: #0B1017; }
      /* Namensschilder liegen auf farbigen Flaechen, nachts nicht zu dunkel. */
      .lhc.thema-nacht .cap { fill: #A3ADBD; }
      /* Auf hellem Grund sind gelbe und hellgruene Werte zu blass. Farbige
         Texte werden dort dunkler, weisse Texte auf den Speichern nicht. */
      .lhc.thema-hell svg text:not(.value-l):not(.value-sp):not(.tag-v):not(.cap) {
        filter: brightness(0.72) saturate(1.25);
      }
      /* Weiss mit dunklem Rand wie die Temperatur, damit der Wert auf
         jeder Speicherfarbe lesbar bleibt. */
      .value-cop {
        fill: #FFFFFF; font-size: 17px; font-weight: 700;
        paint-order: stroke; stroke: rgba(0,0,0,0.5); stroke-width: 4px;
      }
      /* Aufsteigende Blasen. Je waermer der Speicher, desto mehr
         davon werden sichtbar geschaltet. */
      .bubble {
        fill: #FFFFFF;
      }
      /* Vorlauf rot, Ruecklauf blau, unabhaengig von der Temperatur. */
      .vl-value, .rl-value {
        font-size: 22px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .vl-value { fill: #FF5F52; }
      .rl-value { fill: #4D9BFF; }
      /* Die Schilder tragen die Farbe des zugehoerigen Wertes und
         stehen als einzige in Grossbuchstaben, das hebt die beiden
         Hauptleitungen hervor. */
      .vl-cap { fill: #FF5F52; text-transform: uppercase; letter-spacing: 0.08em; }
      .rl-cap { fill: #4D9BFF; text-transform: uppercase; letter-spacing: 0.08em; }
      .tag-v {
        fill: #FFFFFF; font-size: 19px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .badge-t { fill: var(--c-e8edf4); font-size: 13px; }
      .modus-t { font-size: 22px; font-weight: 700; }
      .modus-zeile { fill: var(--c-c3d0e0); font-size: 13px; letter-spacing: 0.02em; }
      .modus { transition: color 400ms ease; }
      .badge { opacity: 0; transition: opacity 300ms ease; }
      .badge.is-on { opacity: 1; }

      .pv-value {
        fill: #7BD88F; font-size: 26px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      #pv-group { transition: opacity 300ms ease; }
      .sg-label {
        fill: var(--c-c3d0e0); font-size: 13px; letter-spacing: 0.02em;
      }
      .sg-value {
        /* 13px, damit auch der laengste Zustand "PV Ueberschuss High"
           innerhalb der Trennlinie darunter bleibt. */
        fill: ${NEUTRAL}; font-size: 13px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums; transition: fill 400ms ease;
      }
      #sg-group { transition: opacity 300ms ease; }
      #sg-group rect { transition: all 400ms ease; }
      /* Der aktive Balken leuchtet, damit er sich klar abhebt. */
      #sg-group rect.is-active { filter: drop-shadow(0 0 5px currentColor); }
      #unit-glow { transition: none; }
      #press-group { transition: opacity 300ms ease; }
      #press-needle { transition: all 900ms ease; }

      /* Die Rotoren tragen selbst kein transform-Attribut, sonst wuerde
         die Animation es ueberschreiben und sie an den Nullpunkt werfen. */
      .rotor {
        transform-origin: 0 0;
      }
      .rotor .blades path { fill: var(--c-55637a); }
      .rotor.is-still .blades path, .rotor.is-still > path { fill: var(--c-3a4557); }

      .lhc-wert {
        display: flex; justify-content: space-between; align-items: center;
        width: 100%; gap: 12px; margin-top: 3px; padding: 5px 12px;
        background: var(--c-0d131b); color: var(--ink); font: inherit; font-size: 14px;
        border: 1px solid var(--line); border-radius: 8px;
        cursor: pointer; text-align: left;
      }
      .lhc-wert:hover { border-color: var(--c-55657f); }
      .lhc-wert b {
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums; white-space: nowrap;
      }
      #dlg-werte .lhc-field-label { display: block; margin-top: 8px; }

      .lhc-field-label {
        font-size: 12px; letter-spacing: 0.02em; color: var(--muted);
      }
      .lhc-dlg-hinweis {
        text-align: center; font-size: 12px; color: var(--muted); min-height: 0;
      }
      .lhc-dlg-hinweis:empty { display: none; }
      .lhc-ctl-scale {
        display: flex; justify-content: space-between; margin-top: 6px;
        font-size: 11px; color: var(--muted);
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-slider {
        -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
        border-radius: 3px; background: var(--c-26303f); outline: none;
      }
      .lhc-slider:disabled { opacity: 0.4; }
      .lhc-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid var(--c-0d131b);
        cursor: pointer; box-shadow: 0 0 0 1px var(--c-3a4757);
      }
      .lhc-slider::-moz-range-thumb {
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid var(--c-0d131b); cursor: pointer;
      }
      .lhc-slider:focus-visible { box-shadow: 0 0 0 3px rgba(224,118,46,0.4); }
      /* Anklickbare Baugruppen und das Einstellfenster. */
      .klickbar { cursor: pointer; }
      /* Kein filter: der zwingt den Browser, die Vektorgrafik zu rastern,
         dadurch werden Linien und Schrift beim Ueberfahren unscharf. */
      .klickbar:hover { opacity: 0.82; }
      .lhc-dialog {
        position: absolute; inset: 0; z-index: 5;
        display: flex; align-items: center; justify-content: center;
        padding: 12px; background: rgba(6, 10, 16, 0.72);
      }
      .lhc-dialog[hidden] { display: none; }
      .lhc-dialog-box {
        /* Die Karte schneidet Ueberstehendes ab. Darum wird der Kasten
           auf die Kartenhoehe begrenzt und bekommt bei Bedarf einen
           eigenen Rollbalken. */
        box-sizing: border-box;
        width: min(360px, 100%); max-height: 100%; overflow-y: auto;
        padding: 12px 16px; border-radius: 16px;
        background: var(--c-161d28); border: 1px solid var(--line);
        box-shadow: 0 18px 48px rgba(0,0,0,0.55);
      }
      .lhc-dialog-head {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      .lhc-dialog-title {
        font-size: 13px; letter-spacing: 0.02em;
        color: var(--muted);
      }
      .lhc-dialog-close {
        background: none; border: none; color: var(--muted); cursor: pointer;
        font-size: 26px; line-height: 1; padding: 0 4px;
      }
      .lhc-dialog-close:hover { color: var(--ink); }
      .lhc-dialog-value {
        display: block; margin: 4px 0 8px; text-align: center;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums;
      }
      .lhc-dialog-row { display: flex; align-items: center; gap: 14px; }
      .lhc-step {
        width: 44px; height: 44px; flex: 0 0 auto; border-radius: 12px;
        background: var(--c-1b2431); border: 1px solid var(--line); color: var(--ink);
        font-size: 24px; line-height: 1; cursor: pointer;
      }
      .lhc-step:hover { border-color: var(--c-3e4c61); }
      .lhc-step:focus-visible { outline: 2px solid #E0762E; outline-offset: 2px; }
      /* Zwei Spalten: die Auswahlfelder stehen nebeneinander, die
         Schaltflaechen laufen ueber die volle Breite. Das spart Hoehe. */
      #dlg-actions {
        display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;
      }
      /* Nur im Fenster der Baugruppen ueber die volle Breite. Im
         Kurvenfenster sollen die Regler zweispaltig bleiben. */
      #dlg-actions > .lhc-num-kompakt { grid-column: 1 / -1; }
      .lhc-dialog-action {
        width: 100%; margin-top: 0; padding: 8px 14px; border-radius: 12px;
        grid-column: 1 / -1;
        /* Kurze Beschriftungen duerfen sich eine Zeile teilen. */
        font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
        background: var(--c-1b2431); border: 1px solid var(--line); color: var(--ink);
      }
      .lhc-dialog-action[hidden] { display: none; }
      .lhc-dialog-action:hover { border-color: var(--c-3e4c61); }
      .lhc-dialog-action.is-an {
        background: #0E2E1C; border-color: #46C07A; color: #BFEFD2;
      }
      .lhc-dialog-action.is-aus {
        background: #2E1112; border-color: #D6534A; color: #F3C6C3;
      }
      .lhc-dialog-action.schmal { grid-column: auto; }
      .lhc-dialog-action:disabled {
        opacity: 0.45; cursor: not-allowed;
        background: var(--c-1b2431); border-color: var(--line); color: var(--muted);
      }
      .lhc-dialog-action:focus-visible { outline: 2px solid #E0762E; outline-offset: 2px; }
      #dlg-temp[hidden] { display: none; }
      #dlg-temp.nur-lesbar { opacity: 0.45; }
      /* Das Kurvenfenster liegt ueber dem ganzen Bildschirm, nicht nur
         ueber der Karte. Sonst waere es auf die Kartenhoehe begrenzt,
         die im Querformat nur gut 200 Pixel betraegt. */
      #kurve-dialog {
        position: fixed; inset: 0; z-index: 99;
      }
      /* Diagrammfenster: wie die Heizkurve ueber dem ganzen Bildschirm. */
      #dia-dialog { position: fixed; inset: 0; z-index: 99; }
      .lhc-kurve-box.lhc-dia-box { width: min(94vw, 680px); }
      /* Im Fenster steht der Titel schon oben. */
      #dia-verbrauch .verlauf-titel { display: none; }
      .lhc-dia-box:focus { outline: none; }
      .lhc-dia-svg { display: block; width: 100%; height: auto; margin-top: 10px; }
      .lhc-dia-liste { margin-top: 8px; }
      .lhc-dia-zeile {
        display: grid; grid-template-columns: 14px 1fr auto auto; gap: 10px; align-items: center;
        padding: 6px 2px; border-top: 1px solid var(--line); font-size: 14px; color: var(--c-c3d0e0);
      }
      .lhc-dia-zeile b { font-variant-numeric: tabular-nums; color: var(--c-e8edf4); }
      .lhc-dia-zeile em { font-style: normal; color: var(--c-7e8ca0); font-size: 13px; }
      .lhc-dia-farbe { width: 14px; height: 14px; border-radius: 4px; }
      .dia-knopf { cursor: pointer; }
      .dia-knopf .dia-symbol { color: var(--c-98a6ba); }
      .dia-knopf:hover rect, .dia-knopf:focus-visible rect { stroke: #E0762E; }
      .dia-knopf:hover .dia-symbol, .dia-knopf:focus-visible .dia-symbol { color: #E0762E; }
      .dia-knopf:focus { outline: none; }
      .lhc-kurve-box {
        /* Eine Spalte braucht weniger Platz als zwei. */
        /* Auf grossen Bildschirmen zwei Drittel, auf dem Handy fast die
           ganze Breite, sonst waere das Diagramm zu schmal. */
        box-sizing: border-box; width: min(94vw, 560px); max-height: 92vh;
        overflow-y: auto; padding: 16px 18px 14px; border-radius: 16px;
        background: var(--c-161d28); border: 1px solid var(--line);
        box-shadow: 0 18px 48px rgba(0,0,0,0.55);
      }
      .lhc-kurve-titel {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 16px; font-weight: 600; color: var(--c-e8edf4); margin-bottom: 8px;
      }
      .lhc-kurve-reihe { display: flex; gap: 18px; align-items: flex-start; }
      .lhc-kurve-spalte { flex: 1; min-width: 0; }
      .lhc-kurve-spalte[hidden] { display: none; }
      .lhc-kurve-kopf {
        display: flex; justify-content: space-between; align-items: baseline;
        font-size: 13px; color: var(--c-98a6ba); margin-bottom: 4px;
        border-bottom: 1px solid var(--line); padding-bottom: 4px;
      }
      .lhc-kurve-soll {
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: var(--c-c3d0e0);
      }
      .ist-jetzt-html { color: #46C07A; }
      .vl-html { color: #FF8A5F; }
      .lhc-kurve-svg { width: 100%; height: auto; display: block; }
      .lhc-kurve-regler {
        margin-top: 4px; display: grid; grid-template-columns: 1fr 1fr;
        gap: 4px 14px;
      }
      .lhc-num-kompakt {
        display: flex; align-items: center; gap: 6px; padding: 2px 0;
        font-size: 12px; color: var(--c-98a6ba);
      }
      .lhc-num-kompakt span { flex: 1; min-width: 0; }
      /* Dieselbe Zuordnung wie im Diagramm: orange Vorlauf, blau außen. */
      .lhc-num-kompakt.ist-vl span, .lhc-num-kompakt.ist-vl output { color: #FF8A5F; }
      .lhc-num-kompakt.ist-aussen span, .lhc-num-kompakt.ist-aussen output { color: #6BB7E8; }
      .lhc-num-kompakt output {
        min-width: 58px; text-align: right; font-size: 13px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: var(--c-e8edf4);
      }
      /* Die Tuer ist eine eigene Ebene ueber der Waermepumpe. Gedreht wird
         nur diese Ebene, das uebernimmt die Grafikkarte. Die SVG-Gruppe
         selbst bleibt unbewegt und ist waehrenddessen ausgeblendet. */
      .tuer-zu #unit-group, .tuer-offen #unit-group { visibility: hidden; }
      .lhc-tuer-blatt {
        position: absolute; z-index: 3; pointer-events: none;
        transform-origin: 0% 50%; will-change: transform;
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        transform: perspective(1400px) rotateY(0deg);
        transition: transform 700ms cubic-bezier(0.45, 0.05, 0.2, 1);
      }
      .lhc-tuer-blatt.auf { transform: perspective(1400px) rotateY(-100deg); }
      .lhc-tuer-blatt svg { display: block; width: 100%; height: 100%; overflow: visible; }
      .tuer-knopf { cursor: pointer; outline: none; }
      .tuer-knopf:hover > circle:first-of-type,
      .tuer-knopf:focus-visible > circle:first-of-type { stroke: #E0762E; }
      .lhc-tuer {
        position: absolute; z-index: 4; box-sizing: border-box;
        display: flex; flex-direction: column; gap: 6px; padding: 10px 10px;
        background: var(--c-080c12); border: 1px solid var(--c-33415a); border-radius: 14px;
        color: var(--ink); opacity: 0; transition: opacity 260ms ease 520ms;
      }
      .lhc-tuer[hidden] { display: none; }
      .lhc-tuer.sichtbar { opacity: 1; }
      /* Beim Schliessen sofort ausblenden, dann klappt die Tuer zu. */
      .lhc-tuer:not(.sichtbar) { transition-delay: 0ms; }
      .lhc-tuer-kopf { font-size: 14px; font-weight: 600; text-align: center; color: var(--c-e8edf4); }
      .lhc-tuer-liste {
        flex: 1; min-height: 0; overflow-y: auto;
        display: flex; flex-direction: column; gap: 3px;
      }
      .lhc-hilfe-knopf {
        position: absolute; right: 14px; bottom: 14px; z-index: 2;
        width: 44px; height: 44px; border-radius: 50%; padding: 0;
        border: 1px solid var(--c-55657f); background: var(--c-0d1219); color: var(--c-c3d0e0);
        font-size: 20px; font-weight: 700; line-height: 1; cursor: pointer;
      }
      .lhc-hilfe-box:focus { outline: none; }
      .lhc-hilfe-knopf:hover, .lhc-hilfe-knopf:focus-visible { border-color: #E0762E; color: #E0762E; outline: none; }
      .lhc-hilfe {
        position: fixed; inset: 0; z-index: 100;
        display: flex; align-items: center; justify-content: center;
        padding: 12px; background: rgba(6, 10, 16, 0.72);
      }
      .lhc-hilfe[hidden] { display: none; }
      .lhc-hilfe-box {
        box-sizing: border-box; width: min(96vw, 920px); height: min(92vh, 900px);
        display: flex; flex-direction: column; gap: 10px; padding: 16px 18px 12px;
        background: var(--c-161d28); border: 1px solid var(--line); border-radius: 16px;
        box-shadow: 0 18px 48px rgba(0,0,0,0.55); color: var(--c-e8edf4);
      }
      .lhc-hilfe-kopf {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 17px; font-weight: 600;
      }
      .lhc-hilfe-suche {
        box-sizing: border-box; width: 100%; padding: 10px 12px; border-radius: 10px;
        border: 1px solid var(--c-33415a); background: var(--c-0d1219); color: var(--c-e8edf4); font-size: 15px;
      }
      .lhc-hilfe-suche:focus { outline: none; border-color: #E0762E; }
      .lhc-hilfe-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .lhc-hilfe-chips button {
        border: 1px solid var(--c-33415a); background: transparent; color: var(--c-98a6ba);
        border-radius: 999px; padding: 4px 10px; font-size: 12.5px; cursor: pointer;
      }
      /* Auf schmalen Bildschirmen eine Zeile zum Wischen statt vieler Zeilen. */
      @media (max-width: 700px) {
        .lhc-hilfe-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
        .lhc-hilfe-chips button { flex: 0 0 auto; }
        .lhc-hilfe-box { padding: 12px 12px 10px; }
      }
      .lhc-hilfe-chips button.aktiv { background: var(--c-26303f); color: var(--c-e8edf4); border-color: var(--c-55657f); }
      .lhc-hilfe-liste { flex: 1; min-height: 0; overflow-y: auto; padding-right: 4px; }
      .lhc-hilfe-liste h3 {
        margin: 14px 0 6px; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: #E0762E;
      }
      .lhc-hilfe-liste section:first-child h3 { margin-top: 2px; }
      .lhc-hilfe-liste article {
        padding: 9px 11px; margin-bottom: 6px; border-radius: 10px;
        background: var(--c-0f151e); border: 1px solid var(--c-222c3a);
      }
      .lhc-hilfe-liste .eintrag-kopf { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .lhc-hilfe-liste .eintrag-kopf b { font-size: 14.5px; margin-right: 4px; }
      .lhc-hilfe-liste .marke {
        font-size: 11px; padding: 2px 7px; border-radius: 6px; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-hilfe-liste .marke.lesen { background: #12304A; color: #8CC4F0; }
      .lhc-hilfe-liste .marke.schreiben { background: #3A2410; color: #F2A86A; }
      .lhc-hilfe-liste .marke.bereich { background: var(--c-1c2533); color: var(--c-c3d0e0); }
      .lhc-hilfe-liste p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--c-c9d3e0); }
      .lhc-hilfe-liste .keine { color: var(--c-98a6ba); text-align: center; margin-top: 30px; }
      .lhc-hilfe-liste .entitaeten { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .lhc-hilfe-liste .entitaet {
        position: relative; display: inline-flex; align-items: center; gap: 6px;
        max-width: 100%; padding: 4px 8px; border-radius: 7px; cursor: pointer;
        border: 1px solid var(--c-33415a); background: var(--c-0d1219); color: var(--c-c3d0e0);
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      .lhc-hilfe-liste .entitaet span { overflow-wrap: anywhere; text-align: left; }
      .lhc-hilfe-liste .entitaet svg { width: 13px; height: 13px; flex: 0 0 auto; fill: currentColor; opacity: 0.7; }
      .lhc-hilfe-liste .entitaet:hover { border-color: #E0762E; color: var(--c-e8edf4); }
      .lhc-hilfe-liste .entitaet.kopiert { border-color: #46C07A; color: #46C07A; }
      .lhc-hilfe-liste .entitaet.kopiert::after {
        content: attr(data-hinweis); position: absolute; right: 6px; top: -22px;
        background: #46C07A; color: var(--c-0d131b); font-family: inherit; font-size: 11px;
        font-weight: 700; padding: 2px 6px; border-radius: 5px;
      }
      .lhc-hilfe-liste .keine-entitaet { font-size: 12px; color: var(--c-6b7a90); font-style: italic; }
      .lhc-hilfe-fuss { font-size: 11.5px; color: var(--c-7e8ca0); line-height: 1.4; }
      .lhc-tuer-gruppe { display: flex; flex-direction: column; gap: 3px; break-inside: avoid; }
      .lhc-tuer.zwei .lhc-tuer-liste { display: block; column-count: var(--spalten, 2); column-gap: 16px; }
      .lhc-tuer.zwei .lhc-tuer-gruppe { margin-bottom: 4px; }
      .lhc-tuer-abschnitt {
        font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--muted); margin-top: 5px;
      }
      .lhc-tuer-zeile {
        display: flex; align-items: center; justify-content: space-between;
        gap: 6px; font-size: 12.5px; line-height: 1.2; min-height: 28px;
      }
      .lhc-tuer-zeile > span { flex: 1; min-width: 0; }
      .lhc-tuer-zeile.spalte { flex-direction: column; align-items: stretch; gap: 4px; }
      .lhc-tuer-zeile.spalte .lhc-tuer-seg button { flex: 1; }
      .lhc-tuer-zeile em { color: var(--muted); font-style: normal; font-size: 11px; }
      .lhc-tuer-gruppe em.jaz-seit { display: block; color: var(--muted); font-style: normal; font-size: 11px; margin: 2px 0 4px; }
      .lhc-jaz {
        display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; column-gap: 10px; row-gap: 6px;
        align-items: baseline; font-size: 12px; padding: 4px 12px 2px 0;
      }
      .lhc-jaz .jaz-wert { color: var(--c-e8edf4); }
      .lhc-jaz .jaz-kopf { color: var(--muted); font-size: 11px; text-align: right; white-space: nowrap; }
      .lhc-jaz .jaz-art { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .lhc-jaz output {
        text-align: right; min-width: 0; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-jaz .jaz-gesamt { font-weight: 700; border-top: 1px solid var(--c-33415a); padding-top: 5px; }
      .lhc-tuer-stell { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
      .lhc-tuer-stell output {
        min-width: 50px; text-align: center; font-size: 13px; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-tuer-stell output.geaendert, .lhc-tuer-seg button.geaendert { color: #E0762E; font-weight: 700; }
      .lhc-tuer-seg {
        display: flex; flex: 0 0 auto; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden;
      }
      .lhc-tuer-seg button {
        background: transparent; color: var(--muted); border: 0;
        padding: 5px 6px; font-size: 11.5px; cursor: pointer; white-space: nowrap;
      }
      .lhc-tuer-seg button.aktiv { background: var(--c-26303f); color: var(--c-e8edf4); }
      .lhc-tuer-seg button:disabled { cursor: default; }
      .lhc-tuer-fuss { display: flex; gap: 8px; }
      .lhc-tuer-knopf {
        flex: 1; padding: 8px; border-radius: 9px; border: 1px solid var(--line);
        background: var(--c-131a24); color: var(--c-e8edf4); font-size: 13px; cursor: pointer;
      }
      .lhc-tuer-knopf.primaer { background: #E0762E; border-color: #E0762E; color: var(--c-0d131b); font-weight: 600; }
      .lhc-step.klein {
        width: 26px; height: 26px; padding: 0; font-size: 15px; line-height: 1;
      }
      .lhc-step:disabled { opacity: 0.3; cursor: default; }
      .lhc-dialog-select {
        display: flex; flex-direction: column; gap: 2px; margin-top: 0;
      }
      .lhc-dialog-select select {
        background: var(--c-0d131b); color: var(--ink); font: inherit; font-size: 15px;
        border: 1px solid var(--line); border-radius: 12px; padding: 7px 10px; width: 100%;
      }

      }
    `;
  },
};
