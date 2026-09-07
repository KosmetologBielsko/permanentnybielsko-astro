# AI Asystent PMU — instrukcja wdrożenia v1

## VS Code / pliki

1. Wklej foldery i pliki z tej paczki do projektu:

- assistant-knowledge/
- scripts/upload-assistant-knowledge.mjs
- src/pages/api/assistant.ts
- src/components/AssistantWidget.astro
- .env.example

2. Do folderu `assistant-knowledge/` wklej pliki .md i .json z paczki:
`permanentnybielsko-ai-asystent-v1.zip`

3. W pliku `.env` lokalnie dodaj:

OPENAI_API_KEY=...
OPENAI_ASSISTANT_MODEL=gpt-5.5

Na tym etapie nie masz jeszcze:
OPENAI_VECTOR_STORE_ID

Uzyskasz go po uruchomieniu skryptu.

## Terminal VS Code / PowerShell

Najpierw instalacja biblioteki OpenAI:

npm.cmd install openai

Potem wgranie bazy wiedzy do OpenAI Vector Store:

node scripts/upload-assistant-knowledge.mjs

Po zakończeniu skrypt pokaże:

OPENAI_VECTOR_STORE_ID=vs_...

Skopiuj ten identyfikator do pliku `.env` lokalnie oraz później do Vercel Environment Variables.

## VS Code / Layout

W głównym layoucie strony dodaj import:

import AssistantWidget from "../components/AssistantWidget.astro";

A przed zamknięciem body dodaj:

<AssistantWidget />

Jeśli ścieżka do komponentu jest inna względem Twojego Layout.astro, dopasuj tylko początek ścieżki.

## Terminal VS Code / PowerShell

Test lokalny:

npm.cmd run build
npm.cmd run dev

## Przeglądarka

Sprawdź:

http://localhost:4321/

Kliknij:
Zapytaj o PMU

Przetestuj pytania:

- Chcę naturalne brwi, co wybrać?
- Mam stare sine brwi, czy można poprawić?
- Czy makijaż permanentny ust powiększa usta?
- Mam opryszczkę, czy mogę zrobić usta?
- Ile kosztują brwi?
- Czy można w ciąży?
- Czy robicie SkinPen?
- Czy prowadzicie szkolenia?

## Vercel

Dodaj zmienne środowiskowe:

OPENAI_API_KEY
OPENAI_VECTOR_STORE_ID
OPENAI_ASSISTANT_MODEL

Potem commit i push.

## Terminal VS Code / PowerShell — APP

npm.cmd run build
& "C:\Program Files\Git\cmd\git.exe" status
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "Add AI PMU assistant"
& "C:\Program Files\Git\cmd\git.exe" push

## Ważne

Jeśli build pokaże błąd związany z endpointem API / SSR / adapterem, trzeba będzie sprawdzić `astro.config.mjs` i ewentualnie dodać konfigurację Vercel adaptera. Nie zmieniamy tego na ślepo przed testem, żeby nie ruszać stabilnej strony.
