export const REGISTRATION_DISTRICTS = [
  "Borski",
  "Braničevski",
  "Grad Beograd",
  "Grad Niš",
  "Jablanički",
  "Južno-bački",
  "Južno-banatski",
  "Kolubarski",
  "Kosovski",
  "Kosovsko-mitrovački",
  "Kosovsko-pomoravski",
  "Mačvanski",
  "Moravički",
  "Nišavski",
  "Pčinjski",
  "Pećki",
  "Pirotski",
  "Podunavski",
  "Pomoravski",
  "Prizrenski",
  "Rasinski",
  "Raški",
  "Severno-bački",
  "Severno-banatski",
  "Srednje-banatski",
  "Sremski",
  "Šumadijski",
  "Toplički",
  "Zaječarski",
  "Zapadno-bački",
  "Zlatiborski",
  "Inostranstvo",
] as const;

export type RegistrationDistrict = (typeof REGISTRATION_DISTRICTS)[number];

export function districtToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/đ/g, "dj")
    .replace(/ž/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
