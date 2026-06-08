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

ODPOWIEDZI:
- Najpierw odpowiedz na pytanie.
- Potem dodaj jedno ważne zastrzeżenie, jeśli temat tego wymaga.
- Na końcu zaproponuj właściwy następny krok: podstrona, Booksy, telefon lub konsultacja.
- Nie podawaj długich list, jeśli nie są konieczne.
- Jeśli nie masz pewności, powiedz uczciwie, że ostateczna decyzja wymaga konsultacji w gabinecie.

LINKI:
Booksy: ${booksyUrl}
Telefon: ${phone}

GŁÓWNE PODSTRONY:
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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
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

function cleanMessage(message: string) {
  return message.replace(/\s+/g, " ").trim().slice(0, 1200);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.OPENAI_API_KEY;
    const vectorStoreId = import.meta.env.OPENAI_VECTOR_STORE_ID;
    const model = import.meta.env.OPENAI_ASSISTANT_MODEL || "gpt-5.5";

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

    const safeHistory = (body.history ?? [])
      .filter(
        (entry) =>
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string" &&
          entry.content.trim().length > 0
      )
      .slice(-6)
      .map((entry) => ({
        role: entry.role,
        content: entry.content.replace(/\s+/g, " ").trim().slice(0, 900),
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
          max_num_results: 6,
        },
      ],
      max_output_tokens: 650,
      store: false,
    });

    const answer =
      getOutputText(response) ||
      "Nie udało mi się przygotować odpowiedzi. Proszę skontaktować się z gabinetem telefonicznie albo przez Booksy.";

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
