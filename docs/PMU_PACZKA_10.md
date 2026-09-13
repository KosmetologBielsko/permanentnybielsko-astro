# PMU 10 — galeria według metod i nowa baza zdjęć

Baza: main 11f7e13a1c8a0144741c6fd22dbe7f54c36adccb (wdrożona paczka 09).
Adres: https://www.permanentnybielsko.com/galeria/

## Zmiany

- Cztery osobne grupy z ZIP-a właściciela: Silky / włos maszynowy (20), metoda cienia (16), oczy / kreski (15), usta (27). Galeria pokazuje nowe materiały zamiast poprzednich grup zabiegowych. Pozostawiono 5 zdjęć szkoleniowych i 6 filmów.
- Metody przypisano na podstawie folderów, a nie wyglądu naturalnych włosków. Poprzednie błędne „makro włosa maszynowego” nie występuje w nowym wykazie.
- Początek nawiązuje do cennika: tytuł, wprowadzenie i autorka po lewej, miętowy panel z czterema miniaturami oraz przejściem do cennika po prawej; na telefonie jedna kolumna.
- Zdjęcie i film w podglądzie zajmują wyznaczony obszar absolutnie, z object-fit: contain. Wymiary własne wczytanego obrazu nie rozciągają wewnętrznego wiersza siatki i nie powodują ucięcia kadru na komputerze. Zachowano klawiaturę, przesuwanie palcem, przywrócenie fokusu oraz odtwarzacz uruchamiany kliknięciem.
- Kolaże są oznaczone jako kompozycje i pokazywane bez kadrowania. FAQ opisuje zbliżenia i kompozycje ilustracyjne; nie przypisuje wszystkim obrazom statusu dokumentacji zabiegowej ani etapu gojenia.
- Oryginalne stare pliki i adresy obrazów pozostają, ponieważ mogą być używane przez poradniki i podstrony. Treści poradników, cennik i globalne style nie są zmieniane.

## Baza do następnych podstron

`src/data/pmu-media-library.json` zawiera 78 materiałów, podzielonych na `silky`, `cien`, `oczy`, `usta`. Każdy ma stały identyfikator, podpis, alt, ścieżkę WebP, wymiary i srcset. Pliki są w `public/images/galeria-10/`.

`docs/PMU_MEDIA_10_ZRODLA.json` mapuje każdy identyfikator do oryginalnego folderu i pliku w ZIP-ie wraz z SHA-256. PNG nie są kopiowane do aplikacji: przygotowano WebP 240/480/800 px i pełny kadr maks. 1800 px szerokości, bez powiększania źródeł, retuszu i zmian koloru. Pełny zestaw do podglądu waży ok. 18,6 MB zamiast 181,3 MB PNG i ładuje się na żądanie.

Zasada redakcyjna od właściciela: metoda cienia to cieniowanie, metoda włoskowa/Silky to pigmentowane linie odtwarzające włoski. Widoczne własne włoski nie stanowią dowodu zastosowania techniki włoskowej. Przenosząc zdjęcie do poradnika, zachowaj kategorię z bazy oraz opis kompozycji, jeśli dotyczy. Nie dopisuj etapów gojenia, diagnoz ani nazw technik bez potwierdzenia.

Kotwica `#galeria-brwi` pozostaje dla metody cienia; Silky otrzymuje osobną `#galeria-silky`. Pozostałe kotwice zachowano. H1, title i www canonical pozostają; description i ItemList aktualizują zakres galerii. Data pozostaje 2026-09-13, ten sam dzień co poprzednia publikacja.

## Kontrola przed publikacją

Sprawdź /galeria/ na telefonie i komputerze: panel początkowy, 4 kategorie, dodatkowe zdjęcia, pełny kadr pionowego zdjęcia oraz kolażu, następne/poprzednie, zamknięcie, film, menu i asystent. Lokalne testy obejmują build, odnośniki, kategorie, pliki, dialog i reguły CSS. Kontrola reguł nie zastępuje renderu w docelowej przeglądarce.
