# Changelog

Alle wichtigen Aenderungen an diesem Portfolio werden in dieser Datei dokumentiert.

Format: orientiert an Keep a Changelog. Versionierung: SemVer (`MAJOR.MINOR.PATCH`).

## [Unreleased]

- Noch keine nicht versionierten Aenderungen.

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
