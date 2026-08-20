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
    Poradnik PMU — regionalne wpisy Bielsko-Biała
  */
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — wpisy konkurencyjne / decyzyjne Bielsko-Biała
  */
  {
    path: "/poradnik/jak-wybrac-gabinet-makijazu-permanentnego-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala-cena/",
    priority: "0.88",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/tani-makijaz-permanentny-bielsko-biala/",
    priority: "0.86",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/naturalny-makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.88",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-bielsko-biala/",
    priority: "0.88",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — wpisy cenowe / Senuto
  */
  {
    path: "/poradnik/makijaz-permanentny-brwi-cena/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/odswiezenie-makijazu-permanentnego-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kurs-makijazu-permanentnego-cena/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — zaawansowane wpisy edukacyjne / Senuto
  */
  {
    path: "/poradnik/brwi-permanentne-dzien-po-dniu/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-mozna-myc-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czym-smarowac-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/microblading-a-makijaz-permanentny-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metoda-piorkowa-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/laserowe-usuwanie-brwi-permanentnych/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-gojenie/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/usta-permanentne-po-wygojeniu/",
    priority: "0.78",
    changefreq: "monthly"
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

  /*
    Poradnik PMU — nowe eksperckie wpisy 2026
  */
  {
    path: "/poradnik/makijaz-permanentny-przed-wakacjami/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-dlugo-utrzymuje-sie-makijaz-permanentny/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czy-mozna-cwiczyc-po-makijazu-permanentnym/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/retinol-kwasy-a-makijaz-permanentny/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/botoks-a-makijaz-permanentny-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kwas-hialuronowy-w-ustach-a-makijaz-permanentny/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/dlaczego-makijaz-permanentny-zmienia-kolor/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/dlaczego-brwi-permanentne-sa-ciemne-po-zabiegu/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/dlaczego-pigment-po-wygojeniu-miejscami-znika/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czy-kazda-skora-nadaje-sie-do-metody-wloskowej/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/skora-tlusta-a-brwi-permanentne/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/skora-dojrzala-a-makijaz-permanentny/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-na-bliznie/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-a-rezonans-magnetyczny-mri/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/reakcja-alergiczna-czy-normalne-gojenie-po-pmu/",
    priority: "0.82",
    changefreq: "monthly"
  },


  /*
    Poradnik PMU — najnowsze wpisy 2026 / Senuto
  */
  {
    path: "/poradnik/brwi-permanentne-po-latach/",
    priority: "0.86",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-ust/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreski-permanentne-cieniowane/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/skutki-uboczne-makijazu-permanentnego-brwi/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/przeciwwskazania-do-makijazu-permanentnego/",
    priority: "0.86",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/ile-trwa-zabieg-makijazu-permanentnego/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-zageszczajaca-linie-rzes/",
    priority: "0.84",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czy-makijaz-permanentny-boli/",
    priority: "0.86",
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