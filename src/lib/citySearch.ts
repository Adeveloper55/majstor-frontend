import { SERBIAN_CITIES, normalizeCityName } from "@/constants/serbianCities";

export function searchCities(query: string, limit = 8): string[] {
  const q = normalizeCityName(query);
  if (!q) return [];

  const scored = SERBIAN_CITIES.map((city) => {
    const normalized = normalizeCityName(city.name);
    let score = 0;
    if (normalized === q) score = 100;
    else if (normalized.startsWith(q)) score = 80;
    else if (normalized.includes(q)) score = 60;
    else if (q.length >= 3 && levenshtein(normalized, q) <= 2) score = 40;
    return { name: city.name, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "sr"));

  return scored.slice(0, limit).map((item) => item.name);
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}
