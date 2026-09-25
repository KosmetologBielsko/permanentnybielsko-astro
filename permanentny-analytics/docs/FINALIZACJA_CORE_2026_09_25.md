# Permanentny Analytics — kontrola przed merge, 25.09.2026

Zakres: PR #3, synchronizacja `main` → `feature/permanentny-analytics-core-v02`,
minimalne poprawki stabilności i kontrola gotowości do scalania. Dashboard i włączenie
Production pozostają osobnymi etapami wymagającymi akceptacji.

## Stan wejściowy sprawdzony bezpośrednio

- GitHub: feature `0f59bb9`, main `0af2011`, merge-base `96ea90b`; 11 ahead / 1 behind.
- PR #3: open, draft, mergeable. Trzy pliki PMU 22 są identyczne względem main.
- Vercel Preview `dpl_BNSiwxwqE5UfKZ7mjhaGPzxXfAxW`: READY, commit `0f59bb9`.
- Production `dpl_8wkdaRFSSrc5fvzauG1eWQ2r3xDX`: READY, main `0af2011`.
- Logi Preview od 25.09 06:24 UTC do kontroli: 126 odpowiedzi 202 kolektora;
  brak wpisów error/fatal w tym zakresie. Production: brak takich wpisów w ostatnich 24 h.
- Ręczne testy Neon, źródeł, zdarzeń, zgód i sensitive pages przyjęto z aktualnego
  master planu użytkownika. Nie powtarzano całego E2E ani testowego formularza.

## Synchronizacja

Zastosowano zwykły merge `origin/main` do feature. Bez konfliktów, bez rebase,
bez force push. Commit synchronizacji ma dokładnie to samo drzewo plików co jego
pierwszy rodzic: PMU 22 wymagał wyłącznie uporządkowania historii.

## Znalezione problemy i minimalne poprawki

| Plik | Mechanizm / ryzyko | Poprawka |
| --- | --- | --- |
| `.gitignore` | `.env` i `.env.production` nie chroniły `.env.local` tworzonego przez CLI | Dodano `.env.local` i `.env.*.local`. `.vercel` już był ignorowany. Szablony `.env.example` pozostają śledzone. |
| `src/lib/analytics/tracker.ts:69–76,192–199,453–463` | Getter `sessionStorage` mógł rzucić wyjątek przed wejściem do funkcji ochronnej, przerywając wyczyszczenie kolejki; blokada `localStorage` mogła przerwać inicjalizację | Dostęp do storage wewnątrz `try`; przy braku pamięci tracker kończy zbieranie i czyści stan w RAM. Nowy test regresji obejmuje start i cofnięcie zgody. |
| `package.json`, `package-lock.json` | `@vercel/routing-utils` zależał od `path-to-regexp@6.1.0`, zgłoszonego jako high przez npm | Override wyłącznie tej zależności do 6.3.0. Astro 7.3.5 i adapter 11.0.11 bez zmian. Bez `npm audit fix --force`. |

Źródło poprawki zależności:
https://github.com/advisories/GHSA-9wv6-86v2-598j
Dotyczy generowania kosztownych regexów dla dwóch parametrów w jednym segmencie.
Nie stwierdzono ataku ani potwierdzonego wykorzystania tej podatności na witrynie.

## Kontrola diffu i danych

- Brak zmian obrazów, globalnego CSS, headera, footera, title, meta, canonical i cen.
- `Layout.astro`: tylko import i osadzenie komponentu skryptowego Analytics;
  bez nowego wrappera wpływającego na układ.
- Brwi / usta / oczy: tylko atrybuty `data-analytics-price` / `data-service-key`.
- Cennik: atrybuty pomiaru oraz istniejąca w PR poprawka brakującego `</nav>`;
  ta naprawa HTML jest oddzielna od Analytics i może wpływać na strukturę DOM.
- CookieConsent zmienia własny interfejs zgód i jego scoped CSS. Nie zmienia układu
  sekcji podstron. Marketing, Analytics i Personalization są niezależnymi wyborami.
- Google Ads i Clarity pozostają; pomiar marketingowy wymaga Marketing.
  Nie zmieniono konfiguracji zewnętrznego celu GA4. Nie wykonano nowego testu konwersji Ads.
- `visitor_id` powstaje po zgodzie Analytics; brak fingerprintingu i odczytu wartości
  formularza przez tracker. `form_submit` jest emitowany po sukcesie wysyłki formularza.
- Sensitive pages: serwer usuwa visitor/session/tab, atrybucję i właściwości profilujące;
  pozostaje `aggregate_only`. Istniejące testy prywatności przechodzą.
- Booksy i telefon oznaczają kliknięcia, nie potwierdzone rezerwacje / rozmowy.
- Origin jest sprawdzany; SQL jest parametryzowany; błędy SQL są redagowane przed logowaniem.
- DATABASE_URL pozostaje w kodzie serwerowym. Skan publicznego wyniku builda nie znalazł
  DATABASE_URL, testowych znaczników sekretów, OIDC ani bibliotek Neon/PGlite.
- Skan zmienionych plików nie znalazł rzeczywistych kluczy / connection strings;
  connection string w `.env.example.analytics` jest wzorem USER/PASSWORD/HOST/DATABASE.
- Nie zmieniono flag ani ENV na Vercel. `rollout.ts` nadal blokuje Production.

## Weryfikacja lokalna

- `npm run test:analytics`: **35/35 PASS** (34 istniejące + 1 test storage).
- `npm run build`: **Complete**. Build Preview z testowymi znacznikami sekretów,
  bez rzeczywistych danych dostępowych i bez połączenia z bazą.
- `npm audit`: **0 podatności** po poprawce; wcześniej 3 alerty z jednego łańcucha zależności.
- `git diff --check`: PASS.
- Końcowy stan Vercel dla nowego commita jest odnotowywany w PR po pushu i kontroli Preview.

## Kolejne bramki, poza tym merge

- Uruchomienie Production: osobna zgoda, kontrola produkcyjnej bazy i ENV, jawne zdjęcie
  blokady rollout oraz smoke test i pomiary performance.
- `price_view` ma próg 50% widoczności całej sekcji: może pomijać sekcje wyższe niż
  dwa viewporty. Potwierdzony test zdarzenia nie dowodzi pomiaru każdej kategorii na mobile.
  Sprawdzić konkretne wysokie sekcje przed używaniem wyników do decyzji biznesowych.
- Widok `pa_v_ai_session_performance` łączy RAW z każdym AI touch sesji i może zwielokrotniać
  liczby zdarzeń przy wielu touchach. Wymaga deduplikacji przed dashboardem; RAW nie jest
  przez to uszkodzony. Nie wykonywano migracji ani zmian baz w tym etapie.
- Obecne duration sesji nie jest aktywnym czasem czytania. Nie przedstawiać go tak w panelu.
- GSC, Ads, Senuto i osobny dashboard dopiero według kolejnych etapów master planu.

Scalenie nie oznacza zgody na uruchomienie Analytics na Production.
