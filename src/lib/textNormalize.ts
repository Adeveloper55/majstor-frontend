const SERBIAN_MAP: Record<string, string> = {
  č: "c",
  ć: "c",
  š: "s",
  đ: "dj",
  ž: "z",
  Č: "c",
  Ć: "c",
  Š: "s",
  Đ: "dj",
  Ž: "z",
};

/** Normalizuje tekst za pretragu (latinica, bez dijakritika). */
export function normalizeText(text: string): string {
  let result = text.toLowerCase();
  for (const [from, to] of Object.entries(SERBIAN_MAP)) {
    result = result.split(from).join(to);
  }
  return result
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
