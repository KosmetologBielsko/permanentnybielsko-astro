# PMU 12 — strona makijażu permanentnego

Data: 14.09.2026. Baza: main, commit 51277087099443fee830583a133cbff6d82cd9e0 (wdrożony kontakt PMU 11).

## Zakres

Nowy układ /makijaz-permanentny-bielsko/ w stylu zaakceptowanych stron poradnika, cennika i kontaktu. Inter, biel, pudrowy róż, mięta i turkus. Początek zawiera ceny, małe zdjęcia, rezerwację oraz link do kwalifikacji. Cztery osobne karty usług: brwi metodą cienia, włos maszynowy Silky, usta i kreski. Zdjęcia pochodzą z kategorii zatwierdzonych w paczce 10; nowych ilustracji AI nie generowano.

Doświadczenie Bogusława Herda przeniesiono wyżej. Zachowane osiągnięcia i opis podejścia do pracy; dodatkowe informacje o wydarzeniach i działalności społecznej można rozwinąć. Film z gabinetu ma własne sterowanie, nie odtwarza się automatycznie i ma preload="none". Korekta zabiegów głównych objętych gwiazdką w cenniku: do 2 miesięcy.

## Zachowane funkcje i SEO

- Ten sam URL, title, opis meta oraz tekst H1 i canonical z www.
- Kotwice #boguslawa-herda, #kwalifikacja-pmu, #zakres-zabiegow i #kontakt.
- Ten sam endpoint Formspree, nazwy pól, wymagane pola, zgoda i oryginalny skrypt wysyłki oraz konwersji Google Ads.
- Osobny PmuLeadForm.astro otrzymał lokalne style formularza. Link do polityki prywatności został dodany.
- Dotychczasowe 8 odpowiedzi FAQ i dane Service/FAQPage/BreadcrumbList. WebPage i sitemap otrzymują datę zmiany 2026-09-14.
- Asystent otwierany w treści przez GuideAssistant, jak na zaakceptowanej stronie kontaktu. Zmiana Layout dotyczy tego adresu.

## Zmienione pliki

1. src/pages/makijaz-permanentny-bielsko.astro
2. src/styles/pmu-landing.css
3. src/components/PmuLeadForm.astro
4. src/layouts/Layout.astro
5. src/data/page-modified.ts
6. src/assets/pmu-12/boguslawa-herda-doswiadczenie.webp
7. docs/PMU_PACZKA_12.md

Duża liczba usuniętych linii w Git wynika z zastąpienia starego układu i jego wielokrotnie dopisywanych stylów oraz usunięcia pustych linii. Formularz przeniesiono do komponentu. Paczka nie przebudowuje poradników ani pozostałych usług.

## Weryfikacja

Build Astro/Vercel oraz kontrola wygenerowanego HTML, linków, zdjęć, istniejących kotwic i zgodności FAQ z JSON-LD. Test formularza używa symulowanych odpowiedzi: sukces, błąd serwera i błąd sieci. Nie wysłano prawdziwego zapytania. Kontrola kaskady CSS obejmuje szerokości 320, 360, 390, 430, 640, 768, 900, 1024, 1440 i 1920 px. Raporty są w KONTROLA w ZIP-ie.

Kontrola CSS nie jest renderem pikseli ani pomiarem Core Web Vitals. Przed publikacją obejrzyj lokalny podgląd: początek, cztery karty, kotwice doświadczenia i formularza, film, FAQ i asystenta. Na telefonie sprawdź brak przewijania całej strony w bok. Po Ready powtórz krótką kontrolę wersji produkcyjnej.

## Instalacja i cofnięcie

Komendy 1-INSTALACJA-POWERSHELL.txt wybierają ZIP przez okno plików, sprawdzają zgodność, tworzą kopię poza projektem, instalują i uruchamiają build. Instalator toleruje CRLF i BOM; nie nadpisuje innych wersji zmienianych plików. Powtórna instalacja nie zmienia już zastosowanych plików. --verify kontroluje kompletność, --restore przywraca kopię, jeżeli plików nie zmieniono później.

Komendy 2-GIT-POWERSHELL.txt przygotowują tylko pliki tej paczki. Zatrzymują się przy nieudanym buildzie, innej gałęzi lub obcych plikach już przygotowanych do commitu. Publikacja następuje dopiero przez git push użytkownika.

Stała preferencja projektu: przy każdej kolejnej paczce podawać od razu w rozmowie pełne komendy PowerShell, podgląd i Git.
