# PMU 11 — nowy kontakt

Baza Git: a62b057694e579a67232dde2955d244a5b6539a1 (paczka 10).
Strona: https://www.permanentnybielsko.com/kontakt/

## Co zmienia paczka
- Początek w stylu zaakceptowanego cennika: Inter, miętowy panel, pudrowe tło, miniaturka Bogusława Herda.
- Widoczny numer telefonu, Booksy i formularz PMU; uporządkowane adres, dojazd, godziny i e-mail.
- FAQ, galeria, cennik, Instagram, Facebook i istniejący asystent AI w treści.
- Jedna kolumna do 900 px, przyciski co najmniej 50 px, zawijanie długiego adresu e-mail.

## Zakres plików
src/pages/kontakt.astro, src/styles/pmu-contact.css, src/layouts/Layout.astro, src/data/page-modified.ts oraz ten dokument.
Layout: tylko dodanie /kontakt do istniejącej listy stron z asystentem w treści.
Sitemap: rzeczywista data aktualizacji kontaktu 2026-09-14.

Adres /kontakt/, canonical z www, title, telefon, e-mail, Booksy, Google Maps i formularz kwalifikacji zachowane. Godziny są pobierane z istniejącego src/config/site.ts, wspólnego z danymi strukturalnymi gabinetu. Treści innych podstron nie były edytowane.

## Kontrola
Build Astro przeszedł. Sprawdzono 16 odnośników, ich cele i kotwice, schemat FAQ, H1, canonical, dane kontaktowe, integrację asystenta i sitemap. 180 kontroli kaskady CSS dla szerokości 320–1920 px. Jedyna miniaturka na tej stronie ma 1676 B w sprawdzonym buildzie. Bez nowego skryptu i ciężkiej osadzonej mapy.
To kontrola builda, DOM i CSS — nie render w przeglądarce ani Lighthouse. Lokalny podgląd przeglądarkowy w tym środowisku był niedostępny. Przed Git obejrzyj /kontakt/ na telefonie i komputerze: tytuł, telefon, e-mail, godziny, FAQ i asystenta. Sprawdź też większy tekst i brak przewijania w poziomie.
