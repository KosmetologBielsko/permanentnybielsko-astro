export const siteConfig = {
  siteUrl: "https://permanentnybielsko.com",
  previewUrl: "https://permanentnybielsko-astro.vercel.app",
  name: "Bogusława Herda Makijaż Permanentny",
  alternateName: "PermanentnyBielsko",
  businessName: "Bogusława Herda Makijaż Permanentny & Kosmetologia Estetyczna",
  defaultTitle: "Makijaż permanentny Bielsko-Biała | Bogusława Herda",
  defaultDescription:
    "Makijaż permanentny Bielsko-Biała: naturalne brwi, usta i kreski, Silky Hairstroke Brows, usuwanie makijażu permanentnego i szkolenia Long-Time-Liner.",
  defaultOgImage: "/images/hero-boguslawa-herda-pmu-cutout.webp",
  defaultOgImageAlt:
    "Bogusława Herda — makijaż permanentny Bielsko-Biała, trenerka Long-Time-Liner®",
  phone: "+48 730 900 125",
  email: "bogusia@permanentnybielsko.com",
  booksyUrl:
    "https://booksy.com/pl-pl/104871_boguslawa-herda-permanentny-make-up_salon-kosmetyczny_12680_bielsko-biala",
  address: {
    streetAddress: "ul. Barlickiego 5/23",
    postalCode: "43-300",
    addressLocality: "Bielsko-Biała"
  },
  geo: {
    latitude: 49.8224,
    longitude: 19.0441
  },
  sameAs: [
    "https://www.instagram.com/permanentnybielsko",
    "https://www.facebook.com/PermanentnyBielsko",
    "https://kosmetologiabielsko.com"
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "14:00"
    }
  ],

  // WAŻNE:
  // Na roboczej wersji Vercel zostawiamy false, żeby Google nie indeksował strony przed migracją.
  // Przed finalnym przepięciem domeny permanentnybielsko.com zmienimy na true.
  indexingEnabled: false
} as const;

export const getCanonicalUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteConfig.siteUrl).toString();
};

export const getOgImageUrl = (path = siteConfig.defaultOgImage) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, siteConfig.siteUrl).toString();
};
