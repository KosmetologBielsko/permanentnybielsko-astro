const BASE_URL = "http://localhost:4321";

const startUrls = [
  "/",
  "/makijaz-permanentny-bielsko/",
  "/makijaz-permanentny-brwi/",
  "/makijaz-permanentny-ust/",
  "/makijaz-permanentny-oczu/",
  "/usuwanie-makijazu-permanentnego/",
  "/szkolenie-makijaz-permanentny/",
  "/cennik-makijaz-permanentny/",
  "/galeria/",
  "/kontakt/",
  "/poradnik/",
  "/sercemmalowane/",
  "/regulamin-salonu/",
  "/rodo-polityka-prywatnosci-regulamin/"
];

const ignoredProtocols = ["mailto:", "tel:", "sms:", "javascript:"];
const ignoredExternalHosts = [
  "booksy.com",
  "www.facebook.com",
  "facebook.com",
  "www.instagram.com",
  "instagram.com",
  "share.google",
  "maps.google.com",
  "google.com"
];

const visitedPages = new Set();
const checkedLinks = new Map();
const brokenLinks = [];

function normalizeInternalUrl(href, currentUrl) {
  try {
    if (!href) return null;
    const trimmed = href.trim();

    if (
      trimmed.startsWith("#") ||
      ignoredProtocols.some((protocol) => trimmed.startsWith(protocol))
    ) {
      return null;
    }

    const url = new URL(trimmed, currentUrl);

    if (url.origin !== BASE_URL) {
      const isIgnoredExternal = ignoredExternalHosts.some((host) =>
        url.hostname.includes(host)
      );

      if (!isIgnoredExternal) {
        console.log(`ZEWNĘTRZNY: ${url.href}`);
      }

      return null;
    }

    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function extractLinks(html) {
  const htmlWithoutScripts = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

  const links = [];
  const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
  let match;

  while ((match = regex.exec(htmlWithoutScripts)) !== null) {
    links.push(match[2]);
  }

  return links;
}

async function checkUrl(url, sourceUrl) {
  if (checkedLinks.has(url)) return checkedLinks.get(url);

  try {
    const response = await fetch(url, { redirect: "follow" });
    const result = {
      url,
      status: response.status,
      ok: response.ok,
      finalUrl: response.url
    };

    checkedLinks.set(url, result);

    if (!response.ok) {
      brokenLinks.push({
        sourceUrl,
        url,
        status: response.status
      });
    }

    return result;
  } catch (error) {
    const result = {
      url,
      status: "ERROR",
      ok: false,
      error: error.message
    };

    checkedLinks.set(url, result);

    brokenLinks.push({
      sourceUrl,
      url,
      status: "ERROR",
      error: error.message
    });

    return result;
  }
}

async function crawlPage(pathOrUrl) {
  const pageUrl = new URL(pathOrUrl, BASE_URL).href;

  if (visitedPages.has(pageUrl)) return;
  visitedPages.add(pageUrl);

  console.log(`\nSPRAWDZAM STRONĘ: ${pageUrl}`);

  const response = await checkUrl(pageUrl, "START");

  if (!response.ok) {
    return;
  }

  const htmlResponse = await fetch(pageUrl);
  const html = await htmlResponse.text();

  const rawLinks = extractLinks(html);
  const internalLinks = rawLinks
    .map((href) => normalizeInternalUrl(href, pageUrl))
    .filter(Boolean);

  for (const link of internalLinks) {
    const result = await checkUrl(link, pageUrl);

    if (result.ok) {
      console.log(`OK ${result.status}: ${link}`);
    } else {
      console.log(`BŁĄD ${result.status}: ${link}`);
    }
  }
}

async function main() {
  console.log("Start sprawdzania linków lokalnie...");
  console.log(`Baza: ${BASE_URL}`);

  for (const url of startUrls) {
    await crawlPage(url);
  }

  console.log("\n==============================");
  console.log("PODSUMOWANIE");
  console.log("==============================");
  console.log(`Sprawdzone strony startowe: ${startUrls.length}`);
  console.log(`Sprawdzone unikalne linki: ${checkedLinks.size}`);

  if (brokenLinks.length === 0) {
    console.log("\n✅ Brak wykrytych błędnych linków wewnętrznych.");
    process.exit(0);
  }

  console.log("\n❌ Wykryto błędne linki:");

  for (const item of brokenLinks) {
    console.log(`\nŹródło: ${item.sourceUrl}`);
    console.log(`Link:   ${item.url}`);
    console.log(`Status: ${item.status}`);
    if (item.error) console.log(`Błąd:   ${item.error}`);
  }

  process.exit(1);
}

main();