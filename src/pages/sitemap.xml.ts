import type { APIRoute } from "astro";
import { siteConfig } from "../config/site";

const pages = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-bielsko/",
    priority: "0.95",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-brwi/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-ust/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-oczu/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/usuwanie-makijazu-permanentnego/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/cennik-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/galeria/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/szkolenie-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/",
    priority: "0.86",
    changefreq: "weekly"
  },

  /*
    Poradnik PMU — artykuły fundamenty
  */
  {
    path: "/poradnik/jak-przygotowac-sie-do-makijazu-permanentnego-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-goja-sie-brwi-permanentne/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czego-nie-wolno-po-makijazu-permanentnym-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/silky-hairstroke-brows-naturalny-wlos-maszynowy/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metody-brwi-permanentnych-ombre-pudrowe-wloskowe/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/rysunek-wstepny-przed-makijazem-permanentnym/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-usuwac-stary-makijaz-permanentny/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-brwi-co-zrobic/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-jak-wybrac-kolor/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-gojenie-dzien-po-dniu/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/opryszczka-a-makijaz-permanentny-ust/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-jak-wybrac-rodzaj/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-przy-opadajacej-powiece/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-wybrac-szkolenie-pmu/",
    priority: "0.7",
    changefreq: "monthly"
  },

  {
    path: "/sercemmalowane/",
    priority: "0.6",
    changefreq: "monthly"
  },
  {
    path: "/kontakt/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/regulamin-salonu/",
    priority: "0.35",
    changefreq: "yearly"
  },
  {
    path: "/rodo-polityka-prywatnosci-regulamin/",
    priority: "0.3",
    changefreq: "yearly"
  }
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, siteConfig.siteUrl).toString();

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
