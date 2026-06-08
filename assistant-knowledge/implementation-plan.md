# Plan wdrożenia AI Asystenta PMU

## Etap 1 — baza wiedzy

1. Sprawdzić i dopracować pliki Markdown.
2. Uzupełnić o realne ceny, jeśli mają być podawane.
3. Uzupełnić o pełne zalecenia przed i po zabiegu, jeśli gabinet chce, aby asystent je cytował.
4. Wgrać pliki do OpenAI Vector Store.
5. Zapisać VECTOR_STORE_ID.

## Etap 2 — endpoint Astro

Plik:
src/pages/api/assistant.ts

Endpoint ma:
- przyjmować pytanie użytkowniczki,
- wysyłać je do OpenAI Responses API,
- używać file_search z VECTOR_STORE_ID,
- zwracać krótką odpowiedź,
- nie ujawniać klucza API po stronie klienta.

Zmienne Vercel:
OPENAI_API_KEY
OPENAI_VECTOR_STORE_ID

## Etap 3 — widget frontowy

Plik:
src/components/AssistantWidget.astro

Funkcje:
- przycisk „Zapytaj o PMU”,
- szybkie tematy,
- pole wpisywania pytania,
- odpowiedź asystenta,
- CTA do Booksy i telefonu,
- tracking kliknięć.

## Etap 4 — testy

1. Test minimum 45 pytań z pliku test-questions.md.
2. Sprawdzić, czy asystent nie diagnozuje.
3. Sprawdzić, czy asystent nie wymyśla cen.
4. Sprawdzić, czy prowadzi do Booksy.
5. Sprawdzić, czy przy kosmetologii kieruje do kosmetologiabielsko.com.
6. Sprawdzić mobile.

## Etap 5 — analityka

Zdarzenia:
- assistant_open
- assistant_question_sent
- assistant_booksy_click
- assistant_phone_click
- assistant_service_link_click
- assistant_medical_safety_case
- assistant_unknown_case

Najważniejsze konwersje:
- assistant_booksy_click
- assistant_phone_click
