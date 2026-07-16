# Andreas Boehler Portfolio

Statische Portfolio-Website fuer Andreas Boehler mit kuratierten Film-, Foto-, Art-Direction- und Markenprojekten.

Die Seite ist bewusst ohne Build-System aufgebaut: HTML, CSS, JavaScript und Assets liegen direkt im Repository und koennen lokal oder ueber GitHub Pages / einen statischen Webhost ausgeliefert werden.

Aktuelle dokumentierte Version: `0.5.8`

## Inhalt

- Startseite mit persoenlicher Positionierung, Hero-Sequenz und ausgewaehlten Arbeiten
- Works-Uebersicht mit Projektseiten, Bildmaterial und Video-Einbindungen
- Still-Photography-Seite mit kuratierter Fotoauswahl
- Service-Seiten fuer Filmproduktion, Markenfotografie, DoP, Art Direction und Creative Technology
- Lokale SEO-Landingpages fuer Filmproduktion und Hochzeitsfotografie in Freiburg, Offenburg und Basel
- About-, Contact-, FAQ-, Impressum-, Datenschutz- und AGB-Seiten
- SEO-Grundlagen mit `robots.txt`, `sitemap.xml` und `llms.txt`

## Lokal starten

Im Projektordner einen einfachen Static-Server starten:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:4173/
```

Falls mehrere Python-Versionen installiert sind, kann alternativ `py` genutzt werden:

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

## Projektstruktur

```text
.
|-- index.html                 # Startseite
|-- works.html                 # Projektuebersicht
|-- photography.html           # Still Photography
|-- services.html              # Service-Uebersicht
|-- about.html                 # Profil / Vita
|-- contact.html               # Kontakt
|-- script.js                  # Interaktionen, Projektdaten, Animationen
|-- styles.css                 # Layout, Typografie, responsive Design
|-- assets/                    # Bilder, Video-Stills, PDF- und Projektassets
|-- CHANGELOG.md               # Versionierte Aenderungshistorie
|-- VERSION                    # Aktuelle Release-Version
|-- sitemap.xml                # Suchmaschinen-Sitemap
|-- robots.txt                 # Crawling-Hinweise
|-- llms.txt                   # Kurzer maschinenlesbarer Projektkontext
```

## Pflegehinweise

- Neue Projektseiten sollten in `works.html`, `sitemap.xml` und den relevanten internen Linklisten beruecksichtigt werden.
- Bildassets liegen unter `assets/` und sollten fuer Web-Nutzung komprimiert sein.
- Nach Aenderungen an `styles.css` oder `script.js` den Cache-Buster in den HTML-Dateien anpassen, damit Browser sofort die neue Version laden.
- Externe Videos werden projektbezogen eingebunden und sollten vor Veroeffentlichung auf Erreichbarkeit geprueft werden.
- Vor groesseren visuellen Aenderungen lokal mit `http://127.0.0.1:4173/` testen.

## Staging

Der Teststand liegt unter:

```text
https://andreasboehlerstudio.github.io/andreasboehler-portfolio/staging/
```

- `main` wird als Produktionsseite im Root-Verzeichnis ausgeliefert.
- `staging` wird automatisch unter `/staging/` aktualisiert.
- Staging-Seiten erhalten beim Deploy automatisch `noindex`, eine sperrende `robots.txt` und einen sichtbaren `STAGING` Hinweis.
- Ein Push auf `staging` veraendert den Produktionsstand aus `main` nicht.
- Nach Freigabe werden die getesteten Aenderungen nach `main` uebernommen und dort als Release versioniert.

Typischer Ablauf:

```powershell
git switch staging
git pull origin staging
# Aenderungen testen und committen
git push origin staging
```

## FTP Production Deploy

Der manuelle Workflow `.github/workflows/ftp-production.yml` verwendet das GitHub-Environment `production`.

- Zugangsdaten kommen ausschliesslich aus den Environment-Secrets.
- Das Ziel ist ueber `FTP_TARGET_DIR=andreasboehlerportfolio/` festgelegt.
- Der Workflow akzeptiert nur `ftp`, `ftps` oder `ftps-legacy`.
- Vor einem echten Upload wird der Workflow mit `dry_run=true` getestet.
- Nach dem Website-Upload wird die Root-`.htaccess` aktualisiert. Sie liefert die Live-Version intern aus `andreasboehlerportfolio/` aus, waehrend die oeffentlichen URLs unter der Hauptdomain bleiben.
- `dangerous-clean-slate` bleibt deaktiviert.
- Repository-Metadaten, Workflows und Release-Dokumente werden nicht hochgeladen.

## Versionierung und Changelog

Ab jetzt wird jeder Push versioniert und im Changelog dokumentiert.

Vor jedem Push:

1. `VERSION` auf die neue Version setzen.
2. `CHANGELOG.md` aktualisieren.
3. Cache-Buster in HTML-Dateien anpassen, falls `styles.css` oder `script.js` geaendert wurden.
4. Lokal kurz pruefen.
5. Commit erstellen und pushen.

Versionsschema:

- `PATCH` fuer kleine Fixes, z. B. Text, Link, Hover- oder Layout-Korrektur
- `MINOR` fuer neue Inhalte, neue Seiten, neue Sections oder sichtbar groessere UI-Erweiterungen
- `MAJOR` fuer grundlegende Struktur-, Navigations- oder Deployment-Aenderungen

Beispiel:

```text
0.5.1  kleiner Fix
0.6.0  neue Inhalte oder neue Section
1.0.0  erster stabiler Launch-Stand
```

## Changelog

### [0.5.8] - 2026-07-16

#### Added

- Der Production-Workflow unterstuetzt jetzt auch SFTP mit einem nicht schreibenden `lftp`-Dry-Run und einem anschliessenden Upload ohne Loesch-Synchronisation.

### [0.5.7] - 2026-07-16

#### Fixed

- Der Production-Workflow erkennt auch beschreibende FTP-/FTPS-Protokollwerte und deployt die Live-`.htaccess` eindeutig in das FTP-Wurzelverzeichnis neben `andreasboehlerportfolio/`.

### [0.5.6] - 2026-07-16

#### Fixed

- `FTP_PROTOCOL` wird vor dem Deploy normalisiert, sodass Grossschreibung, Leerzeichen und Werte mit `://` den sicheren Dry-Run nicht mehr unnoetig blockieren.
- Der korrigierte Produktionsordner lautet `andreasboehlerportfolio/`; eine kontrolliert deployte Root-`.htaccess` schaltet die Hauptdomain auf diese Live-Version um.

### [0.5.5] - 2026-07-15

#### Added

- Manuellen Production-Workflow fuer FTP/FTPS-Deployments ueber das geschuetzte GitHub-Environment `production` hinzugefuegt.
- Zielordner `andreasboehlerpotfolio/` als Environment-Variable mit festem Sicherheitscheck eingerichtet.
- Dry-Run, Protokollvalidierung, strikte Zertifikatspruefung und FTP-Sync ohne Clean-Slate-Loeschung integriert.

### [0.5.4] - 2026-07-15

#### Fixed

- Staging-Pushes starten den erlaubten Pages-Deploy jetzt per `workflow_dispatch` auf `main`, statt an der Branch-Freigabe der GitHub-Pages-Umgebung zu scheitern.
- Der kombinierte Deploy liest weiterhin Produktion aus `main` und den Teststand aus `staging`.

### [0.5.3] - 2026-07-15

#### Added

- Eigene `staging` Branch mit automatischem Test-Deploy unter `/staging/` eingerichtet.
- Staging-Ausgabe wird automatisch mit `noindex`, eigener `robots.txt` und sichtbarer Umgebungsmarkierung versehen.

#### Changed

- GitHub-Pages-Workflow baut Produktion aus `main` und Staging aus `staging` in einem gemeinsamen, getrennten Deployment-Artefakt.
- Release-Dokumentation um den Staging- und Freigabeablauf erweitert.

### [0.5.2] - 2026-07-15

#### Added

- Scrollgesteuerte, mehrteilige Video-Sequenz im Startseiten-Hero mit den Kapiteln Design, Impact und bewegte Marken.
- Lokale Landingpages fuer Filmproduktion in Freiburg, Offenburg und Basel.
- Umfangreiche Hochzeitsfotografie-Onepage fuer Freiburg, Basel und Offenburg mit Reportagen, Paketen, Regionen, FAQs und eigenem Anfrageformular.
- Neue hochaufgeloeste Projektbilder, Portrait-Assets, Video-Poster und weboptimierte Scrollvideos.

#### Changed

- Portfolio konsequent auf Andreas Boehler als Person statt auf eine Studio-Marke ausgerichtet.
- Startseite, Works, About, Kontakt, Services und Projektseiten mit mehr Weissraum, klarerer Typografie, staerkeren Visuals und responsiven Animationen ueberarbeitet.
- About-Hero als interaktives Portrait mit Brush-Reveal und klarerer Textstaffelung umgesetzt.
- Globale Navigation, Footer, interne Verlinkung, strukturierte Daten, Sitemap und lokale SEO-Signale aktualisiert.
- Unscharfe Projektbilder durch hoeher aufgeloeste Assets ersetzt und Fotoauswahl neu kuratiert.

#### Fixed

- Typografie-Clipping bei grossen Headlines, Umlauten und Prozessbegriffen auf Desktop, Tablet und Mobile behoben.
- Scrollen im Startseiten-Hero, Video-Scrubbing, Menue-Animation und responsive Menue-Anordnung stabilisiert.
- Fehlende und falsch zugeordnete Projektbilder korrigiert.

### [0.5.1] - 2026-07-03

#### Added

- Changelog direkt in die GitHub-README aufgenommen, damit die wichtigsten Aenderungen sofort auf der Repository-Startseite sichtbar sind.

#### Changed

- Version von `0.5.0` auf `0.5.1` angehoben.
- Separates `CHANGELOG.md` bleibt als vollstaendige Aenderungshistorie erhalten.

### [0.5.0] - 2026-07-03

#### Added

- README um Projektstruktur, Pflegehinweise, Versionierung und Push-Workflow erweitert.
- Changelog-Workflow eingefuehrt.
- `VERSION` Datei als aktuelle Release-Referenz ergaenzt.
- Startseite mit neuem `Our services` Bereich als grosse Service-Liste mit Bildwechsel erweitert.
- Webdesign-Freiburg-Seite und zusaetzliche Portfolio-Inhalte vorbereitet.

#### Changed

- Startseiten-Hero neu ausbalanciert: Claim groesser gesetzt und Studio-Wortmark im Hero ausgeblendet.
- Menue-Animation stabilisiert: Slide-Verhalten, Close-Button-Position und Desktop-Breakpoints ueberarbeitet.
- Menuewort-Hover wie in der Referenz umgesetzt: echte Menuewoerter bleiben im DOM, Hover-Text laeuft ueber `data-text` und CSS-Pseudo-Elemente.
- Cache-Buster fuer CSS und JavaScript auf die aktuellen UI-Aenderungen aktualisiert.

#### Fixed

- Menuepunkte verschwinden auf grossen Bildschirmen nicht mehr.
- Mittlere Menue-Breiten erzeugen keine kaputte 3+2-Anordnung mehr.
- Umlaute und Sonderzeichen bleiben in HTML-Dateien korrekt gespeichert.
- Hero- und Service-Typografie schneiden weniger ab und ueberlagern sich nicht mehr.

## Deployment

Das Repository kann direkt als statische Website deployed werden. Fuer GitHub Pages ist die Datei `.nojekyll` enthalten, damit Assets und HTML-Dateien unveraendert ausgeliefert werden.

Deployment laeuft ueber `.github/workflows/pages.yml` bei jedem Push auf `main`.
