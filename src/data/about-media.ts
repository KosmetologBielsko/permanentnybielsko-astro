import type { ImageMetadata } from "astro";
import hero from "../assets/o-mnie/boguslawa-herda-portret-czarno-bialy.webp";
import world from "../assets/o-mnie/boguslawa-herda-world-pmu-industry-wicemistrzostwo-2023.webp";
import poland from "../assets/o-mnie/boguslawa-herda-mistrzostwo-polski-2019-puchar.webp";
import trainerDegree from "../assets/o-mnie/boguslawa-herda-praca-dyplomowa-ksztalcenie.webp";
import degree from "../assets/o-mnie/boguslawa-herda-studia-podyplomowe-kosmetologia.webp";
import advanced from "../assets/o-mnie/boguslawa-herda-studia-podyplomowe-kosmetologia-zaawansowana.webp";
import heart from "../assets/o-mnie/boguslawa-herda-ambasador-serca-long-time-liner.webp";
import license from "../assets/o-mnie/boguslawa-herda-pierwsza-licencja-long-time-liner-2017.webp";
import trainer from "../assets/o-mnie/boguslawa-herda-szkolenia-long-time-liner.webp";
import ankara from "../assets/o-mnie/boguslawa-herda-warsztaty-silky-ankara-hero.webp";
import munich from "../assets/o-mnie/boguslawa-herda-masterclass-monachium-2024.webp";
import lyon from "../assets/o-mnie/boguslawa-herda-new-generation-lyon-jurorka-plakat.webp";
import dusseldorf from "../assets/o-mnie/boguslawa-herda-warsztaty-dusseldorf-silky-brows-2022.webp";

// Fotografie i materiały z archiwum właściciela. Obrazy optymalizuje Astro.
export const aboutMedia = {
  hero: { src: hero, alt: "Bogusława Herda — portret czarno-biały" },
  world: { src: world, alt: "Bogusława Herda z nagrodą za drugie miejsce World PMU Industry Convention 2023" },
  poland: { src: poland, alt: "Bogusława Herda z pucharem mistrzyni Polski Long-Time-Liner 2019" },
  trainerDegree: { src: trainerDegree, alt: "Bogusława Herda z pracą dyplomową — Trener linergista" },
  degree: { src: degree, alt: "Bogusława Herda podczas zakończenia studiów podyplomowych w kosmetologii" },
  advanced: { src: advanced, alt: "Bogusława Herda z kadrą uczelni po kolejnym etapie edukacji kosmetologicznej" },
  heart: { src: heart, alt: "Bogusława Herda z wyróżnieniem Ambasador Serca Long-Time-Liner" },
  license: { src: license, alt: "Bogusława Herda z Magdą Bogulak i dyplomem Licencji I Long-Time-Liner" },
  trainer: { src: trainer, alt: "Bogusława Herda z zespołem Long-Time-Liner" },
  ankara: { src: ankara, alt: "Bogusława Herda przy stanowisku pigmentacji podczas warsztatów w Ankarze" },
  munich: { src: munich, alt: "Program Masterclass Long-Time-Liner Monachium 2024 z techniką Silky" },
  lyon: { src: lyon, alt: "Plakat New Generation Lyon 2026 — Bogusława Herda, jurorka Hairstroke" },
  dusseldorf: { src: dusseldorf, alt: "Oryginalny materiał warsztatów Silky w Düsseldorfie w czerwcu 2022" },
} as const satisfies Record<string, { src: ImageMetadata; alt: string }>;
