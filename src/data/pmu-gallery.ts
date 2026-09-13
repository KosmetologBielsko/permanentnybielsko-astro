// PMU 10: metody według folderów przekazanych przez właściciela.
import mediaLibrary from "./pmu-media-library.json";

export const booksyUrl =
  "https://booksy.com/pl-pl/104871_boguslawa-herda-permanentny-make-up_salon-kosmetyczny_12680_bielsko-biala";

export const pageUrl = "https://www.permanentnybielsko.com/galeria/";
export const pageTitle =
  "Galeria makijażu permanentnego Bielsko-Biała | Bogusława Herda";
export const pageDescription =
  "Galeria PMU Bogusławy Herda w Bielsku-Białej: Silky Hairstroke Brows, brwi metodą cienia, kreski i usta. Zobacz zdjęcia, kompozycje i filmy.";

export const trainingGalleryImages = [
  {
    src: "/images/szkolenia-pmu-elite-top-linergist-boguslawa-herda.webp",
    alt: "Szkolenia PMU — Bogusława Herda Elite Top Linergist",
  },
  {
    src: "/images/szkolenia-pmu-edukacja-long-time-liner-elite.webp",
    alt: "Szkolenia PMU — edukacja Long-Time-Liner i standard Elite",
  },
  {
    src: "/images/szkolenia-pmu-certyfikat-masterclass-long-time-liner.webp",
    alt: "Szkolenia PMU — certyfikat Masterclass Long-Time-Liner",
  },
  {
    src: "/images/szkolenia-pmu-praktyka-zabiegowa-long-time-liner.webp",
    alt: "Szkolenia PMU — praktyka zabiegowa Long-Time-Liner",
  },
  {
    src: "/images/szkolenia-pmu-zespol-long-time-liner-boguslawa-herda.webp",
    alt: "Szkolenia PMU — zespół Long-Time-Liner i Bogusława Herda",
  },
];

export const videoGalleryItems = [
  {
    src: "/video/brwi-permanentne-silky-zblizenie-bez-dzwieku.mp4",
    poster: "/video/brwi-permanentne-silky-zblizenie-poster.webp",
    title: "Brwi permanentne — zbliżenie techniki Silky",
  },
  {
    src: "/video/metamorfozy-pmu-boguslawa-herda.mp4",
    poster: "/video/metamorfozy-pmu-boguslawa-herda-poster.webp",
    title: "Metamorfozy PMU — Bogusława Herda",
  },
  {
    src: "/video/metoda-pracy-makijaz-permanentny-home.mp4",
    poster: "/video/metoda-pracy-makijaz-permanentny-home-poster.webp",
    title: "Metoda pracy w makijażu permanentnym",
  },
  {
    src: "/video/proces-makijazu-permanentnego-boguslawa-herda.mp4",
    poster: "/video/proces-makijazu-permanentnego-boguslawa-herda-poster.webp",
    title: "Proces makijażu permanentnego",
  },
  {
    src: "/video/szkolenia-pmu-autorska-metoda-natural.mp4",
    poster: "/video/szkolenia-pmu-autorska-metoda-natural-poster.webp",
    title: "Szkolenia PMU — autorska metoda Natural",
  },
  {
    src: "/video/szkolenia-pmu-autorska-metoda-soft-glam.mp4",
    poster: "/video/szkolenia-pmu-autorska-metoda-soft-glam-poster.webp",
    title: "Szkolenia PMU — autorska metoda Soft Glam",
  },
];

export const sections = [
  {
    id: "galeria-silky", label: "Silky · włos maszynowy", title: "Silky Hairstroke Brows. Włos maszynowy.",
    text: "Autorska technika Bogusławy Herda. Pigmentowane linie odtwarzają kierunek i układ włosków — zobacz zbliżenia oraz efekt w szerszym kadrze.",
    items: mediaLibrary.silky, serviceHref: "/makijaz-permanentny-brwi/", serviceLabel: "Poznaj brwi Silky",
  },
  {
    id: "galeria-brwi", label: "Brwi · metoda cienia", title: "Brwi metodą cienia. Miękki kolor i kształt.",
    text: "Cieniowanie buduje kolor i kształt brwi. Widoczne naturalne włoski pozostają częścią brwi; nie oznaczają wykonania pigmentacji metodą włoskową.",
    items: mediaLibrary.cien, serviceHref: "/makijaz-permanentny-brwi/", serviceLabel: "Poznaj metodę cienia",
  },
  {
    id: "galeria-kreski", label: "Oczy · kreski", title: "Kreski. Podkreślenie spojrzenia.",
    text: "Zbliżenia linii rzęs i powiek. Porównaj subtelne podkreślenie z bardziej widocznym konturem oraz miękkim wykończeniem.",
    items: mediaLibrary.oczy, serviceHref: "/makijaz-permanentny-oczu/", serviceLabel: "Zobacz ofertę kresek",
  },
  {
    id: "galeria-usta", label: "Usta", title: "Usta. Kolor, kontur i proporcje.",
    text: "Zbliżenia ust oraz kompozycje pokazujące kolor w kontekście twarzy. Zobacz różne odcienie i wykończenia — od satynowych po połysk.",
    items: mediaLibrary.usta, serviceHref: "/makijaz-permanentny-ust/", serviceLabel: "Zobacz ofertę ust",
  },
  {
    id: "galeria-szkolenia", label: "Szkolenia", title: "Praktyka, edukacja i zaplecze eksperckie.",
    text: "Wybrane materiały pokazujące pracę szkoleniową, certyfikację i rozwój warsztatu.",
    items: trainingGalleryImages, serviceHref: "/szkolenie-makijaz-permanentny/", serviceLabel: "Zobacz szkolenia",
  },
];

export const galleryAreas = [
  { label: "Silky", title: "Silky · włos maszynowy", text: "Pigmentowane włoski", href: "#galeria-silky", image: mediaLibrary.silky[2] },
  { label: "Cień", title: "Brwi metodą cienia", text: "Miękki kolor i kształt", href: "#galeria-brwi", image: mediaLibrary.cien[0] },
  { label: "Oczy", title: "Oczy · kreski", text: "Podkreślenie spojrzenia", href: "#galeria-kreski", image: mediaLibrary.oczy[0] },
  { label: "Usta", title: "Usta", text: "Kolor i kontur", href: "#galeria-usta", image: mediaLibrary.usta[22] },
];

export const faqItems = [
  {
    question: "Jakie materiały znajdę w galerii?",
    answer:
      "Galeria obejmuje zbliżenia pigmentacji oraz kompozycje ilustracyjne pokazujące kolor i kształt w kontekście twarzy. Materiały są punktem odniesienia do rozmowy o oczekiwanym efekcie; indywidualny projekt dobieramy podczas kwalifikacji.",
  },
  {
    question: "Czy zdjęcia pokazują tylko świeży efekt?",
    answer:
      "Na podstawie samego zdjęcia nie należy oceniać etapu gojenia ani przewidywać własnego rezultatu. O konkretny materiał i efekt po wygojeniu możesz zapytać gabinet.",
  },
  {
    question: "Czy mogę zobaczyć więcej prac z konkretnego zabiegu?",
    answer:
      "Tak. Z galerii można przejść bezpośrednio do podstron brwi, ust i kresek, gdzie znajdują się dodatkowe materiały i informacje o zabiegu.",
  },
  {
    question: "Czy mogę powiększyć zdjęcia i filmy?",
    answer:
      "Tak. Zdjęcia można otworzyć w dużym podglądzie, a filmy zatrzymać, wznowić i wyświetlić w pełnoekranowym dialogu.",
  },
];

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: "pl-PL",
    dateModified: "2026-09-13",
    isPartOf: {
      "@id": "https://www.permanentnybielsko.com/#website",
    },
    about: {
      "@id": "https://www.permanentnybielsko.com/#localbusiness",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url:
        `https://www.permanentnybielsko.com${mediaLibrary.silky[2].src}`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: "https://www.permanentnybielsko.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Galeria makijażu permanentnego",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#gallery-areas`,
    name: "Zakres galerii makijażu permanentnego",
    itemListElement: galleryAreas.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
      url: `${pageUrl}${item.href}`,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];
