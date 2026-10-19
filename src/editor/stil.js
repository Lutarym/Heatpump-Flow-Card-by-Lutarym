/**
 * Stylesheet des Editors.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
export const stilEditor = {
  _css() {
    return `
      .ed { display: flex; flex-direction: column; gap: 18px; padding: 4px 0 8px; }
      .ed-group {
        border: 1px solid var(--divider-color, #3A4757);
        border-radius: 10px; padding: 12px 14px 14px;
      }
      h3 {
        margin: 0 0 10px; font-size: 13px; letter-spacing: 0.02em;
        color: var(--secondary-text-color, #8A94A6);
      }
      .ed-row {
        display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        align-items: center; gap: 12px; padding: 6px 0;
      }
      .ed-row > span {
        font-size: 14px; color: var(--primary-text-color, #E8EDF4);
        display: flex; flex-direction: column;
      }
      .ed-row em {
        font-style: normal; font-size: 11px; color: var(--secondary-text-color, #8A94A6);
      }
      .ed-check { grid-template-columns: auto 1fr; }
      input[type="text"], input[type="number"], select {
        width: 100%; box-sizing: border-box; padding: 8px 10px;
        border-radius: 8px; font-size: 14px;
        border: 1px solid var(--divider-color, #3A4757);
        background: var(--card-background-color, #12181F);
        color: var(--primary-text-color, #E8EDF4);
      }
      input.is-missing { border-color: #D6534A; }
      .ed-detect.is-found { border-color: #3E8E5A; }
      .ed-detect.is-absent { border-color: #B07B2E; }
      .ed-status {
        margin: 0 0 12px; font-size: 13px; line-height: 1.5;
        color: var(--primary-text-color, #E8EDF4);
      }
      .ed-actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .ed-actions button {
        flex: 1 1 auto; padding: 9px 14px; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 500;
        border: 1px solid var(--divider-color, #3A4757);
        background: var(--primary-color, #03A9F4); color: #FFFFFF;
      }
      .ed-actions button.is-quiet {
        background: transparent; color: var(--secondary-text-color, #8A94A6); flex: 0 0 auto;
      }
      .ed-actions button:disabled { opacity: 0.4; cursor: not-allowed; }
      .ed-actions button:hover:not(:disabled) { filter: brightness(1.1); }
      .ed-note {
        margin: 0; font-size: 12px; line-height: 1.5;
        color: var(--secondary-text-color, #8A94A6);
      }
      .ed-info {
        margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--divider-color, #E0E0E0);
        font-size: 12px; color: var(--secondary-text-color, #8A94A6);
      }
      #ed-austausch {
        width: 100%; box-sizing: border-box; margin-top: 8px; padding: 8px 10px;
        border-radius: 10px; border: 1px solid var(--divider-color, #3A4757);
        background: var(--card-background-color, #12181F); color: var(--primary-text-color, #E8EDF4);
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      .ed.einfach .nur-erweitert { display: none !important; }
      details.ed-klapp > summary {
        list-style: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
      }
      details.ed-klapp > summary::-webkit-details-marker { display: none; }
      details.ed-klapp > summary::before {
        content: ""; flex: 0 0 auto; width: 7px; height: 7px; margin: 0 4px 0 2px;
        border-right: 2px solid var(--secondary-text-color, #8A94A6);
        border-bottom: 2px solid var(--secondary-text-color, #8A94A6);
        transform: rotate(-45deg); transition: transform .15s;
      }
      details.ed-klapp[open] > summary::before { transform: rotate(45deg); }
      details.ed-klapp > summary h3 { margin: 0; flex: 1; display: flex; flex-direction: column; }
      details.ed-klapp[open] > summary { margin-bottom: 10px; }
      h3 em, .ed-block-kopf em { font-style: normal; font-weight: 400; font-size: 11px; color: var(--secondary-text-color, #8A94A6); }
      details.ed-group[hidden], .ed-feld[hidden] { display: none; }
      .ed-zahl { font-size: 12px; color: #B07B2E; white-space: nowrap; }
      .ed-zahl.voll { color: #3E8E5A; }
      .ed-block { display: flex; flex-direction: column; gap: 10px; }
      .ed-block-kopf { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
      .ed-block-kopf h3 { margin: 0; display: flex; flex-direction: column; font-size: 14px; color: var(--primary-text-color, #E8EDF4); }
      .ed-schalter { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--primary-text-color, #E8EDF4); cursor: pointer; }
      h4 { margin: 14px 0 6px; font-size: 12px; font-weight: 600; color: var(--primary-text-color, #E8EDF4); }
      .ed-wahl { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .ed-wahl > input, .ed-wahl > .ed-picker { flex: 1; min-width: 0; }
      .ed-zustand {
        flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex;
        align-items: center; justify-content: center; font-size: 13px; font-weight: 700;
      }
      .ed-zustand[data-wert="ok"] { color: #3E8E5A; border: 1px solid #3E8E5A; }
      .ed-zustand[data-wert="fehlt"] { color: #FFFFFF; background: #D6534A; }
      .ed-zustand[data-wert="leer"] { border: 1px dashed var(--divider-color, #3A4757); }
      .ed-frage {
        display: inline-flex; align-items: center; justify-content: center;
        width: 18px; height: 18px; margin-left: 4px; padding: 0; border-radius: 50%;
        border: 1px solid var(--divider-color, #3A4757); background: transparent;
        color: var(--secondary-text-color, #8A94A6); font-size: 11px; cursor: pointer; vertical-align: middle;
      }
      .ed-frage:hover { color: var(--primary-color, #03A9F4); border-color: var(--primary-color, #03A9F4); }
      .ed-feld > span { display: block; }
      .ed-feld > span em { display: block; }
      .ed-erklaerung {
        grid-column: 1 / -1; margin: 0; padding: 8px 10px; border-radius: 8px; font-size: 12px; line-height: 1.5;
        background: rgba(127,127,127,0.08); color: var(--primary-text-color, #E8EDF4);
      }
      details.ed-unter { border-top: 1px solid var(--divider-color, #3A4757); padding: 8px 0 2px; }
      details.ed-unter:first-of-type { border-top: 0; padding-top: 0; }
      details.ed-unter > summary h4 { margin: 0; flex: 1; font-size: 13px; }
      details.ed-unter[open] > summary { margin-bottom: 4px; }
      .ed-meldung { margin: 4px 0 0; font-size: 12px; color: var(--secondary-text-color, #8A94A6); }
      .ed-meldung:empty { display: none; }
      .ed-seg { display: inline-flex; border: 1px solid var(--divider-color, #3A4757); border-radius: 8px; overflow: hidden; }
      .ed-seg button {
        flex: 1; padding: 8px 14px; border: 0; background: transparent; cursor: pointer;
        font-size: 13px; color: var(--secondary-text-color, #8A94A6);
      }
      .ed-seg button.aktiv { background: var(--primary-color, #03A9F4); color: #FFFFFF; }
      .ed-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
      .ed-buttons button {
        padding: 7px 12px; border-radius: 8px; cursor: pointer; font-size: 12px;
        border: 1px solid var(--divider-color, #3A4757); background: transparent;
        color: var(--primary-text-color, #E8EDF4);
      }
      .ed-buttons button:hover { border-color: var(--primary-color, #03A9F4); }
      /* Lange Auswahlnamen brauchen die ganze Breite. */
      .ed-row.ed-breit { grid-template-columns: 1fr; align-items: stretch; gap: 4px; }
      .ed-row select { width: 100%; min-width: 0; }
      @media (max-width: 600px) { .ed-row { grid-template-columns: 1fr; align-items: stretch; } }
    `;
  },
};
