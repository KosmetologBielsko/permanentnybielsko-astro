# Permanentny Analytics — stabilizacja i diagnoza

Audyt 24.09.2026, pakiet odtworzony i ponownie sprawdzony 25.09.2026.

## Status

Feature: `feature/permanentny-analytics-core-v02`, `8d83fb2da870e65c51eb082e8cf40dd239541ecc`.
Main: `0af2011ffbae769799a72f9e65d8e2041fbfdead`. Wspólna baza: `96ea90b711a3808780b0a393397be2a7f05b7f96`.
PR #3 jest nadal Draft. Feature ma 9 własnych commitów i nie zawiera jednego nowszego commita main — PMU 22 (dwie strony dokumentów i CSS). To wyjaśnia starszą wersję regulaminu na feature; nie jest dowodem, że Analytics zmienił design.

Nie wykonano push, merge, przełączenia produkcji, zmian env Vercel ani migracji na zewnętrznej bazie. Poprawki przygotowano w oddzielnym katalogu na bazie 8d83fb2. Paczka nie zmienia Layout ani stron usługowych.

## A. Rendering — konkretne dowody

Numery poniżej dotyczą wersji feature 8d83fb2 przed niniejszymi poprawkami.

| Plik i linie | Zmiana / mechanizm | Ocena |
| --- | --- | --- |
| `src/pages/makijaz-permanentny-brwi.astro:217`, `...ust.astro:211`, `...oczu.astro:177` | Tylko `data-analytics-price` i `data-service-key`; obserwowane przez JS, bez powiązanych selektorów CSS. | Nie zmieniają geometrii. |
| `src/layouts/Layout.astro:8,162` | Import i wywołanie `PermanentnyAnalytics`. | Komponent zawiera tylko skrypt, bez widocznego wrappera. Nie zmienia slotu ani CSS. |
| `src/components/PermanentnyAnalytics.astro:1–19` | Warunkowe uruchomienie trackera. | Tracker nie modyfikuje klas, style ani innerHTML strony. Koszt JS wymaga osobnego pomiaru wydajności. |
| `src/components/CookieConsent.astro:9–48,53–89` | Dodatkowe kontrolki, szerokość 440→500 px, flex-wrap/grid. Position fixed. | Rzeczywista zmiana samego banera: może zasłaniać treść; nie zwęża głównego kontenera. |
| `src/components/CookieConsent.astro:69` | `.cookie-consent__settings {display:grid}` nadpisuje natywne ukrycie HTML `hidden`. | Potwierdzony błąd widoczności panelu; poprawiony selektorem ograniczonym do banera. |
| `src/pages/cennik-makijaz-permanentny.astro:459,467` | Dopisanie brakującego `</nav>` i znaczników pomiaru. | Naprawa nieprawidłowego zagnieżdżenia oddzielna od Analytics. Nie udowodniono regresji renderingu. |
| `src/components/PmuLeadForm.astro:10,239–266` | Data atrybut i event po sukcesie formularza oraz zgoda marketingowa. | Brak zmian pól, treści i stylów formularza. |
| `src/scripts/pmu-gallery.ts:24–33,51–58,89–91` | CustomEvent galerii i identyfikator. | Ta sama logika lightboxa, bez nowego CSS. |
| `src/components/GoogleAdsTag.astro` | Odczyt zgód i skrypty konwersji. | Brak widocznego HTML; wpływ na pomiar, nie geometrię strony. |

W diffie trzykropkowym brak źródłowych zmian globalnego CSS, Header, Footer, zdjęć, astro.config.mjs i vercel.json. Nie przywracano plików w ciemno z main.

Astro: 6.3.8→7.3.5, adapter Vercel 10.0.8→11.0.11, Vite 7.3.3→8.3.0. To osobna zmiana toolchainu. Astro 7 ma nowy kompilator i domyślne przetwarzanie whitespace `compressHTML: 'jsx'`. W kontroli z 24.09 porównano HTML buildów main/feature dla homepage, brwi, ust, oczu, cennika, galerii i kontaktu: kolejność elementów, klas i ID była zgodna. Nie znaleziono zmienionych tekstów akapitów i nagłówków; różnice whitespace występowały między blokami lub elementami flex/grid. Nie jest to dowód zmiany wyglądu.

Ta kontrola NIE zastępuje screenshotów mobile/desktop. Rzeczywisty Preview wymaga dostępu do zalogowanego Vercel; E2E nie wykonano. Nie deklarujemy braku wszystkich regresji wizualnych na podstawie samego builda.

## B. Neon 503 — co wiadomo, czego nie wiadomo

Według dostarczonych logów funkcja działa, wywołuje Neon i zapisuje `collector_storage_error`, ale główny INSERT kończy się HTTP 400/503. To dowód częściowo sprawnego połączenia, nie dowód zgodności wszystkich tabel.

W poprzednim teście izolowanym oryginalny SQL wygenerowany przez rzeczywisty `@neondatabase/serverless@1.1.0` wykonał się poprawnie na schemacie repo w PostgreSQL/PGlite. **Nie odtworzono pierwotnego 503. Nie ustalono root cause w prawdziwym Neon Preview.** Rozbieżność schematu/constraintów lub wersji wdrożenia pozostaje hipotezą.

Potwierdzono i naprawiono dwa osobne błędy:

1. `neon-storage.ts:37–57,78–103`: INSERT/upsert i UPDATE tego samego visitor/session w sibling CTE. Nowy wiersz nie jest widoczny dla drugiego CTE; RAW i touch powstawały, ale first/last touch i session entry pozostawały NULL. PostgreSQL nie wspiera niezawodnego modyfikowania tego samego wiersza dwukrotnie w jednej instrukcji.
2. `neon-storage.ts:11,31`: `JSON.stringify(null)` oznacza JSONB null, zamiast SQL NULL, dla atrybucji strony wrażliwej.

Obecnie jest jedno atomowe zapytanie, ale tylko jeden upsert na tabelę. `ins RETURNING *` przekazuje typowane kolumny, touch powstaje z przyjętego eventu, a visitor/session zapisują od razu atrybucję. Zachowano deduplikację, rollback i pierwsze źródło sesji; późniejszy touch nie nadpisuje entry. Test obejmuje także page_view dostarczony przed session_start. Nie przebudowano schematu ani nie rozdzielono transakcji na niezależne requesty. Atrybucja nadal opiera kolejność na odbiorze zdarzeń; nie deklarujemy pełnej korekty dowolnego opóźnienia eventów.

Dodano bezpieczną diagnostykę: SQLSTATE, stała kategoria błędu, position, routine, table/column/constraint. Bez dowolnego driver message/detail, payloadów, sekretów czy DATABASE_URL. Dane trafiają do logu i `pa_data_quality_events.detail`; klient nadal dostaje ogólny 503.

Po aktualizacji Preview wykonaj `permanentny-analytics/diagnostics/preview-readonly.sql` w gałęzi Neon Preview. Ostatni SQLSTATE wraz z nazwą kolumny/constraintu i rzeczywistą definicją tabel pozwoli ustalić właściwą przyczynę. Nie przekazuj connection stringa ani danych użytkowników.

## Środowiska, zgody, prywatność

| Środowisko | Po poprawce |
| --- | --- |
| Local bez flagi | Tracker i endpoint wyłączone. To prawidłowe zachowanie. |
| Local z PUBLIC_PA_ENABLED=true | Opcjonalny test development na osobnej bazie. |
| Preview z flagą | Tracker dopiero po Analytics; endpoint używa przypisanego DATABASE_URL. Environment narzuca serwer. |
| Production | Twardy bezpiecznik VERCEL_ENV=production blokuje endpoint nawet przy przypadkowej fladze. Main pozostaje nietknięty. Przyszłe uruchomienie wymaga oddzielnej zmiany. |

PUBLIC_PA_ENABLED jest wbudowywane do frontendu podczas builda; zmiana wymaga nowego deploymentu. DATABASE_URL pozostaje tylko po stronie serwera, endpoint ma prerender=false. Ustawienia Marketplace/Neon znane z briefu nie zostały niezależnie potwierdzone w panelu.

- Marketing i Personalizacja mają odrębne przełączniki. ad_personalization wymaga obu zgód; Analytics nie daje marketingu.
- Dodano możliwość ponownego otwarcia ustawień i wycofania zgód. To jedyny nowy stały element UI, ograniczony do komponentu cookies.
- Odczyt zgody przy blokadzie localStorage zwraca tylko niezbędne. Migracja starego accepted zachowuje analytics/marketing, ale nie dopisuje personalization. Istniejącego v2 nie da się wiarygodnie rozróżnić jako starej migracji lub świadomego wyboru.
- Origin porównuje protokół, host i port; same-site bez Origin nie wystarcza. Brak wildcard CORS.
- Własny host Preview nie jest outbound/referral. Wewnętrzny referrer nie przenosi poprzedniej ścieżki wrażliwej do nowego zdarzenia przypisanego użytkownikowi. Collector czyści też powiązane sensitive target_path.
- UTM chatgpt.com/perplexity.ai rozpoznawane jako AI. Typy pól zgody walidowane przed SQL.

Zachowane: ID dopiero po zgodzie Analytics, sesja 30 min, brak fingerprintingu, aggregate_only na stronach wrażliwych, Booksy click nie oznacza rezerwacji, formularz dopiero po sukcesie, istniejące GA/Ads/Clarity i cała treść strony.

## Otwarte bramki — to nie jest jeszcze gotowość produkcyjna

1. Pierwotny 503: potrzebny wynik aktualnego Neon Preview. Bez tego nie ogłaszamy naprawy.
2. E2E i screenshoty Preview: niewykonane z powodu braku zalogowanego dostępu.
3. price_view obserwuje cały blok przy 50% widoczności. Bardzo wysoki cennik na mobile może nie spełnić progu; potrzebny pomiar i mała poprawka obserwacji.
4. Brak dedykowanego active-time. Czas pomiędzy zdarzeniami w widoku SQL nie jest czasem czytania.
5. Ogólne cta_click wymaga data-analytics-cta; obecne strony nie mają tego znacznika. Osobne Booksy/tel/social/menu są obsługiwane.
6. Widok pa_v_ai_session_performance może mnożyć wyniki, jeśli sesja ma kilka touchy tego samego AI; wymaga deduplikacji raportowej przed interpretacją biznesową.

Te ograniczenia są jawne; nie cofano Analytics, żeby naprawić stronę.

## Kontrola i następny test Preview

Lokalnie: 34/34 testy PASS (16 wcześniejszych testów bez modyfikacji), build Astro PASS, git diff --check PASS. PGlite jest wyłącznie devDependency. Testy wykonują SQL rzeczywistego drivera na lokalnym PostgreSQL; nie łączą się z Neon.

Po instalacji: build/testy → commit wyłącznie plików paczki → push tylko feature → Vercel Preview Ready. Następnie:
- Necessary-only: brak eventów PA/ID; Analytics tak/Marketing nie/Personalizacja nie: PA działa bez własnych konwersji Ads.
- Direct, kontrolowane Google referrer, UTM ChatGPT: session_start, właściwe source/entry i touch.
- page_view, scroll, menu, cena, Booksy/tel bez finalnej rezerwacji/połączenia, otwarcie i zdjęcia galerii.
- Błąd formularza bez form_submit; sukces na testowym transporcie, bez wysyłania prawdziwej wiadomości.
- Powtórzony event i semantic duplicate: bez dodatkowych RAW/touch.
- /sercemmalowane/: visitor/session/tab/attribution SQL NULL, brak ścieżki między stronami.
- Wycofanie zgody: brak nowych eventów, usunięcie ID/kolejki.
- HTTP 202 oraz RAW/visitor/session/touch/widoki; w razie 503 diagnostyka tylko Preview.
- 390/768/1440/1920 px: baner, menu, cennik, formularz, lightbox.

## Klasyfikacja wszystkich 42 plików main...feature

A Analytics, B Astro/Vercel, C niezależna poprawka/porządek, D zbędna/przypadkowa, E UI/UX. B nie oznacza, że upgrade był wymagany do samej analityki. Nie znaleziono dowodu na przypadkowy redesign kategorii D.

| Plik | Diff | Klasa | Znaczenie |
| --- | --- | --- | --- |
| `.gitignore` | +5/−0 | C | Ignorowanie kopii/archiwów. |
| `package-lock.json` | +2826/−3395 | A+B | Lock toolchainu i zależności; nie samodzielny dowód regresji. |
| `package.json` | +8/−6 | A+B+C | Biblioteki Analytics, upgrade Astro/adapter, usunięcie niewykorzystywanego nodemailer. |
| `permanentny-analytics/.env.example.analytics` | +5/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/docs/EVENT_DICTIONARY_V02.csv` | +33/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/docs/INSTALL_V02.md` | +116/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/docs/REPO_AUDIT.md` | +108/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/docs/SOURCE_CLASSIFICATION_V02.md` | +63/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/sql/001_core_schema.sql` | +143/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/sql/002_views.sql` | +91/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `permanentny-analytics/tests/analytics-core-v02.test.ts` | +184/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/components/CookieConsent.astro` | +163/−131 | A+E | Zmiana banera i kategorii zgód. |
| `src/components/GoogleAdsTag.astro` | +42/−32 | A | Zgody i skrypty bez widocznego HTML. |
| `src/components/PermanentnyAnalytics.astro` | +19/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/components/PmuLeadForm.astro` | +21/−1 | A | Event sukcesu i marker formularza. |
| `src/layouts/Layout.astro` | +2/−0 | A | Tylko import i komponent skryptowy. |
| `src/lib/analytics/collect-core.ts` | +82/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/collect-handler.ts` | +149/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/config.ts` | +24/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/consent.ts` | +96/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/dedupe.ts` | +22/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/event-dictionary.ts` | +56/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/ids.ts` | +5/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/index.ts` | +5/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/memory-storage.ts` | +22/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/neon-storage.ts` | +131/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/page-catalog.ts` | +104/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/session.ts` | +61/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/source-context.ts` | +198/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/sources.ts` | +13/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/storage.ts` | +14/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/tracker.ts` | +738/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/types.ts` | +169/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/url-sanitize.ts` | +72/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/validation.ts` | +185/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/lib/analytics/visitor.ts` | +45/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/pages/api/analytics/collect.ts` | +31/−0 | A | Kod, test lub dokument Analytics, bez zmiany widocznego layoutu. |
| `src/pages/cennik-makijaz-permanentny.astro` | +2/−1 | A+C | Znaczniki pomiaru oraz zamknięcie nav. |
| `src/pages/makijaz-permanentny-brwi.astro` | +1/−1 | A | Wyłącznie dwa atrybuty data-*. |
| `src/pages/makijaz-permanentny-oczu.astro` | +1/−1 | A | Wyłącznie dwa atrybuty data-*. |
| `src/pages/makijaz-permanentny-ust.astro` | +1/−1 | A | Wyłącznie dwa atrybuty data-*. |
| `src/scripts/pmu-gallery.ts` | +18/−0 | A | Eventy galerii, istniejący lightbox. |

Źródła techniczne: https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-MODIFYING oraz https://docs.astro.build/en/guides/upgrade-to/v7/ .

Build nie jest pełnym typecheckiem ani testem wizualnym E2E.
