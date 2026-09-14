# PMU 13 — strona główna

14.09.2026. Baza: main 17bae06a19cec65846d9862d5136bde30ac85cbe, zaakceptowana i wdrożona strona PMU 12.

## Nowy układ

Strona główna korzysta z kolorów, typografii i proporcji zaakceptowanej podstrony PMU: Inter, biel, mięta, pudrowy róż, turkusowe przyciski. Własny prefiks pmu-home ogranicza wpływ starych stylów strony głównej.

1. Otwarcie z ulubionym portretem w kapeluszu, widocznym również na telefonie. Użyto oryginału z projektu: powrot-do-natury-boguslawa-herda-kapelusz.webp, odpowiadającego przesłanemu zrzutowi. Nie retuszowano zdjęcia. Na mobile kadr ma proporcję 4:3, na komputerze 4:5. Plik źródłowy pozostaje nienaruszony.
2. Cztery obszary: brwi metodą cienia, Silky (włos maszynowy), usta i kreski. Kategorie pochodzą z zatwierdzonej bazy zdjęć paczki 10. Ceny i zasada korekty do 2 miesięcy odpowiadają PMU 12.
3. „Powrót do natury w praktyce” z filmem na pełną szerokość sekcji. Film źródłowy jest poziomy 16:9; odtwarzacz pokazuje pełny kadr. Wersja mobilna 960×540 waży ok. 3,66 MB, desktopowa 1280×720 ok. 9,08 MB. Są natywne kontrolki i dodatkowy przycisk pełnego ekranu, jeśli przeglądarka wspiera tę funkcję. Bez autoplay, preload=none. Użyto dotychczasowego filmu.
4. Doświadczenie Bogusława Herda z dotychczasowym zdjęciem z hero i linkiem do pełnej sekcji doświadczenia na PMU 12.
5. Międzynarodowa działalność: Ankara, Budapeszt, Lyon, Monachium, Düsseldorf i Dżakarta. Ankara ma istniejącą ilustrację, wszystkie role są czytelnym tekstem. Dżakarta oznaczona jako nadchodząca w 2026 r.
6. Krótsze sekcje szkoleń, Long-Time-Liner i #SercemMalowane; zachowane zdjęcia zespołu oraz Ambasador Serca.
7. Galeria, poradnik oraz opcjonalny film z metamorfozami w rozwijanym panelu.
8. Kontakt i rezerwacja oraz asystent AI uruchamiany z treści. Automatyczny popup Silky wyłączono na stronie głównej; karta Silky pozostaje częścią oferty. Popup na stronie brwi pozostaje.

## Zachowane SEO i nawigacja

- Tytuł, opis meta i tekst H1 zachowane.
- Canonical https://www.permanentnybielsko.com/; odnośniki w JSON-LD ujednolicone do www.
- Zachowane kotwice: #makijaz-permanentny, #metody, #szkolenia, #efekty, #autorytet, #szkolenia-pmu, #o-mnie, #sercem-malowane i #kontakt.
- Zachowane katalogi sześciu głównych usług w danych strukturalnych.
- Odnośniki do formularza prowadzą do /makijaz-permanentny-bielsko/#kwalifikacja-pmu. Formularz oraz jego wysyłka i konwersje pozostają na stronie PMU.
- Data aktualizacji strony głównej w WebPage i sitemap: 2026-09-14.
- Treści strony PMU 12, kontaktu, cennika i galerii nie zmieniono.

## Pliki

- src/pages/index.astro
- src/styles/pmu-home.css
- src/components/HomeBrandVideo.astro
- src/layouts/Layout.astro
- src/data/page-modified.ts
- pięć zdjęć w src/assets/home-13/ (kopie dotychczasowych materiałów dla responsywnej optymalizacji Astro)
- docs/PMU_PACZKA_13.md

Duża liczba usuniętych linii w index.astro wynika z zastąpienia starego układu, powtarzających się sekcji oraz wielokrotnie dopisywanych stylów.

## Weryfikacja i publikacja

Build Astro/Vercel przeszedł. Zweryfikowano wygenerowany HTML, 36 odnośników, kotwice, wymiary i warianty zdjęć, dane strukturalne, oba filmy oraz działanie przycisku pełnego ekranu z symulacją standardowego API, iOS, błędu i braku wsparcia. Kaskadę CSS sprawdzono w 10 szerokościach 320–1920 px (275 sprawdzeń). Raporty są w KONTROLA.

To kontrola kodu i DOM, nie render pikseli ani pomiar Lighthouse czy Core Web Vitals. Ostatni krok przed publikacją: lokalny podgląd na telefonie i komputerze, obejrzenie zdjęcia w kapeluszu, odtworzenie filmu, pełny ekran, kotwice, Booksy, formularz i asystent. Nie publikowano strony ani nie wysyłano rzeczywistych zapytań podczas przygotowania paczki.

Instalator sprawdza zgodność plików, tworzy kopię poza projektem i pozwala cofnąć podmianę. Obsługuje UTF-8 BOM oraz CRLF. Przy konflikcie nie nadpisuje innych wersji. Powtórna instalacja jest bezpieczna. Komendy instalacji i Git są w dwóch plikach TXT oraz przekazywane bezpośrednio w rozmowie.
