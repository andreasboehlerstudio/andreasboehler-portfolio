# Andreas Boehler Studio Portfolio

Statische Portfolio-Website fuer Andreas Boehler Studio mit kuratierten Film-, Foto-, Art-Direction- und Markenprojekten.

Die Seite ist bewusst ohne Build-System aufgebaut: HTML, CSS, JavaScript und Assets liegen direkt im Repository und koennen lokal oder ueber GitHub Pages / einen statischen Webhost ausgeliefert werden.

## Inhalt

- Startseite mit Studio-Positionierung und ausgewaehlten Arbeiten
- Works-Uebersicht mit Projektseiten, Bildmaterial und Video-Einbindungen
- Still-Photography-Seite mit kuratierter Fotoauswahl
- Service-Seiten fuer Filmproduktion, Markenfotografie, DoP und Art Direction
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
|-- about.html                 # Studio / Vita
|-- contact.html               # Kontakt
|-- script.js                  # Interaktionen, Projektdaten, Animationen
|-- styles.css                 # Layout, Typografie, responsive Design
|-- assets/                    # Bilder, Video-Stills, PDF- und Projektassets
|-- sitemap.xml                # Suchmaschinen-Sitemap
|-- robots.txt                 # Crawling-Hinweise
|-- llms.txt                   # Kurzer maschinenlesbarer Projektkontext
```

## Pflegehinweise

- Neue Projektseiten sollten in `works.html`, `sitemap.xml` und den relevanten internen Linklisten beruecksichtigt werden.
- Bildassets liegen unter `assets/` und sollten fuer Web-Nutzung komprimiert sein.
- Nach Aenderungen an `styles.css` oder `script.js` den Cache-Buster in den HTML-Dateien anpassen, damit Browser sofort die neue Version laden.
- Externe Videos werden projektbezogen eingebunden und sollten vor Veroeffentlichung auf Erreichbarkeit geprueft werden.

## Deployment

Das Repository kann direkt als statische Website deployed werden. Fuer GitHub Pages ist die Datei `.nojekyll` enthalten, damit Assets und HTML-Dateien unveraendert ausgeliefert werden.
