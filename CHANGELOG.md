# Changelog

Alle wichtigen Aenderungen an diesem Portfolio werden in dieser Datei dokumentiert.

Format: orientiert an Keep a Changelog. Versionierung: SemVer (`MAJOR.MINOR.PATCH`).

## [Unreleased]

- Noch keine nicht versionierten Aenderungen.

## [0.5.37] - 2026-08-07

### Fixed

- Fest gespeicherte WordPress-Links und Medien-URLs werden im gerenderten Archiv konsequent auf `archiv.andreasboehler.com` umgeschrieben.
- Das historische SEO-Plugin erhaelt fuer das Archiv explizite `noindex`, `nofollow` und `noarchive`-Direktiven, damit Meta-Tag und HTTP-Header uebereinstimmen.

## [0.5.36] - 2026-08-07

### Added

- Die fruehere WordPress-Installation bleibt voruebergehend unter `archiv.andreasboehler.com` erreichbar.
- Das Archiv erhaelt serverseitig `X-Robots-Tag: noindex, nofollow, noarchive`, damit es nicht mit der neuen Website konkurriert.
- Ein hostabhaengiges WordPress-MU-Plugin haelt generierte Links, Weiterleitungen und Medien-URLs innerhalb der Archiv-Subdomain.

### Changed

- Die Root-Weiterleitung unterscheidet nun klar zwischen Hauptdomain, Staging und dem hostbasierten WordPress-Archiv.

## [0.5.35] - 2026-08-06

### Added

- Die Startseite enthaelt die dauerhafte Google-Search-Console-Verifizierung fuer die Hauptdomain.

## [0.5.34] - 2026-07-25

### Changed

- Die sichtbare Sprache wurde auf Andreas Boehler als persoenliche Kreativmarke ausgerichtet: `Our services` und weitere UI-Begriffe heissen nun einheitlich `Leistungen`.
- Texte mit kollektiver Studio-Stimme wurden auf eine persoenliche Ich-Perspektive umgestellt; Personenbezeichnungen sind, wo sinnvoll, neutral formuliert.
- Die einzelnen Leistungsnamen auf Start- und Leistungsseite sind ruhiger skaliert und auf mittleren sowie mobilen Viewports klar abgestuft.
- Der Menuepunkt `Leistungen` bleibt auch auf mittleren Viewports vollstaendig lesbar.
- Mehrere abgebrochene oder unpassende importierte Projektbeschreibungen wurden redaktionell bereinigt; der Jeep-Case beschreibt nun wieder die richtige Fotostrecke.

## [0.5.33] - 2026-07-25

### Added

- Drei redaktionelle SEO-Ratgeber zu Film- und Fotolocations in Freiburg, Hochzeitslocations in Freiburg, Basel und Offenburg sowie den Kosten eines Markenfilms.
- Neue interne Verlinkungen und Sitemap-Eintraege erschliessen die Ratgeber fuer Besucher und Suchmaschinen.

### Changed

- Projekt- und Hochzeitsformulare senden ausschliesslich an die neue serverseitige Kontaktadresse; direkte E-Mail-Links wurden durch geschuetzte Formulare, Telefon-CTAs oder eine erst nach Interaktion erzeugte Anzeige ersetzt.
- Die Kontaktadresse wird serverseitig aus getrennten Bestandteilen aufgebaut und steht weder im oeffentlichen HTML noch als vollstaendige Zeichenfolge im Repository.
- Datenschutz, Impressum, FAQ und maschinenlesbare Kontaktangaben wurden an die geschuetzten Kontaktwege angepasst.

### Security

- Ein zweites Honeypot-Feld, Mindest-Ausfuellzeit, Herkunftspruefung, Linklimits, Duplikaterkennung und ein separates Versuchslimit erschweren automatisierten Formularspam.
- Zeitlich begrenzte, gehashte Anfragemerkmale schuetzen die Formulare, ohne Klartext-IP-Adressen in der Lead-Datenbank zu speichern.

## [0.5.32] - 2026-07-24

### Added

- Formularanfragen werden zusaetzlich zum E-Mail-Versand in einer geschuetzten SQLite-Lead-Datenbank gespeichert.
- Der interne, nicht indexierbare Bereich `/intern/anfragen.php` bietet Suche, Filter, Status, interne Notizen und CSV-Export.
- Serverseitiges Rate-Limiting, gehashte IP-Merkmale und eine automatische Loeschung nicht beauftragter Anfragen nach spaetestens zwoelf Monaten begrenzen Missbrauch und Datenspeicherung.
- Der Produktions-Workflow prueft alle PHP-Dateien vor dem FTP-Upload auf Syntaxfehler.

### Changed

- Alle direkten Kontaktlinks und Formularziele verwenden eine einheitliche serverseitige Empfängeradresse.
- Die Datenschutzerklaerung dokumentiert Formularversand, lokale Lead-Datenbank, Zugriffsschutz, Speicherdauer und Betroffenenrechte genauer.
- Die AGB regeln Dienst- und Werkleistungen, Abschlagszahlungen, Ausfallkosten, Zahlungsverzug, Nutzungsrechte, Buyouts sowie KI-gestuetzte Retusche und Generierung ausfuehrlicher.
- Groessere Produktionen werden standardmaessig mit 50 Prozent bei Beauftragung und 50 Prozent bei Fertigstellung beziehungsweise Abnahme abgerechnet, sofern das Angebot nichts anderes vorsieht.
- Der DJ-BoBo-Tourtrailer verwendet ein hochwertiges Filmstill als Teasermotiv.
- Der sichtbare Hinweis zum Laden externer Player wurde entfernt; die technische Einwilligungslogik bleibt bestehen.

## [0.5.31] - 2026-07-24

### Fixed

- Der Voltron-Nevera-Case zeigt nur noch den verifizierten offiziellen Europa-Park-TV-Spot.
- Ein falsch zugeordnetes Vimeo-Video aus dem MSD-Lung-Cancer-Projekt wurde aus dem Voltron-Case entfernt.
- Hero-, Projektdaten und strukturiertes Hauptbild verwenden konsistent das Voltron-Nevera-Motiv.

## [0.5.30] - 2026-07-24

### Changed

- Der DJ-BoBo-Case ist in Titel, Teaser, Projekttext, Videoverknuepfung und strukturierten Daten eindeutig als `The Great Adventure Tourtrailer` eingeordnet.
- Startseite und Works verwenden das offizielle Titelmotiv des Tourtrailers statt des bisherigen EVOLUT30N-Livebilds.
- Der erklaerende Satz `Arbeiten, die Haltung und Handwerk verbinden.` wurde aus dem Featured-Work-Bereich entfernt.
- Der mobile Verlauf des DJ-BoBo-Heros beginnt tiefer, damit der mehrzeilige Projekttitel lesbar vor dem Motiv bleibt.

## [0.5.29] - 2026-07-23

### Added

- Projekt- und Hochzeitsanfragen werden ueber einen gemeinsamen serverseitigen PHP-Endpunkt an Andreas Boehler versendet.
- Neue responsive Danke-Seite fuer erfolgreich uebermittelte Anfragen mit `noindex`-Anweisung.
- Erfolgreiche Formularanfragen senden nach Statistik-Einwilligung das empfohlene GA4-Ereignis `generate_lead`.
- Honeypot-, Zeit-, Herkunfts- und serverseitige Pflichtfeldpruefungen schuetzen beide Formulare vor automatisiertem Missbrauch.

### Changed

- Formularbuttons und Statusmeldungen zeigen den tatsaechlichen Versand-, Erfolgs- und Fehlerzustand statt nur eine vorbereitete `mailto:`-E-Mail.
- Die Datenschutzerklaerung beschreibt den serverseitigen Formularversand, die Weiterleitung per E-Mail und die eingesetzten Spam-Pruefungen.
- Seitentitel und Social-Metadaten der Kontaktseite positionieren Andreas konsistent als Videograf und Fotograf in Freiburg, Basel und Offenburg.

## [0.5.28] - 2026-07-23

### Fixed

- Die nicht mehr freigegebene direkte Phantom-Projekt-URL wird auch dann mit HTTP 404 blockiert, wenn auf dem Hosting noch eine alte physische HTML-Datei vorhanden ist.

## [0.5.27] - 2026-07-23

### Fixed

- Der Production-Workflow wiederholt den Website-Sync automatisch, wenn der FTP-Server einen temporaeren Upload beim abschliessenden Rename mit Fehler 550 abbricht.
- Die Live-Umschaltung erfolgt erst, wenn entweder der erste Upload oder der automatische Wiederholungsversuch erfolgreich abgeschlossen wurde.

## [0.5.26] - 2026-07-23

### Added

- Neue TNW-Website-Case-Study mit Webdesign-Beitrag, lokal optimiertem Filmcontent, Fotostrecke, Making-of-Auswahl und dem offiziellen Drohnenfilm mit Bahn in Basel.
- Regionale Landingpages positionieren Andreas als Videograf und Filmemacher in Freiburg, Offenburg und Basel.
- MedPortal ist wieder fuer den kuratierten Live-Build freigegeben.

### Changed

- Der sichtbare Startseiten-Hero verwendet wieder die Markenbotschaft "Filmische Markenwelten". Der technische Seitentitel beginnt SEO-fokussiert mit "Videograf Freiburg", waehrend die konkrete Expertise im Hero und in den strukturierten Daten erhalten bleibt.
- Die Live-Auswahl umfasst sechs freigegebene Arbeiten: DJ BoBo, 50 Jahre Europa-Park, TNW Website, Novartis MedPortal, Voltron Nevera und Still Photography. Die Startseite bleibt mit fuenf Arbeiten bewusst kompakt.
- Das 50-Jahre-Europa-Park-Projekt verwendet ein klareres Jubilaeums-Keyvisual mit goldenem 50-Jahre-Logo, Feuerwerk und Nachtkulisse.
- Die Positionierung wurde von einer allgemeinen Filmproduktion auf Andreas als Videograf, Filmemacher, DoP, Fotograf und Creative Producer geschaerft.

### Fixed

- Hero-Header, grosse Typografie, regionale SEO-Bereiche, Projektseiten und Navigation wurden auf Mobile und Tablet gegen Clipping und horizontales Ueberlaufen abgesichert.
- Alte Filmproduktions-URLs werden auf die entsprechenden neuen Videograf-Landingpages weitergeleitet.

## [0.5.25] - 2026-07-23

### Added

- Die Startseite zeigt mit "Still Photography" nun eine fuenfte ausgewaehlte Arbeit und erweitert die filmischen Cases um Andreas' fotografische Handschrift.

### Changed

- Der Startseiten-Hero beginnt wieder mit der frueheren Kameraszene inklusive Filmset im Kameradisplay und blendet innerhalb desselben scrollgesteuerten Hero-Headers weich in den aktuellen Markenfilm ueber.
- Der Home-Hero richtet "Filmische Markenwelten", "Momente" und "Storytelling" auf einem konsistenten zentrierten Raster aus. "Story" wurde zu "Storytelling" erweitert und fuer kleine Displays separat skaliert.
- KI-Kennzeichnungen werden global als sehr kleine, dezente Hinweise dargestellt, bleiben aber weiterhin direkt am jeweiligen Medium sichtbar.

### Fixed

- Die Hochzeits-Herozeile "Euer Tag vergeht. Das Gefuehl bleibt." besitzt mehr Zeilenraum und bleibt auf kleinen Displays in den vorgesehenen zwei Zeilen, ohne kollidierende Unterlaengen.

## [0.5.24] - 2026-07-22

### Added

- Google Analytics 4 mit der Measurement-ID `G-H7564XZ7BB` ist auf allen Seiten consent-gesteuert eingebunden. Der Datenschutzdialog uebermittelt den Analytics-Status ueber Consent Mode v2; ohne Zustimmung werden keine Analytics-Skripte geladen.
- Die Hochzeitsfotografie-Seite besitzt eine neue durchgaengige Scroll-Filmsequenz mit drei zeitlich abgestimmten Aussagen zwischen Kamerablick, Trauung und fertiger Erinnerung.

### Changed

- Der Startseiten-Hero verwendet einen zusammenhaengenden 17-Sekunden-Film. Die Textkapitel wurden passend zum Schnitt auf "Momente", "Story" und "Ich gestalte bewegte Marken" ausgerichtet.
- Home- und Wedding-Hero trennen ihre scrollgesteuerten Texte von der allgemeinen Reveal-Maske. Zusaetzlicher Zeilenraum und responsive Schriftgroessen verhindern abgeschnittene Headlines.
- Die beiden neuen Hero-Videos wurden fuer Web-Scrubbing auf 720p, H.264, stumme Wiedergabe, Faststart und dichte Keyframes optimiert. Die finale Datenmenge liegt bei rund 6 MB fuer Home und 8 MB fuer Wedding.

## [0.5.23] - 2026-07-17

### Changed

- Der Contact-Hero verdeckt sein Statement nun vollstaendig unter einer Canvas-Ebene. Mausbewegungen radieren diese Ebene mit einer weichen, zusammenhaengenden und bleibenden Pinselspur aus; "Let's talk" bleibt dabei als Vordergrundebene erhalten.
- Touchgeraete und Nutzer mit reduzierter Bewegung erhalten weiterhin eine statische, gut lesbare Textvariante.

## [0.5.22] - 2026-07-16

### Added

- Das Statement im Contact-Hero besitzt nun einen weichen Mouse-Reveal: Eine klare Textkopie wird innerhalb einer nachlaufenden radialen Maske sichtbar. Touch und Reduced Motion erhalten eine statische, gut lesbare Variante.

## [0.5.21] - 2026-07-16

### Changed

- Die Services-Seite verwendet wieder das vorherige ruhige Zeilenlayout statt des asymmetrischen Kachelrasters. Photography-Raster und Contact-Hero bleiben unveraendert.

## [0.5.20] - 2026-07-16

### Changed

- Die Photography-Seite nutzt ein dichteres, randnahes Editorial-Raster mit vier Spalten auf grossen Screens, zwei Spalten auf mittleren Viewports und einer Spalte auf Mobile. Alle Motive bleiben gleich gross und filmisch im Querformat.
- Die Service-Bereiche sind als monochromes Kachelraster mit wechselnden Breiten, klarer Hierarchie und reduzierten Hover-Bewegungen angeordnet.
- Der Contact-Hero verbindet das grosse "Let's talk" mit dem Statement "Gute Bilder beginnen nicht mit der Kamera. Sie beginnen mit einer klaren Idee."

## [0.5.19] - 2026-07-16

### Changed

- Die vier freigegebenen Film-Cases wurden als ruhiges, zusammenhaengendes Detailseiten-System neu gewichtet: grosse 16:9-Player direkt nach dem Hero, mehr Weissraum, kleinere Informationstypografie und reduzierte Faktenzeilen statt lauter Karten.
- Die Photography-Seite zeigt alle kuratierten Motive nun in gleich grossen filmischen 16:9-Frames: zweispaltig auf Desktop und einspaltig auf Mobile.

### Fixed

- "Filmische Markenwelten" bleibt nun auch in mittleren und besonders flachen Viewports vollstaendig sichtbar.

## [0.5.18] - 2026-07-16

### Changed

- Versionierte Tags (`v*`) starten den geschuetzten Production-Workflow jetzt automatisch als echten Live-Deploy. Normale Main- und Staging-Pushes bleiben davon unberuehrt.

## [0.5.17] - 2026-07-16

### Fixed

- Scrollbare Video-, About- und Markenbereiche nutzen nur noch natives CSS-Sticky. Die zusaetzliche pixelweise JavaScript-Verschiebung wurde entfernt, Video- und Textfortschritt laufen gemeinsam geglaettet ueber `requestAnimationFrame`.
- Der Contact-Hero "Let's talk" verwendet im Dark Mode nun denselben dunklen Grund und Off-White-Kontrast wie die anderen filmischen Header.
- Alte WordPress-Hauptseiten, Portfolio-Items, redaktionelle Inhalte, Fotokategorien und Shop-Pfade werden mit direkten 301-Weiterleitungen auf die jeweils passendste neue Seite gefuehrt. WordPress-Systempfade antworten bewusst mit 410 statt als Soft 404 auf der Startseite zu landen.

## [0.5.16] - 2026-07-16

### Fixed

- Der Startseiten-Titel "Filmische Markenwelten" hat mehr Zeilenraum und einen sichereren responsiven Rand, damit die Typografie nicht mehr abgeschnitten wird.

### Security

- Der Staging-Build ist nicht mehr ueber einen Ordnerpfad der Live-Domain erreichbar. Nur `staging.andreasboehler.com` darf auf `andreasboehlerportfolio-staging/` zugreifen.

## [0.5.15] - 2026-07-16

### Changed

- Die Live-Seite zeigt vorerst nur vier freigegebene Entertainment-Cases: DJ BoBo EVOLUT30N, 50 Jahre Europa-Park, Voltron Nevera und Phantom der Oper VR. Der vollstaendige Projektbestand bleibt im getrennten Staging erhalten.

### Security

- Nicht freigegebene Projekt-Unterseiten werden auf der Live-Domain mit HTTP 404 gesperrt und aus strukturierten Projektdaten sowie der Live-Sitemap entfernt.
- Der Production-Workflow erzeugt ein kuratiertes Live-Bundle ohne die 51 nicht freigegebenen Projekt-HTML-Dateien. Der Staging-Build behaelt den vollstaendigen Projektbestand.

## [0.5.14] - 2026-07-16

### Changed

- Staging wird ueber einen vertrauenswuerdigen Workflow aus `main` in den fest getrennten Ordner `andreasboehlerportfolio-staging/` deployt. Ein Push auf `staging` aktualisiert GitHub Pages und das Hosting-Staging automatisch, ohne Zugriff auf die Live-Umschaltung. Die Root-`.htaccess` routet `staging.andreasboehler.com` hostbasiert in diesen Ordner.

## [0.5.13] - 2026-07-16

### Fixed

- Der verifizierte Hostinger-Webroot ist nun als `FTP_SERVER_DIR=./` dokumentiert. Die Live-`.htaccess` leitet die Hauptdomain auf das Portfolio, laesst vorhandene reale Dateien und Wartungsverzeichnisse aber erreichbar.

## [0.5.12] - 2026-07-16

### Added

- Ein manueller, read-only Hosting-Pfadcheck vergleicht FTP-Login-Root, konfigurierten Webroot und den Hash der deployten Root-`.htaccess`.

## [0.5.11] - 2026-07-16

### Added

- Live und Staging besitzen getrennte Serverordner und Workflows. Der neue Staging-Deploy erzeugt ein gekennzeichnetes, nicht indexierbares Test-Bundle fuer `staging.andreasboehler.com`.

### Fixed

- Production-Uploads verwenden `FTP_SERVER_DIR` wieder explizit als Webroot, sodass Live-Ordner und Root-`.htaccess` am richtigen Ort liegen.

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
