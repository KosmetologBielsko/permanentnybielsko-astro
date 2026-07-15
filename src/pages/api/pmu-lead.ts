import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

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
    const body = (await request.json()) as PmuLeadBody;

    // Honeypot antyspamowy — prawdziwa klientka tego nie wypełni.
    if (body.website) {
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

    const smtpHost = getEnvValue("SMTP_HOST");
    const smtpPort = Number(getEnvValue("SMTP_PORT") || "465");
    const smtpUser = getEnvValue("SMTP_USER");
    const smtpPass = getEnvValue("SMTP_PASS");
    const toEmail = getEnvValue("CONTACT_TO_EMAIL") || "bogusia@permanentnybielsko.com";
    const fromEmail = getEnvValue("CONTACT_FROM_EMAIL") || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
      return jsonResponse(
        { error: "Brakuje konfiguracji SMTP dla formularza." },
        500
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

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
      <h2>Nowe zapytanie z formularza PMU</h2>
      <p><strong>Imię:</strong> ${escapeHtml(name || "-")}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Usługa:</strong> ${escapeHtml(service || "-")}</p>
      <p><strong>Czy był wcześniej PMU:</strong> ${escapeHtml(oldPmu || "-")}</p>
      <p><strong>Strona:</strong> ${escapeHtml(page || "-")}</p>
      <hr />
      <p><strong>Wiadomość:</strong></p>
      <p>${escapeHtml(message || "-").replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      from: `"Permanentny Bielsko" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    return jsonResponse({ ok: true });
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