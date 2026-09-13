# PMU 09 — galeria, 13 września 2026

Adres: https://www.permanentnybielsko.com/galeria/
Baza: main 48721eb95702ff33ad26f3095efdb11d4cf2dc86 (zaakceptowany cennik PMU 08).

Galeria w stylu zaakceptowanego poradnika i cennika: krótki wstęp, portret Bogusławy Herda, jasne tła, pudrowy róż i zieleń, czytelne kategorie i siatki zdjęć. Osobne reguły CSS galerii, bez zmian stylu poradników.

Zachowano 64 zdjęcia (brwi 14, usta 36, kreski 9, szkolenia 5), 6 filmów, oryginalne pliki, opisy alternatywne, FAQ, title, description, canonical z www oraz kotwice kategorii. Link szkoleniowy poprawiono z nieistniejącego /szkolenia-makijaz-permanentny/ na /szkolenie-makijaz-permanentny/.

210 miniatur WebP w trzech rozmiarach (240, 480, 720 px), bez retuszu i zmian barw. W siatce kadry pionowe; kolaże oraz materiały szkoleniowe mieszczą cały obraz. Podgląd pokazuje pełny oryginał. Po 6 pierwszych zdjęciach kategorię można rozwinąć natywnym przyciskiem. Cały wykaz znajduje się w HTML; przy wyłączonym JavaScript link otwiera oryginał.

Podgląd: poprzednie/następne zdjęcie w kategorii, klawiatura, przesunięcie palcem, zamknięcie i przywrócenie fokusu. Jeden odtwarzacz filmu, adres pliku ustawiany dopiero po kliknięciu; zamknięcie zatrzymuje film i usuwa źródło. Asystent AI osadzony w treści, zgodnie ze wzorcem poradnika i cennika.

H1 galerii: „Galeria makijażu permanentnego.” Data zmiany galerii: 2026-09-13 w mapie i CollectionPage. Pliki wpisów, strona poradnika, cennik, Header i komponent asystenta pozostają bez zmian. Layout rozszerza tylko obsługę osadzonego asystenta na /galeria/.

Weryfikacja: build Astro, porównanie materiałów i metadanych z bazą, odnośniki i kotwice, wymiary 210 miniatur, symulacja zachowania podglądu oraz kaskada CSS dla 320–1920 px. To nie jest pomiar Lighthouse ani render w przeglądarce. Przed Git sprawdź lokalny podgląd na telefonie i komputerze: przewijanie poziome, wszystkie kategorie, powiększenie zdjęcia, kolejne zdjęcie, zamknięcie, film, menu i asystent.
