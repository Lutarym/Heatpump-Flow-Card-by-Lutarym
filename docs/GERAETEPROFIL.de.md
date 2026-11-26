# Geräteprofile

[English](GERAETEPROFIL.md) · **Deutsch** · [Français](GERAETEPROFIL.fr.md) · [日本語](GERAETEPROFIL.ja.md)

Ein Geräteprofil sagt der Karte, welche Entität in Home Assistant zu welchem Wert gehört. Die Werte heißen wie in der [Namensliste](NAMENSLISTE.de.md), zum Beispiel TOP14 für die Außentemperatur. Mit dem Profil findet die Karte die Entitäten selbst.

Ab Version 6.0.0 enthält die Karte selbst kein Profil mehr. Alle Profile liegen als Dateien im Ordner `dist/Profile`, eine Datei je Hersteller. Jede Integration oder Firmware ist darin eine Variante, bei Panasonic Aquarea zum Beispiel HeishaMon by Lutarym, HeishaMon (MQTT), HeishaMon von kamaradclimber und Aquarea Smart Cloud. HACS installiert den Ordner mit der Karte. Eigene Profile kommen per Import dazu.

## Wo du es findest

Karte bearbeiten. Im Abschnitt **Integration**:

- **Hersteller**: „Automatisch erkennen“, ein Hersteller aus dem Ordner Profile oder von GitHub, „Eigene Profile“ (wenn vorhanden) oder „Kein Profil, Entitäten selbst eintragen“
- **Integration / Gerät**: erscheint, wenn ein Hersteller mehrere Varianten hat, mit dem Namen des Entwicklers
- **Mehrere Integrationen erkannt**: erscheint bei „Automatisch erkennen“, wenn mehrere Varianten passen
- **Möchtest du ein bestimmtes Profil laden?**: erscheint bei „Automatisch erkennen“, wenn keine Variante passt. Dort wählst du Hersteller und Integration und drückst **Profil laden**. Mit **Nein, Entitäten selbst eintragen** stellt die Karte auf „Kein Profil, Entitäten selbst eintragen“ und der Editor zeigt die Felder für die Entitäten.
- **Aus Integration übernehmen**: trägt die gefundenen Entitäten fest in die Felder ein
- **Erneut suchen**: stellt auf „Automatisch erkennen“ und sucht alle Profile neu ab. Konnten die Profile vorher nicht geladen werden, lädt die Karte sie erneut.
- **Profile aktualisieren**: lädt neue und neuere Profile von GitHub, siehe [Profile von GitHub laden](#profile-von-github-laden)
- **Standardnamen eintragen** (Editor auf **Erweitert**): trägt Entity-IDs ein, die das Profil genau angibt oder nach dem Muster `*.name` (zum Beispiel `sensor.heishamon_top14`)
- **Über dieses Profil**: Integration, Entwickler mit Link zur Quelle, Version, letzte Änderung der Integration und Tag der Prüfung, die beschriebenen Bereiche, was in Home Assistant gefunden wurde, ob die Karte steuern kann, ob es die Hilfe gibt und ob das Profil getestet ist. Version und Daten stehen in der Profildatei und ändern sich nicht von selbst. Darunter **Rückmeldung auf GitHub** und **Bericht kopieren**: Der Bericht enthält zugeordnete, fehlende und von Hand geänderte Werte sowie die ungenutzten Entitäten der Integration. Damit lässt sich ein Profil verbessern. Er enthält Entity-IDs und aktuelle Werte; auf GitHub siehst und änderst du ihn vor dem Absenden.

Im Abschnitt **Import, Export und Anpassungen** (Editor auf **Erweitert**):

- **Profil exportieren**: speichert die gewählte oder erkannte Variante als Datei im Download-Ordner
- **Profil importieren**: liest eine Profildatei ein und wählt die (erste) Variante aus
- **Eigenes Profil entfernen**: erscheint nur bei einem eigenen, angepassten oder von GitHub geladenen Profil

## Wie die Karte lädt und sucht

1. In der Kartenkonfiguration steht unter `profil` die Kennung der Variante, zum Beispiel `heishamon_lutarym`. Die Kennungen bis 5.33.8 gelten weiter.
2. Variante gewählt: Die Karte lädt `liste.json` und genau die Datei dieser Variante.
3. `auto` („Automatisch erkennen“, Standard): Die Karte lädt `liste.json` und einmal alle Dateien. Sie prüft alle Varianten und nimmt die mit den meisten passenden Werten. Eine Variante gilt als gefunden, wenn mindestens zwei Werte passen. Sucht eine Variante über die Entity ID (ohne Integration), zählen dabei keine Entitäten, die laut Register zur Integration einer anderen Variante gehören.
4. Keine Variante passt: Die Karte zeigt „Kein passendes Profil gefunden. Möchtest du ein bestimmtes Profil laden? Karte bearbeiten und oben Hersteller und Integration wählen.“ Ohne Profil nimmt die Karte keinen Hersteller an.
5. `keins`: kein Profil, die Karte nutzt nur die eingetragenen Entitäten.
6. Die Dateien lädt der Browser einmal je Seite. Die Karte hängt ihre Version an den Abruf, nach einem Update holt der Browser die neuen Dateien.
7. Konnten die Profile nicht geladen werden, zeigt die Karte „Die Geräteprofile konnten nicht geladen werden. Bitte die Seite neu laden.“
8. Gibt es in Home Assistant mehrere Geräte derselben Integration (zum Beispiel zwei Wärmepumpen), sucht die Karte die nicht eingetragenen Werte beim Gerät ihrer eingetragenen Entitäten.

## Schnellstart: eigenes Profil

1. Wähle eine passende oder ähnliche Variante, zum Beispiel **Panasonic Aquarea, HeishaMon by Lutarym**, und drücke **Profil exportieren**. Die Datei dient als Vorlage.
2. Suche in Home Assistant die Entitäten deiner Wärmepumpe: **Entwicklerwerkzeuge → Zustände**, Filter zum Beispiel mit dem Gerätenamen.
3. Öffne die Datei in einem Texteditor. Ändere die Kennungen (`id` der Datei und der Variante), die Namen und `suche` und trage unter `werte` deine Entitäten ein. Werte, die es bei dir nicht gibt, löschst du einfach.
4. Drücke **Profil importieren** und wähle die Datei. Die Karte meldet, wie viele Werte beschrieben sind und wie viele davon sie in Home Assistant gefunden hat.
5. Drücke **Aus Integration übernehmen**, wenn die gefundenen Entitäten fest in den Feldern stehen sollen.
6. Prüfe im Editor die einzelnen Felder und korrigiere sie bei Bedarf von Hand.

## Aufbau der Datei

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 2,
  "id": "beispiel",
  "name": "Beispiel",
  "karte_ab": "6.0.0",
  "varianten": [
    {
      "id": "beispiel_wp",
      "name": "Beispiel WP",
      "geraete": [{ "hersteller": ["Beispiel"], "reihe": "", "modelle": [], "hinweis": "" }],
      "quelle": {
        "entwickler": "jemand",
        "adresse": "https://github.com/jemand/beispiel-wp",
        "version": "1.0.0",
        "aktualisiert": "2026-11-20",
        "abgelesen": "2026-11-26"
      },
      "suche": { "art": "integration", "integration": "beispiel_wp", "namensteil": "" },
      "werte": {
        "TOP14": ["outdoor_temperature"],
        "TOP6": ["sensor.*_vorlauf"],
        "TOP1": { "suche": ["sensor.*_durchfluss"], "einheit": "l/h" },
        "TOP26": { "suche": ["sensor.*_betrieb"], "zustaende": { "abtauen": 1, "*": 0 } }
      }
    }
  ]
}
```

Die Datei:

| Angabe | Pflicht | Bedeutung |
|---|---|---|
| `format`, `version` | ja | immer `"lutarym-geraeteprofil"` und `2` |
| `id` | ja | Kennung der Datei, gleich dem Dateinamen ohne `.json`. 2 bis 40 Zeichen, nur Kleinbuchstaben a bis z, Ziffern, `_` und `-`. `liste` ist vergeben. |
| `name` | ja | Name des Herstellers, so steht er im Editor |
| `karte_ab` | ja | kleinste Kartenversion, die die Datei versteht, zum Beispiel `6.0.0`. Ist sie neuer als die Karte, lehnt die Karte die Datei ab. |
| `varianten` | ja | eine oder mehrere Varianten |

Jede Variante:

| Angabe | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Kennung der Variante, über alle Dateien eindeutig. Die Kennungen bis 5.33.8 bleiben. |
| `name` | ja | Name der Integration oder Firmware |
| `geraete` | ja | Liste mit `hersteller` (Liste), `reihe`, `modelle` (Liste) und `hinweis` |
| `quelle` | im Ordner Profile ja | `entwickler`, `adresse` (mit https://), `version`, `aktualisiert` (letzte Änderung der Integration), `abgelesen` (Tag der Prüfung) |
| `suche` | ja | `art`: `integration`, `core` oder `firmware`. `integration`: Domain im Register von Home Assistant. `namensteil`: Teil der Entity ID, wenn ohne Register gesucht wird. |
| `heishamon` | nein | `true`, wenn die Werte von HeishaMon kommen ([Merkmal heishamon](#merkmal-heishamon)) |
| `getestet` | nein | `true`, wenn an einer echten Anlage geprüft |
| `werte` | ja | Name aus der Namensliste und wie die Karte die Entität dazu findet |

Ein Wert in Kurzform ist eine Liste von Suchregeln, zum Beispiel `"TOP14": ["outdoor_temperature"]`. Die Langform hat dazu Angaben zum Umrechnen: `"TOP1": { "suche": [...], "einheit": "l/h" }`.

## Suchregeln

| Regel | Beispiel | Passt auf |
|---|---|---|
| Schlüssel | `"top14"` | Entitäten der Integration mit diesem internen Schlüssel (translation_key) oder Entity-IDs, die auf `_top14` enden |
| Domain und Schlüssel | `"number:top27"` | wie oben, nur Entitäten dieser Art |
| Muster mit Stern | `"sensor.*boiler_fanspd"` | jede Entity-ID nach diesem Muster, der Stern steht für beliebigen Text |
| genaue Entität | `"sensor.aussen"` | genau diese Entität |

Weitere Regeln:

- Ein Name, eine Entität. Mehrere Regeln sind Alternativen, die Karte setzt keine Werte aus zwei Entitäten zusammen.
- Jeder Name nimmt nur bestimmte Entitätsarten an (Spalte „Entitätsarten“ in der [Namensliste](NAMENSLISTE.de.md)). Passt die Art nicht, wird die Entität nicht eingetragen.
- Passen auf einen Namen eine nur lesbare und eine stellbare Entität, gewinnt die stellbare, damit sich der Wert in der Karte einstellen lässt.
- Gibt es zu einem Namen mehrere Regeln, gilt die erste, die etwas findet. Ein genauer Treffer (interner Schlüssel oder ganze Entity-ID) geht vor einem Treffer über die Endung oder ein Muster.
- Groß- und Kleinschreibung spielt bei Mustern und Endungen keine Rolle.

## Wie gesucht wird

- **Mit `integration`**: Die Karte durchsucht nur die Entitäten dieser Integration. Den Namen siehst du in der Adresszeile, wenn du die Integration unter **Einstellungen → Geräte & Dienste** öffnest: der Teil nach `/integration/`. Findet die Karte dort nichts, sucht sie nur dann wie ohne `integration` weiter, wenn auch `namensteil` gesetzt ist. So treffen allgemeine Schlüssel wie `"outdoor_temperature"` keine fremden Entitäten.
- **Ohne `integration`**: Die Karte durchsucht alle Entitäten. Mit `namensteil` nur die, deren Entity-ID diesen Text enthält. Ohne `namensteil` kann eine Endung auch fremde Entitäten treffen, dann besser genaue Entity-IDs oder Muster verwenden.

## Einheiten und Zustände

- `einheit`: was die Integration liefert, wenn es nicht die Einheit von HeishaMon ist. Finden die Regeln Verschiedenes, stehen die Einheiten als Liste da. Meldet die Entität selbst eine Einheit, gilt diese. Sonst gilt die aus dem Profil, nur für die Entität, die das Profil selbst findet, und nur, wenn das Profil genau eine Einheit nennt (eigene Festlegung).
- `zustaende`: Texte und ihr Wert wie bei HeishaMon, `"*"` steht für alle anderen Texte. Zahlen und Wörter wie an, aus, on und off versteht die Karte auch ohne diese Angabe. Die Karte setzt die Texte nur bei der Entität um, die das Profil selbst findet, auch im Verlauf. Ohne Angabe erkennt sie eine Abtauung auch an „defrost“ oder „abtau“ im Text. Bei EMS-ESP stehen die Wörter für das Abtauen in allen 12 Sprachen von EMS-ESP im Profil.

| Namen | Die Karte rechnet in | Das Profil darf angeben |
|---|---|---|
| TOP62, TOP63, TOP65 (Lüfter, Pumpe) | U/min | U/min oder %. Bei %: 0 % steht, 100 % dreht am schnellsten (wie 900 U/min, eigene Festlegung, nur für die Bewegung). |
| TOP11, TOP90, TOP91 (Betriebsstunden) | h | h, min, s, ms, d |
| TOP1 (Durchfluss) | l/min | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min |
| EXT1, EXT3, EXT4 (Leistung) | W | W, kW, MW |
| EXT2 (Energie) | kWh | Wh, kWh, MWh |
| TOP8 (Verdichter) | Hz | Hz oder %. Die Karte zeigt die gelieferte Einheit. |
| TOP26 und alle Werte mit an und aus | 0 und 1 | Zahlen, an und aus, eigene Texte über `zustaende` |
| TOP20 (3-Wege-Ventil) | 0 Heizung, 1 Warmwasser | Zahlen, an und aus, Texte mit Warmwasser-Wörtern, eigene Texte über `zustaende` |

Eine Einheit, die nicht in der Tabelle steht, meldet der Build als Fehler. Temperaturen erwartet die Karte in °C, den Druck in bar.

## Merkmal heishamon

Mit `"heishamon": true` in einer Variante gilt:

1. Das Hilfefenster mit den Werten und Befehlen von HeishaMon steht zur Verfügung.
2. Ist ein Wert sonst nur lesbar, schickt die Karte den Befehl über MQTT an HeishaMon (zum Beispiel SET16 für die Heizkurve).
3. Haben TOP95, TOP99 und TOP100 keinen Wert, obwohl HeishaMon Daten liefert, zeigt die Karte den Hinweis auf die Gruppe „Installer settings“.
4. Kamin am Solareingang: Ist nur ein Kamin gewählt, gehören TOP47 und OPT5 zum Kamin (EXT300 und EXT301).

Die Panasonic-Serie aus TOP92 richtet sich nach dem Hersteller in `geraete`.

## Eingebaute Profile

Die Suchregeln stammen aus dem Quelltext der jeweiligen Integration, geprüft am Tag in `abgelesen`. An echten Anlagen getestet sind bisher nur HeishaMon by Lutarym und HeishaMon (MQTT), alle anderen sind als „ungetestet“ markiert. Rückmeldungen helfen, sie zu verbessern. Modelle stehen bisher nur bei HeishaMon (aus HeatPumpType.md von HeishaMon) und EMS-ESP (aus device_library.h von EMS-ESP).

| Datei | Hersteller | Variante | Entwickler | Domain | Werte |
|---|---|---|---|---|---|
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| `batavia_heat.json` | Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| `bosch_buderus.json` | Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| `bosch_buderus.json` | Bosch, Buderus | [EMS-ESP (MQTT)](https://github.com/emsesp/EMS-ESP32) | emsesp |  | 41 |
| `daikin.json` | Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| `daikin.json` | Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| `daikin.json` | Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| `daikin.json` | Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| `dewarmte.json` | DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| `heliotherm.json` | Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| `hitachi.json` | Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| `idm.json` | iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| `keba.json` | KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| `kronoterm.json` | Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| `lambda.json` | Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| `nibe.json` | NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 127 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon (MQTT)](https://github.com/heishamon/HeishaMon) |  |  | 105 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| `qube.json` | Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| `remeha.json` | Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| `solarfocus.json` | Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| `thermia.json` | Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| `vaillant.json` | Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| `viessmann.json` | Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| `waterkotte.json` | Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| `weishaupt.json` | Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| `wolf.json` | Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

EMS-ESP braucht keine Integration: Die Firmware legt ihre Entitäten über MQTT Discovery in Home Assistant an. Die Regeln passen zur EMS-ESP-Einstellung „Entity ID format“ mit Kurznamen (eine oder mehrere Instanzen, aktuell oder v3.5), nicht zu „Single instance, long name (v3.4)“.

Ohne Profil, mit Grund:

- `myuplink`: Entitätsnamen kommen dynamisch vom Gerät
- `wolflink`: Entitätsnamen kommen dynamisch vom Gerät
- `ebusd`: Namen hängen von der eigenen ebusd-Konfiguration ab
- `stiebel_eltron`: liefert nur eine Klima-Entität
- `bosch`: Entitätsnamen kommen dynamisch vom Gerät
- `tuya_heat_pump`: Datenpunkte je Gerät verschieden
- `toshiba_modbus`: Raumklimagerät
- `midea_heatpump_hws`: nur Warmwasser-Wärmepumpe
- `dimplex`: liefert keine Wärmepumpenwerte wie Vorlauf, Rücklauf oder Verdichter

## Ein Profil in den Ordner aufnehmen

1. Datei `dist/Profile/<id>.json` anlegen, eine Datei je Hersteller. Gibt es den Hersteller schon, kommt die neue Variante in seine Datei.
2. `npm run build`: Der Build liest alle Dateien im Ordner, prüft sie und schreibt `dist/Profile/liste.json`. Wer ein Profil hinzufügt, legt nur die Datei ab und baut.
3. Der Build prüft `format` und `version`, ob `id` zum Dateinamen passt, die Pflichtangaben, ob alle Kennungen über alle Dateien eindeutig sind, ob jeder Name in der Namensliste steht, ob die Suchregeln nicht leer sind, die Einheiten (Tabelle oben), `zustaende` (nur Zahlen), ob `karte_ab` nicht neuer als die Karte ist und `quelle` mit https-Adresse und Prüfdatum. Bei einem Fehler bricht er ab und nennt die Stelle.

## Profile von GitHub laden

1. Knopf **Profile aktualisieren** im Abschnitt **Integration** neben **Erneut suchen**, im Editor auf **Einfach** und **Erweitert**. Erst auf Knopfdruck fragt die Karte bei GitHub an, nicht bei jedem Öffnen des Dashboards.
2. Die Karte liest `liste.json` aus dem Ordner `dist/Profile` im Zweig main des Repositorys der Karte und vergleicht mit dem, was sie hat: dem Ordner Profile und schon von GitHub geladenen Profilen. Neuer heißt: späteres Prüfdatum (`abgelesen`), spätere Änderung der Integration (`aktualisiert`) oder höhere Version.
3. Alle Varianten, die neu oder neuer sind, lädt die Karte auf einmal und prüft sie wie beim Laden aus dem eigenen Ordner. Nicht geladen werden Varianten, die eine neuere Karte brauchen (`karte_ab`), und fehlerhafte. Ist GitHub dabei nicht erreichbar, speichert die Karte nichts.
4. Die Karte speichert die Varianten wie importierte Profile in der Kartenkonfiguration. Die Auswahl bleibt, danach sucht die Karte neu. Die Profile laufen danach auch ohne Internet. In der Auswahl stehen sie mit dem Zusatz „(von GitHub)“, ein neuer Hersteller unter seinem Namen (eigene Festlegung).
5. Unter den Knöpfen steht, was geladen wurde, zum Beispiel „Profile von GitHub: 1 aktualisiert (Wolf, Wolf ISM8), 1 neu (…). Gespeichert in dieser Karte.“ Gibt es nichts Neues, steht dort „Alle Profile sind aktuell.“
6. Ein eigenes Profil mit derselben Kennung (importiert, „(angepasst)“) bleibt: Die Karte ersetzt es nicht und nennt es in der Meldung (eigene Festlegung). Soll die Fassung von GitHub gelten: erst **Eigenes Profil entfernen**, dann **Profile aktualisieren**.
7. Bringt ein Update über HACS dieselbe oder eine neuere Fassung einer von GitHub geladenen Variante in den Ordner Profile, gilt die aus dem Ordner. Die gespeicherte Kopie gilt dann nicht mehr, beim nächsten **Profile aktualisieren** entfernt die Karte sie auch aus der Konfiguration (eigene Festlegung).
8. Die Karte lädt nur Daten, keinen Programmcode.

## Ein eingebautes Profil anpassen

1. Variante wählen und **Profil exportieren**.
2. In der Datei die gewünschten Werte ändern. Die `id` der Variante bleibt gleich.
3. **Profil importieren**. In der Auswahl steht die Variante jetzt mit dem Zusatz „(angepasst)“.
4. Mit **Eigenes Profil entfernen** gilt wieder die Variante aus dem Ordner Profile.

Gibst du eine neue `id`, entsteht stattdessen ein zusätzliches eigenes Profil unter „Eigene Profile“.

## Wo eigene Profile gespeichert werden

Importierte und von GitHub geladene Profile stehen in der Konfiguration dieser Karte unter `profile_custom`. Sie gelten nur für diese Karte. Mit **Als Datei speichern** im Abschnitt Import, Export und Anpassungen wird das Profil mitgespeichert, und mit **Aus Datei laden** in einer anderen Karte kommt es dort wieder an. Alternativ importierst du die Profildatei in jeder Karte einzeln.

## Ältere Profildateien

Profildateien im Format 1 (bis 5.33.8, mit `felder` und den früheren Feldnamen) liest der Import weiter. Die Karte übersetzt die Feldnamen nach der [Namensliste](NAMENSLISTE.de.md). Ein Profil für HeishaMon behält das Merkmal heishamon (eigene Festlegung: Integration `heishamon_lutarym`, Namensteil oder Kennung mit `heishamon`). Der Export liefert immer Format 2.

## Was ein Profil nicht ändert

- Die Hilfe („?“) erklärt die Werte von HeishaMon. Sie erscheint nur bei Varianten mit dem Merkmal heishamon und im Demomodus.
- Die Jahresarbeitszahl hinter der Tür rechnet mit den Leistungswerten von HeishaMon (TOP15, TOP16, TOP40, TOP41 oder XTOP0, XTOP2, XTOP3, XTOP5). Liefert ein Profil sie nicht, bleibt sie leer.

## Meldungen beim Import

| Meldung | Ursache |
|---|---|
| Das ist kein gültiges JSON. Bitte den exportierten Text einfügen. | Die Datei ist kein JSON, oft fehlt ein Komma oder eine Klammer |
| Das ist keine Geräteprofil-Datei (format muss „lutarym-geraeteprofil“ sein). | `format` fehlt oder ist falsch |
| Diese Profilversion wird nicht unterstützt (erwartet: version 2 oder 1). | `version` ist nicht `2` oder `1` |
| Die Kennung (id) fehlt oder ist ungültig: 2 bis 40 Zeichen, nur a bis z, 0 bis 9, _ und -. | `id` verletzt die Regeln oben |
| Das Profil beschreibt keinen bekannten Wert (werte). | `werte` (Format 1: `felder`) fehlt oder enthält nur unbekannte Namen |
| unbekannte Namen ignoriert: … | Diese Namen gibt es in der Namensliste nicht, die übrigen wurden übernommen |
| Dieses Profil braucht die Karte ab Version x.y.z. Bitte zuerst die Karte aktualisieren. | `karte_ab` ist neuer als die Karte |
