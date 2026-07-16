# Changelog

Alle wichtigen Aenderungen an diesem Portfolio werden in dieser Datei dokumentiert.

Format: orientiert an Keep a Changelog. Versionierung: SemVer (`MAJOR.MINOR.PATCH`).

## [Unreleased]

- Noch keine nicht versionierten Aenderungen.

## [0.5.10] - 2026-07-16

### Fixed

- SFTP-Uploads werden bei hosterseitigen Verbindungsabbruechen fortgesetzt und automatisch wiederholt. Die Root-`.htaccess` wird erst in einem separaten Schritt nach einem vollstaendigen Website-Upload gesetzt.

## [0.5.9] - 2026-07-16

### Fixed

- Die FTP-/SFTP-Serveradresse wird vor dem Verbindungsaufbau normalisiert, damit Environment-Werte mit Protokollpraefix oder abschliessendem Pfad korrekt funktionieren.

## [0.5.8] - 2026-07-16

### Added

- Der Production-Workflow unterstuetzt jetzt auch SFTP mit einem nicht schreibenden `lftp`-Dry-Run und einem anschliessenden Upload ohne Loesch-Synchronisation.

## [0.5.7] - 2026-07-16

### Fixed

- Der Production-Workflow erkennt auch beschreibende FTP-/FTPS-Protokollwerte und deployt die Live-`.htaccess` eindeutig in das FTP-Wurzelverzeichnis neben `andreasboehlerportfolio/`.

## [0.5.6] - 2026-07-16

### Fixed

- `FTP_PROTOCOL` wird vor dem Deploy normalisiert, sodass Grossschreibung, Leerzeichen und Werte mit `://` den sicheren Dry-Run nicht mehr unnoetig blockieren.
- Der korrigierte Produktionsordner lautet `andreasboehlerportfolio/`; eine kontrolliert deployte Root-`.htaccess` schaltet die Hauptdomain auf diese Live-Version um.

## [0.5.5] - 2026-07-15

### Added

- Manuellen Production-Workflow fuer FTP/FTPS-Deployments ueber das geschuetzte GitHub-Environment `production` hinzugefuegt.
- Zielordner `andreasboehlerpotfolio/` als Environment-Variable mit festem Sicherheitscheck eingerichtet.
- Dry-Run, Protokollvalidierung, strikte Zertifikatspruefung und FTP-Sync ohne Clean-Slate-Loeschung integriert.

## [0.5.4] - 2026-07-15

### Fixed

- Staging-Pushes starten den erlaubten Pages-Deploy jetzt per `workflow_dispatch` auf `main`, statt an der Branch-Freigabe der GitHub-Pages-Umgebung zu scheitern.
- Der kombinierte Deploy liest weiterhin Produktion aus `main` und den Teststand aus `staging`.

## [0.5.3] - 2026-07-15

### Added

- Eigene `staging` Branch mit automatischem Test-Deploy unter `/staging/` eingerichtet.
- Staging-Ausgabe wird automatisch mit `noindex`, eigener `robots.txt` und sichtbarer Umgebungsmarkierung versehen.

### Changed

- GitHub-Pages-Workflow baut Produktion aus `main` und Staging aus `staging` in einem gemeinsamen, getrennten Deployment-Artefakt.
- Release-Dokumentation um den Staging- und Freigabeablauf erweitert.

## [0.5.2] - 2026-07-15

### Added

- Scrollgesteuerte, mehrteilige Video-Sequenz im Startseiten-Hero mit den Kapiteln Design, Impact und bewegte Marken.
- Lokale Landingpages fuer Filmproduktion in Freiburg, Offenburg und Basel.
- Umfangreiche Hochzeitsfotografie-Onepage fuer Freiburg, Basel und Offenburg mit Reportagen, Paketen, Regionen, FAQs und eigenem Anfrageformular.
- Neue hochaufgeloeste Projektbilder, Portrait-Assets, Video-Poster und weboptimierte Scrollvideos.

### Changed

- Portfolio konsequent auf Andreas Boehler als Person statt auf eine Studio-Marke ausgerichtet.
- Startseite, Works, About, Kontakt, Services und Projektseiten mit mehr Weissraum, klarerer Typografie, staerkeren Visuals und responsiven Animationen ueberarbeitet.
- About-Hero als interaktives Portrait mit Brush-Reveal und klarerer Textstaffelung umgesetzt.
- Globale Navigation, Footer, interne Verlinkung, strukturierte Daten, Sitemap und lokale SEO-Signale aktualisiert.
- Unscharfe Projektbilder durch hoeher aufgeloeste Assets ersetzt und Fotoauswahl neu kuratiert.

### Fixed

- Typografie-Clipping bei grossen Headlines, Umlauten und Prozessbegriffen auf Desktop, Tablet und Mobile behoben.
- Scrollen im Startseiten-Hero, Video-Scrubbing, Menue-Animation und responsive Menue-Anordnung stabilisiert.
- Fehlende und falsch zugeordnete Projektbilder korrigiert.

## [0.5.1] - 2026-07-03

### Added

- Changelog direkt in die GitHub-README aufgenommen, damit die wichtigsten Aenderungen sofort auf der Repository-Startseite sichtbar sind.

### Changed

- Version von `0.5.0` auf `0.5.1` angehoben.
- `README.md`, `CHANGELOG.md` und `VERSION` bleiben fuer kuenftige Pushes synchron.

## [0.5.0] - 2026-07-03

### Added

- README um Projektstruktur, Pflegehinweise, Versionierung und Push-Workflow erweitert.
- Changelog-Workflow eingefuehrt.
- `VERSION` Datei als aktuelle Release-Referenz ergaenzt.
- Startseite mit neuem `Our services` Bereich als grosse Service-Liste mit Bildwechsel erweitert.
- Webdesign-Freiburg-Seite und zusaetzliche Portfolio-Inhalte vorbereitet.

### Changed

- Startseiten-Hero neu ausbalanciert: Claim groesser gesetzt und Studio-Wortmark im Hero ausgeblendet.
- Menue-Animation stabilisiert: Slide-Verhalten, Close-Button-Position und Desktop-Breakpoints ueberarbeitet.
- Menuewort-Hover wie in der Referenz umgesetzt: echte Menuewoerter bleiben im DOM, Hover-Text laeuft ueber `data-text` und CSS-Pseudo-Elemente.
- Cache-Buster fuer CSS und JavaScript auf die aktuellen UI-Aenderungen aktualisiert.

### Fixed

- Menuepunkte verschwinden auf grossen Bildschirmen nicht mehr.
- Mittlere Menue-Breiten erzeugen keine kaputte 3+2-Anordnung mehr.
- Umlaute und Sonderzeichen bleiben in HTML-Dateien korrekt gespeichert.
- Hero- und Service-Typografie schneiden weniger ab und ueberlagern sich nicht mehr.

### Notes

- Aktueller akzeptierter Menue-Stand: `styles.css?v=20260629-menu-hover1` und `script.js?v=20260629-menu-hover1`.
