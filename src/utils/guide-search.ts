/** Proste wyszukiwanie po słowach, niezależnie od ich kolejności i polskich znaków. */
export function normalizeGuideText(value: string): string {
  return value.toLocaleLowerCase("pl").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function terms(value: string): string[] {
  return normalizeGuideText(value).split(" ").filter(Boolean).map(word => {
    if (/^(cen[ayie]|cene|cenach|koszt\w*)$/.test(word)) return "cena";
    if (/^(gojen\w*|goj[ai]|goic)$/.test(word)) return "goj";
    if (/^(kresk\w*|eyeliner\w*)$/.test(word)) return "kresk";
    if (/^(ust|usta|ustach|ustami|ustom|usty)$/.test(word)) return "usta";
    if (/^tlust\w*$/.test(word)) return "tlust";
    if (/^stary?\w*$/.test(word)) return "star";
    if (/^(myci\w*|myc|myj\w*)$/.test(word)) return "myc";
    return word;
  });
}

const stopWords = new Set(["ile", "jak", "czy", "w", "a", "i", "na", "do", "o", "to", "sie", "jest"]);
export function guideMatchScore(text: string, title: string, query: string): number {
  const queryTerms = terms(query).filter(word => !stopWords.has(word));
  if (!queryTerms.length) return 0;
  const haystack = terms(text).join(" ");
  if (!queryTerms.every(word => haystack.includes(word))) return -1;
  const headline = terms(title).join(" ");
  return queryTerms.reduce((score, word) => score + (headline.includes(word) ? 2 : 0), 0);
}
