export const INQUIRY_TIMELINE_OPTIONS = [
  "Odmah",
  "do 1 meseca",
  "1-3 meseca",
  "Više od 3 meseca",
  "Više od 6 meseci",
  "Zanima me samo okvirna cena",
] as const;

export const CATEGORY_INQUIRY_HINTS: Record<string, string[]> = {
  "agencija-za-ciscenje": [
    "Koje prostore želite da očistite?",
    "Šta želite da očistite: podove i površine ili i nameštaj, opremu?",
    "Da li je potrebno jednokratno ili redovno čišćenje?",
    "Želite li dodatne usluge, kao što su čišćenje prozora ili odmašćivanje?",
  ],
};

export const DEFAULT_INQUIRY_HINTS = [
  "Opišite vrstu posla i šta tačno treba uraditi.",
  "Navedite okvirne dimenzije ili obim radova ako znate.",
  "Dodajte informacije o pristupačnosti lokacije ili rokovima.",
];
