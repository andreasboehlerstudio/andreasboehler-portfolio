# WordPress redirect map

Stand: 2026-07-16

Die fruehere WordPress-Installation wurde anhand von Suchmaschinen-Treffern und 733 im Internet Archive erfassten HTML-URLs geprueft. Die Root-`.htaccess` behandelt die alten URL-Familien vor dem internen Routing in den neuen Produktionsordner.

## Direkte 301-Ziele

| Alte URL oder URL-Familie | Neues Ziel |
| --- | --- |
| `/home/`, `/homepage/` | `/` |
| `/about/` | `/about.html` |
| `/contact/` | `/contact.html` |
| `/services/` | `/services.html` |
| `/works/`, Filmarchive, Clients | `/works.html` |
| `/photography/`, Fotografiearchive | `/photography.html` |
| `/helpie_faq_page/` | `/faq.html` |
| `/agb/`, `/datenschutz/`, `/impressum/` | entsprechende `.html`-Seite |
| `/filmproduktion-freiburg.html` | `/videograf-freiburg.html` |
| `/filmproduktion-offenburg.html` | `/videograf-offenburg.html` |
| `/filmproduktion-basel.html` | `/videograf-basel.html` |
| vier freigegebene `/portfolio-item/.../`-Slugs | entsprechende Live-Projektseite |
| sonstige `/portfolio-item/.../`-Slugs | `/works.html` |
| Filmproduktions- und Imagefilm-Artikel | `/werbefilm-produktfilm.html` |
| KI-, Virtual-Production- und Postproduktions-Artikel | `/services.html` |
| Fotografie-Artikel und Bildkategorien | `/photography.html` |
| alte Journal-, Kategorie- und Tagarchive | `/about.html` |
| ehemaliger Fotokunst-Shop und Produktarchive | `/photography.html` |

Query-Strings aus WooCommerce-Filtern, Tracking und alten Suchergebnissen werden bei den 301-Weiterleitungen verworfen. Dadurch entsteht jeweils nur ein Redirect-Hop auf eine kanonische neue URL.

## Bewusst entfernt

WordPress-Systempfade wie `/wp-admin/`, `/wp-json/`, `/wp-content/`, `/wp-login.php` und `/xmlrpc.php` antworten mit HTTP 410. Dasselbe gilt fuer uebrige obsolete WordPress-Permalinks mit abschliessendem Slash, fuer die es keinen inhaltlich passenden Nachfolger gibt. Das vermeidet irrefuehrende Startseiten-Redirects und Soft-404-Signale.

## Live-Pruefung

Nach jedem Production-Deploy werden mindestens diese Faelle kontrolliert:

- exakte Hauptseiten-Weiterleitung
- exakte Weiterleitung eines freigegebenen Portfolio-Items
- generische Weiterleitung eines nicht freigegebenen Portfolio-Items
- thematische Artikel- und Fotografie-Weiterleitung
- 410 fuer WordPress-Systempfad und obsoleten Permalink
- keine Redirect-Kette; Ziel antwortet direkt mit HTTP 200
