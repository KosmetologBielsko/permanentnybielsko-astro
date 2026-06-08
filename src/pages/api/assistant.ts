import type { APIRoute } from "astro";
import OpenAI from "openai";

export const prerender = false;

type AssistantRequestBody = {
  message?: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

const booksyUrl =
  "https://booksy.com/pl-pl/104871_boguslawa-herda-permanentny-make-up_salon-kosmetyczny_12680_bielsko-biala";

const phone = "+48 730 900 125";

const routePaths = [
  "/makijaz-permanentny-brwi/",
  "/makijaz-permanentny-ust/",
  "/makijaz-permanentny-oczu/",
  "/usuwanie-makijazu-permanentnego/",
  "/cennik-makijaz-permanentny/",
  "/galeria/",
  "/kontakt/",
  "/szkolenia/",
  "/szkolenie-makijaz-permanentny/",
  "/sercemmalowane/",
];

const systemInstructions = `
Jesteś AI Asystentem PMU dla strony permanentnybielsko.com gabinetu Bogusława Herda Makijaż Permanentny & Kosmetologia Estetyczna w Bielsku-Białej.

CEL:
Pomagasz klientce wybrać właściwy kierunek zabiegu, zrozumieć usługę i przejść do rezerwacji przez Booksy, telefonu, konsultacji albo właściwej podstrony.

STYL:
- język polski,
- forma grzecznościowa: Pani / Panią,
- spokojnie, elegancko, ekspercko, ciepło,
- krótko i konkretnie,
- bez nachalnej sprzedaży,
- bez przesadnych obietnic.

WAŻNE:
- Nazwisko Herda zawsze pozostaje nieodmienione.
- Nie pisz: Herdy, Herdzie, Herdą.
- Poprawnie: Bogusława Herda, Bogusławy Herda, gabinet Bogusława Herda.

ZASADY BEZPIECZEŃSTWA:
- Nie diagnozuj chorób.
- Nie zastępuj lekarza.
- Nie kwalifikuj ostatecznie do zabiegu.
- Nie obiecuj efektu 1:1.
- Nie obiecuj trwałości pigmentu.
- Nie mów, że zabieg „na pewno można wykonać”.
- Przy ciąży, karmieniu, lekach, chorobach, alergiach, opryszczce, świeżych zabiegach, aktywnych zmianach skórnych albo problemach z gojeniem kieruj do kontaktu z gabinetem lub lekarzem.

FORMAT ODPOWIEDZI:
- Maksymalnie 2 krótkie akapity.
- Nie pisz długich odpowiedzi.
- Nie używaj słowa „widget”.
- Nie pisz: „widget powinien pokazać przycisk”.
- Nie pisz: „kliknij przycisk poniżej”.
- Nie wypisuj pełnego linku Booksy w treści odpowiedzi.
- Nie wypisuj telefonu w treści odpowiedzi, chyba że klientka pyta dokładnie o numer telefonu.
- Nie pokazuj technicznych cytowań, przypisów ani znaczników źródeł typu filecite.
- Jeśli warto pokazać podstronę, podaj tylko ścieżkę, np. /usuwanie-makijazu-permanentnego/.
- Nie kończ każdej odpowiedzi pełną listą: podstrona, telefon, Booksy.

ODPOWIEDZI:
- Najpierw odpowiedz na pytanie.
- Potem dodaj jedno ważne zastrzeżenie, jeśli temat tego wymaga.
- Na końcu wskaż jeden najwłaściwszy następny krok.
- Jeśli nie masz pewności, powiedz uczciwie, że ostateczna decyzja wymaga konsultacji w gabinecie.

USTA I MODELOWANIE:
Jeżeli klientka pyta o kolejność makijażu permanentnego ust i powiększania/modelowania ust, odpowiedz ostrożnie:
- jeśli planowane jest modelowanie lub powiększanie ust, najczęściej najpierw warto ustabilizować kształt i objętość, a dopiero po wygojeniu i ustabilizowaniu efektu planować pigmentację,
- jeśli celem jest tylko kolor i odświeżenie czerwieni wargowej, można omawiać sam makijaż permanentny ust,
- ostateczna kolejność powinna być ustalona po konsultacji.

LINKI WEWNĘTRZNE:
- Brwi: /makijaz-permanentny-brwi/
- Usta: /makijaz-permanentny-ust/
- Kreski / oczy: /makijaz-permanentny-oczu/
- Usuwanie lub korekta starego PMU: /usuwanie-makijazu-permanentnego/
- Cennik: /cennik-makijaz-permanentny/
- Galeria: /galeria/
- Kontakt: /kontakt/
- Szkolenia: /szkolenia/
- Sercem Malowane: /sercemmalowane/
- Kosmetologia: https://kosmetologiabielsko.com

KOSMETOLOGIA:
Jeżeli pytanie dotyczy kosmetologii, zabiegów na twarz, ciało, SkinPen, DermaPulse, Contour Sculpt, biostymulatorów, mezoterapii, modelowania ust lub pielęgnacji skóry, wyjaśnij krótko, że ten obszar jest na osobnej stronie kosmetologiabielsko.com.

FINALNY CEL:
Każda odpowiedź ma realnie pomagać klientce i możliwie naturalnie prowadzić do: Booksy, telefonu, konsultacji albo odpowiedniej podstrony.
`;

function getEnvValue(name: string) {
  const fromImportMeta = import.meta.env?.[name];
  const fromProcess = process.env?.[name];

  return String(fromImportMeta || fromProcess || "").trim();
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getLocalAnswer(message: string) {
  const q = normalizeText(message);

  if (q.includes("opini") && q.includes("booksy")) {
    return "Nie mam w tej chwili pewnego, aktualnego podglądu liczby opinii na Booksy, więc nie chcę podawać Pani nieaktualnej wartości.\n\nNajlepiej sprawdzić to bezpośrednio w profilu Booksy gabinetu Bogusława Herda, gdzie liczba opinii i komentarze są aktualizowane na bieżąco.";
  }

  if (
    q === "cena i rezerwacja" ||
    q.includes("ile koszt") ||
    q.includes("cennik") ||
    (q.includes("cena") && q.includes("rezerw"))
  ) {
    return "Aktualne ceny najlepiej sprawdzić w cenniku oraz przy konkretnej usłudze w Booksy. Jeśli nie jest Pani pewna, którą usługę wybrać, najbezpieczniej zacząć od konsultacji.\n\n/cennik-makijaz-permanentny/";
  }

  if (q.includes("lip light")) {
    return "Lip Light to dodatek związany z makijażem permanentnym ust. Służy subtelnemu rozświetleniu i odświeżeniu efektu, ale nie jest zabiegiem powiększania ust.\n\nAktualną cenę najlepiej sprawdzić w cenniku lub przy usłudze w Booksy. /cennik-makijaz-permanentny/";
  }

  if (
    q.includes("powieksz") &&
    q.includes("ust") &&
    (q.includes("makijaz") || q.includes("permanent"))
  ) {
    return "Jeśli planowane jest modelowanie lub powiększanie ust, najczęściej najpierw warto ustabilizować kształt i objętość ust, a dopiero po wygojeniu planować makijaż permanentny.\n\nJeśli celem jest tylko kolor i odświeżenie czerwieni wargowej, kierunek można omówić przy konsultacji PMU ust. /makijaz-permanentny-ust/";
  }

  if (q.includes("skinpen") || q.includes("dermapulse") || q.includes("contour sculpt")) {
    return "To pytanie dotyczy kosmetologii estetycznej, a nie bezpośrednio makijażu permanentnego. Ten obszar jest opisany na osobnej stronie Bogusława Herda Kosmetologia Estetyczna.\n\nhttps://kosmetologiabielsko.com";
  }

  if (
    q.includes("chce sie umowic") ||
    q.includes("chcę się umówić") ||
    q.includes("umowic na wizyte") ||
    q.includes("umówić na wizytę") ||
    q.includes("wolny termin")
  ) {
    return "Najwygodniej umówić wizytę przez Booksy, wybierając odpowiednią usługę lub konsultację.\n\nJeśli nie jest Pani pewna, który zabieg wybrać, najlepiej zacząć od konsultacji w gabinecie.";
  }

  if (
    q.includes("numer telefonu") ||
    q.includes("telefon do gabinetu") ||
    q.includes("jaki jest telefon") ||
    q.includes("kontakt telefon")
  ) {
    return "Numer telefonu do gabinetu Bogusława Herda: +48 730 900 125.\n\nMoże Pani zadzwonić w sprawie rezerwacji, konsultacji albo wyboru właściwej usługi.";
  }

  return null;
}

function getOutputText(response: any): string {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const chunks: string[] = [];

  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;

    for (const part of item.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string") {
        chunks.push(part.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function cleanAssistantAnswer(answer: string) {
  let cleaned = answer
    .replace(/\uE200[^\uE201]*\uE201/g, "")
    .replace(new RegExp(escapeRegExp(booksyUrl), "g"), "Booksy")
    .replace(/[-–—]?\s*widget powinien pokazać przycisk rezerwacji\.?/gi, "")
    .replace(/kliknij przycisk poniżej\.?/gi, "")
    .replace(/skorzystaj z przycisku poniżej\.?/gi, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  for (const routePath of routePaths) {
    const routeRegex = new RegExp(`(${escapeRegExp(routePath)})(?=\\s+[A-ZĄĆĘŁŃÓŚŹŻ])`, "g");
    cleaned = cleaned.replace(routeRegex, "$1\n\n");
  }

  return cleaned.trim();
}

function cleanMessage(message: string) {
  return message.replace(/\s+/g, " ").trim().slice(0, 900);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = getEnvValue("OPENAI_API_KEY");
    const vectorStoreId = getEnvValue("OPENAI_VECTOR_STORE_ID");
    const model = getEnvValue("OPENAI_ASSISTANT_MODEL") || "gpt-5.5";

    if (!apiKey) {
      return jsonResponse(
        { error: "Brakuje OPENAI_API_KEY w zmiennych środowiskowych." },
        500
      );
    }

    if (!vectorStoreId) {
      return jsonResponse(
        { error: "Brakuje OPENAI_VECTOR_STORE_ID w zmiennych środowiskowych." },
        500
      );
    }

    const body = (await request.json()) as AssistantRequestBody;
    const message = cleanMessage(body.message ?? "");

    if (!message) {
      return jsonResponse({ error: "Brakuje treści pytania." }, 400);
    }

    const localAnswer = getLocalAnswer(message);

    if (localAnswer) {
      return jsonResponse({
        answer: cleanAssistantAnswer(localAnswer),
        cta: {
          booksyUrl,
          phone,
        },
      });
    }

    const safeHistory = (body.history ?? [])
      .filter(
        (entry) =>
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string" &&
          entry.content.trim().length > 0
      )
      .slice(-3)
      .map((entry) => ({
        role: entry.role,
        content: entry.content.replace(/\s+/g, " ").trim().slice(0, 650),
      }));

    const input = [
      ...safeHistory.map((entry) => ({
        role: entry.role,
        content: [
          {
            type: entry.role === "user" ? "input_text" : "output_text",
            text: entry.content,
          },
        ],
      })),
      {
        role: "user" as const,
        content: [
          {
            type: "input_text" as const,
            text: message,
          },
        ],
      },
    ];

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model,
      instructions: systemInstructions,
      input,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          max_num_results: 3,
        },
      ],
      max_output_tokens: 360,
      store: false,
    });

    const rawAnswer =
      getOutputText(response) ||
      "Nie udało mi się przygotować odpowiedzi. Proszę skontaktować się z gabinetem telefonicznie albo przez Booksy.";

    const answer = cleanAssistantAnswer(rawAnswer);

    return jsonResponse({
      answer,
      cta: {
        booksyUrl,
        phone,
      },
    });
  } catch (error) {
    console.error("Assistant API error:", error);

    return jsonResponse(
      {
        error:
          "Asystent chwilowo nie może odpowiedzieć. Proszę skorzystać z Booksy albo zadzwonić do gabinetu.",
        cta: {
          booksyUrl,
          phone,
        },
      },
      500
    );
  }
};