/**
 * Heatpump Flow Card by Lutarym (heatpump-flow-card-by-lutarym)
 * https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym
 *
 * Copyright (C) 2026 Lutarym (Stephan Fröbe)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Einstiegspunkt: registriert Karte und Editor in Home Assistant.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { LutarymHeatpumpCardEditor } from "./editor/editor.js";
import { LutarymHeatpumpCard } from "./karte/karte.js";
import { CARD_VERSION } from "./konstanten.js";

customElements.define("heatpump-flow-card-by-lutarym", LutarymHeatpumpCard);
customElements.define("heatpump-flow-card-by-lutarym-editor", LutarymHeatpumpCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "heatpump-flow-card-by-lutarym",
  name: "Heatpump Flow Card by Lutarym",
  description:
    "Animated plant diagram with two heating circuits, pumps, tanks, heat curve, SG Ready and flow animation.",
  preview: true,
  documentationURL: "https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym",
});
console.info(
  `%c HEATPUMP FLOW CARD BY LUTARYM %c ${CARD_VERSION} `,
  "background:#0D131B;color:#E0762E;font-weight:600;padding:2px 6px;border-radius:3px 0 0 3px",
  "background:#E0762E;color:#0D131B;font-weight:600;padding:2px 6px;border-radius:0 3px 3px 0"
);
