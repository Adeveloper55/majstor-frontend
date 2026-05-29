import {
  SERVICE_CATEGORIES,
  categoryRoutes,
  type ServiceCategory,
} from "@/constants/categories";

import { normalizeText } from "@/lib/textNormalize";

export { normalizeText };

/** Generiše slug iz naziva kategorije. */
export function createSlug(text: string): string {
  return normalizeText(text).replace(/\s+/g, "-").replace(/-+/g, "-");
}

/** Sinonimi → slugovi kategorija */
const SYNONYM_TO_SLUGS: Record<string, string[]> = {
  krov: ["majstori-za-krov", "pranje-dvorista-fasade-krova"],
  moler: ["krecenje-moler"],
  farbanje: ["krecenje-moler"],
  krecenje: ["krecenje-moler"],
  struja: ["elektroinstalacije-elektricar"],
  elektricar: ["elektroinstalacije-elektricar"],
  elektro: ["elektroinstalacije-elektricar"],
  voda: ["vodoinstalater"],
  vodovod: ["vodoinstalater"],
  plocice: ["lepljenje-plocica", "keramika-keramicar"],
  keramika: ["keramika-keramicar"],
  kupatilo: ["renoviranje-kupatila"],
  prozori: ["pvc-prozori", "drveni-prozori", "obnova-drvenih-prozora"],
  fasada: ["fasade", "pranje-dvorista-fasade-krova"],
  fasade: ["fasade"],
  klima: ["klima-uredjaji-ugradnja-klime"],
  selidba: ["selidbe"],
  selidbe: ["selidbe"],
  stolar: ["stolar"],
  parket: ["parketari", "laminati"],
  krečenje: ["krecenje-moler"],
  ciscenje: ["agencija-za-ciscenje", "ciscenje-dimnjaka"],
  ciscenje: ["agencija-za-ciscenje", "ciscenje-dimnjaka"],
};

interface IndexedCategory {
  category: ServiceCategory;
  searchText: string;
  tokens: string[];
}

let indexedCache: IndexedCategory[] | null = null;

function getIndexedCategories(): IndexedCategory[] {
  if (indexedCache) return indexedCache;

  indexedCache = SERVICE_CATEGORIES.map((category) => {
    const nameNorm = normalizeText(category.name);
    const slugNorm = normalizeText(category.slug.replace(/-/g, " "));
    const synonymTerms = Object.entries(SYNONYM_TO_SLUGS)
      .filter(([, slugs]) => slugs.includes(category.slug))
      .map(([term]) => term);
    const searchText = [nameNorm, slugNorm, ...synonymTerms].join(" ");
    const tokens = searchText.split(" ").filter(Boolean);
    return { category, searchText, tokens };
  });

  return indexedCache;
}

function scoreMatch(query: string, queryTokens: string[], item: IndexedCategory): number {
  const { category, searchText, tokens } = item;
  const slugNorm = normalizeText(category.slug.replace(/-/g, " "));
  const nameNorm = normalizeText(category.name);

  if (query === slugNorm || query === nameNorm) return 100;
  if (category.slug === query.replace(/\s+/g, "-")) return 100;
  if (nameNorm.startsWith(query)) return 90;
  if (slugNorm.startsWith(query)) return 85;

  let score = 0;

  for (const token of queryTokens) {
    if (!token) continue;
    if (nameNorm === token || slugNorm === token) score += 40;
    else if (tokens.some((t) => t === token)) score += 35;
    else if (nameNorm.includes(token)) score += 25;
    else if (searchText.includes(token)) score += 15;
    else if (tokens.some((t) => t.startsWith(token))) score += 20;
  }

  if (searchText.includes(query)) score += 30;

  const synonymSlugs = SYNONYM_TO_SLUGS[query];
  if (synonymSlugs?.includes(category.slug)) score += 50;

  return score;
}

export interface SearchResult {
  category: ServiceCategory;
  score: number;
}

export function searchCategories(query: string, limit = 8): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalized = normalizeText(trimmed);
  if (!normalized) return [];

  const queryTokens = normalized.split(" ").filter(Boolean);

  return getIndexedCategories()
    .map((item) => ({
      category: item.category,
      score: scoreMatch(normalized, queryTokens, item),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getBestCategoryMatch(query: string): ServiceCategory | null {
  const results = searchCategories(query, 1);
  if (results.length === 0) return null;
  if (results[0].score >= 15) return results[0].category;
  return null;
}

export function getCategoryHref(slug: string): string {
  return categoryRoutes.majstori(slug);
}

export function getSearchResultsHref(query: string): string {
  return `/pretraga?q=${encodeURIComponent(query.trim())}`;
}
