# PMU 07 — strona główna poradnika

Baza: main, fc2689478016231e093142492b8f03c591da4550 (poprawki 06.2).
Zakres: strona /poradnik/. Data przygotowania: 13 września 2026.

## Co zmienia się dla czytelniczki

- Wyszukiwarka przy nagłówku; krótki wstęp, portret autorki, mięta i pudrowy róż.
- Brwi, usta i kreski wybierane kartami z oryginalnymi zdjęciami z galerii.
- 60 wpisów ma czytelne, krótsze nazwy na kartach. Pełne tytuły artykułów są zachowane.
- Filtry obejmują także gojenie, ceny, przygotowanie, korekty, skórę i szkolenia.
- Pierwsze 12 wpisów; przyciski pokazują następne lub wszystkie. Bez JavaScript wszystkie 60 linków jest widocznych.
- Wyszukiwanie uwzględnia polskie znaki, kolejność słów i wybrane odmiany; dopasowanie w tytule ma pierwszeństwo.
- Kategoria, zapytanie i liczba pokazanych wpisów są zapamiętane we fragmencie adresu. Brak dodatkowych adresów indeksowanych dla filtrów.
- Miniatury WebP mają srcset, rozmiary i lazy loading. Użyto istniejących plików graficznych.
- Asystent dostępny na końcu strony, w treści; wspólny nagłówek korzysta z istniejącego wariantu compact.

## Zachowane

Pliki 60 artykułów, ich H1, treści, adresy, zdjęcia, daty aktualizacji i dane uporządkowane; komponent GuideSeriesByline i style artykułów z 06.2. Tytuł SEO, opis i canonical www strony zbiorczej pozostają takie same. Zmieniony H1 strony zbiorczej jasno nazywa poradnik makijażu permanentnego. W sitemap aktualizuje się wyłącznie lastmod /poradnik/.

## Gdzie edytować dalej

- src/data/guide-catalog.ts — pełna lista, krótki tytuł karty, opis, tematy. Zmiana tu nie zmienia artykułu.
- src/styles/guide-hub.css — wygląd strony zbiorczej; reguły należą wyłącznie do .pmu-hub.
- src/scripts/guide-hub.ts — filtry, wyszukiwanie, przycisk kolejnych wpisów.
- src/components/GuideHubCard.astro — wspólna karta i responsywne zdjęcie.
- src/pages/poradnik.astro — wstęp, wybór tematów, sekcje informacyjne i FAQ.

## Weryfikacja

Build Astro, 60 niezmienionych plików artykułów, komplet tras i kotwic, obrazy/srcset/wymiary, metadane oraz zgodność FAQ z treścią. Testy DOM obejmują wyszukiwanie, 11 filtrów, 12/24/60 wyników, brak wyników, reset, klawiaturę i odtworzenie stanu z adresu. Sprawdzono 150 reguł wynikowej kaskady CSS przy 10 szerokościach 320–1920 px.

To nie jest test renderowania nowej strony w przeglądarce ani pomiar Lighthouse. Aktualna strona produkcyjna została obejrzana w przeglądarce; nowy układ trzeba jeszcze ocenić wizualnie po uruchomieniu podglądu na telefonie i komputerze.

Do sprawdzenia po uruchomieniu: nagłówek i menu 360/390/430 px, brak przesuwania całej strony w bok, wyszukiwanie „cena kreski” i „gojenie ust”, powrót z artykułu do wyników, kolejne wpisy, otwieranie FAQ i przycisk asystenta.
