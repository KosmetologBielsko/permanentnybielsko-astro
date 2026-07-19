import type { APIRoute } from "astro";

export const prerender = false;

type PmuLeadBody = {
  name?: string;
  phone?: string;
  service?: string;
  old_pmu?: string;
  message?: string;
  consent?: string;
  website?: string;
  page?: string;
};

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

function clean(value: unknown, maxLength = 600) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse({ error: "Nieprawidłowy format zapytania." }, 415);
    }

    const body = (await request.json()) as PmuLeadBody;

    // Honeypot antyspamowy — prawdziwa klientka tego pola nie wypełni.
    if (clean(body.website, 200)) {
      return jsonResponse({ ok: true });
    }

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 80);
    const service = clean(body.service, 160);
    const oldPmu = clean(body.old_pmu, 120);
    const message = clean(body.message, 1000);
    const page = clean(body.page, 240);

    if (!phone || phone.length < 6) {
      return jsonResponse(
        { error: "Podaj numer telefonu, żebyśmy mogli odpowiedzieć na zapytanie." },
        400
      );
    }

    if (!body.consent) {
      return jsonResponse(
        { error: "Zgoda na kontakt jest wymagana, aby wysłać zapytanie." },
        400
      );
    }

    const resendApiKey = getEnvValue("RESEND_API_KEY");
    const toEmail =
      getEnvValue("CONTACT_TO_EMAIL") || "bogusia@permanentnybielsko.com";
    const fromEmail =
      getEnvValue("CONTACT_FROM_EMAIL") ||
      "formularz@send.permanentnybielsko.com";

    if (!resendApiKey) {
      console.error("PMU lead form error: missing RESEND_API_KEY");

      return jsonResponse(
        { error: "Brakuje konfiguracji wysyłki formularza." },
        500
      );
    }

    const subject = `Nowe zapytanie PMU — ${service || "kwalifikacja"}`;

    const text = [
      "Nowe zapytanie z formularza PMU",
      "",
      `Imię: ${name || "-"}`,
      `Telefon: ${phone}`,
      `Usługa: ${service || "-"}`,
      `Czy był wcześniej PMU: ${oldPmu || "-"}`,
      `Strona: ${page || "-"}`,
      "",
      "Wiadomość:",
      message || "-",
    ].join("\n");

    const html = `
      <div style="margin:0;padding:24px;background:#f7f7f7;font-family:Arial,sans-serif;color:#17151d;">
        <div style="max-width:680px;margin:0 auto;padding:28px;background:#ffffff;border-radius:20px;border:1px solid #ece7e9;">
          <p style="margin:0 0 8px;color:#0f7773;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
            Permanentny Bielsko
          </p>

          <h2 style="margin:0 0 24px;font-size:26px;line-height:1.2;">
            Nowe zapytanie z formularza PMU
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
            <tr>
              <td style="width:180px;padding:8px 0;font-weight:700;vertical-align:top;">Imię</td>
              <td style="padding:8px 0;">${escapeHtml(name || "-")}</td>
            </tr>
            <tr>
              <td style="width:180px;padding:8px 0;font-weight:700;vertical-align:top;">Telefon</td>
              <td style="padding:8px 0;">
                <a href="tel:${escapeHtml(phone)}" style="color:#0f7773;text-decoration:none;">
                  ${escapeHtml(phone)}
                </a>
              </td>
            </tr>
            <tr>
              <td style="width:180px;padding:8px 0;font-weight:700;vertical-align:top;">Usługa</td>
              <td style="padding:8px 0;">${escapeHtml(service || "-")}</td>
            </tr>
            <tr>
              <td style="width:180px;padding:8px 0;font-weight:700;vertical-align:top;">Wcześniejszy PMU</td>
              <td style="padding:8px 0;">${escapeHtml(oldPmu || "-")}</td>
            </tr>
            <tr>
              <td style="width:180px;padding:8px 0;font-weight:700;vertical-align:top;">Strona</td>
              <td style="padding:8px 0;">${escapeHtml(page || "-")}</td>
            </tr>
          </table>

          <div style="margin-top:24px;padding-top:22px;border-top:1px solid #ece7e9;">
            <p style="margin:0 0 8px;font-weight:700;">Wiadomość</p>
            <p style="margin:0;white-space:pre-wrap;line-height:1.65;">
              ${escapeHtml(message || "-")}
            </p>
          </div>
        </div>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Permanentny Bielsko <${fromEmail}>`,
        to: [toEmail],
        subject,
        text,
        html,
        tags: [
          {
            name: "source",
            value: "pmu_form",
          },
        ],
      }),
    });

    const resendData = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error("PMU lead Resend error:", {
        status: resendResponse.status,
        response: resendData,
      });

      return jsonResponse(
        {
          error:
            "Nie udało się wysłać zapytania. Prosimy zadzwonić do gabinetu.",
        },
        502
      );
    }

    return jsonResponse({
      ok: true,
      id:
        resendData &&
        typeof resendData === "object" &&
        "id" in resendData
          ? resendData.id
          : undefined,
    });
  } catch (error) {
    console.error("PMU lead form error:", error);

    return jsonResponse(
      {
        error:
          "Nie udało się wysłać zapytania. Prosimy zadzwonić do gabinetu.",
      },
      500
    );
  }
};