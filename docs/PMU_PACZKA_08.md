# PMU 08 — cennik makijażu permanentnego

Przygotowano: 13 września 2026.
Baza: main, commit 3f2233762607a7c4f2691b4364a937f87150381c (zaakceptowany poradnik 07).
Strona: https://www.permanentnybielsko.com/cennik-makijaz-permanentny/

## Cel i wygląd

Klientka ma szybko znaleźć cenę i warunki zabiegu na telefonie. Cennik korzysta
z tej samej palety, fontu Inter, szerokości treści, przycisków i skali nagłówków
co zaakceptowana strona zbiorcza poradnika 07. Wstęp jest krótszy, obok niego
znajdują się ceny brwi, ust i kresek. Na telefonie sekcje układają się pionowo.

Pełny wykaz pokazuje wszystkie 19 usług od razu. Tylko dodatkowe objaśnienia
rozwijają się przez natywny element details. Ceny działają bez JavaScript.
Usunięto powtarzające się ekspozycje cen, duże ozdobne panele oraz kod animacji
starego cennika. Małe fotografie pochodzą z istniejących plików projektu;
nie wygenerowano nowych ilustracji ani nie przerabiano zdjęć.

## Zakres zmian

- src/pages/cennik-makijaz-permanentny.astro — nowy układ, zachowany wykaz cen.
- src/styles/pmu-price.css — styl tylko cennika, klasy pmu-price.
- src/layouts/Layout.astro — włączenie istniejącego asystenta w treści także na cenniku.
- src/data/page-modified.ts — data zmiany wyłącznie cennika.
- Ten dokument.

Bez zmian pozostają 60 artykułów, strona /poradnik/, wspólny nagłówek,
pozostałe podstrony, ich metadane, zależności i konfiguracja hostingu.

## Ceny i SEO

Źródło: aktualny kod repozytorium, porównany z publiczną stroną cennika.
Wszystkie 19 nazw usług, cen, czasów wizyt i warunków pozostają w danych
priceGroups bez zmiany. W trzech wierszach brwi skrócono tylko wyświetlanie
powtarzającego się przedrostka; pełne nazwy są w danych strukturalnych.

Zachowano tytuł SEO, opis, tekst H1, adres kanoniczny z www, FAQ i OfferCatalog.
Zachowano kotwice cennik-pmu oraz price-group-0 do price-group-6.
Ceny z * obejmują zabieg główny i korektę po wygojeniu do 2 miesięcy od zabiegu
głównego; ** dotyczy odświeżenia pracy naszego gabinetu do 2 lat.
Nie zmieniono cen VIP, konsultacji, naprawy ani usług społecznych.

## Weryfikacja i granice

- Astro build: kod wyjścia 0, wygenerowany cennik i konfiguracja Vercel.
- 19/19 cen i czasów oraz wszystkie warunki zgodne z bazą.
- 77 plików poradnika, jego komponentów i wspólnego nagłówka bez zmiany bajtów.
- HTML: pojedyncze H1 i main, unikalne identyfikatory, kotwice i lokalne linki.
- JSON-LD: zgodność OfferCatalog i FAQ z treścią.
- Obrazy: obecne pliki i srcset, określone wymiary; 4 obrazy w treści,
  razem około 9,6 kB dla domyślnych wariantów (nie jest to pomiar transferu strony).
- 150 kontroli kaskady skompilowanego CSS dla 320, 360, 390, 430, 640,
  768, 900, 1024, 1440 i 1920 px.
- Natywne rozwijanie objaśnień i FAQ oraz widoczność cen bez JavaScript.

Oglądano obecną publiczną stronę w przeglądarce. Nowa wersja nie była renderowana
w przeglądarce tego środowiska — wcześniejsza blokada lokalnego podglądu nadal
ogranicza taki test. Test CSS nie mierzy rzeczywistego położenia pikseli.
Nie wykonano Lighthouse i nie podano wyniku wydajności.

## Do sprawdzenia przy podglądzie i po Ready

1. Telefon: tytuł, ceny w skrócie i 7 przycisków kategorii, bez przewijania w bok.
2. Pełny wykaz: długie nazwy, zakresy cen, VIP i indywidualna wycena.
3. Kategorie przechodzą do właściwej sekcji i nagłówek jej nie zasłania.
4. FAQ i objaśnienia rozwijają się dotykiem i klawiaturą.
5. Booksy, telefon i formularz otwierają właściwe miejsca.
6. Asystent AI otwiera panel z przycisku w treści. Nie wysyłaj próbnego
   zapytania tylko w celu kontroli wyglądu.
7. Komputer: dwie kolumny wstępu i sekcji cen, czytelne wyrównanie kwot.
8. Krótka kontrola zaakceptowanej strony /poradnik/.

Paczka nie wykonuje commitu, push ani publikacji. Instalator tworzy kopię
zmienianych plików obok katalogu projektu i odmawia nadpisania nowszych zmian.
