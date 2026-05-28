/** Centralna lista usluga — jedini izvor za header menije i landing stranice */
export interface ServiceCategory {
  slug: string;
  name: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { slug: "agencija-za-ciscenje", name: "Agencija za čišćenje" },
  { slug: "asfaltiranje", name: "Asfaltiranje" },
  { slug: "behaton-plocice-poplocavanje", name: "Behaton ploče, popločavanje" },
  { slug: "bravarija-bravarske-usluge", name: "Bravarija, bravarske usluge" },
  { slug: "busenje-bunara", name: "Bušenje bunara" },
  { slug: "cementna-kosuljica-estrih", name: "Cementna košuljica, ravnajući sloj, estrih" },
  { slug: "ciscenje-dimnjaka", name: "Čišćenje dimnjaka" },
  { slug: "drveni-prozori", name: "Drveni prozori" },
  { slug: "elektroinstalacije-elektricar", name: "Elektroinstalacije, električar" },
  { slug: "fasade", name: "Fasade" },
  { slug: "geomehanika", name: "Geomehanika" },
  { slug: "geometar-geodeta", name: "Geometar, geodeta" },
  { slug: "gipsarski-radovi", name: "Gipsarski radovi" },
  { slug: "gradjevinski-radovi-nove", name: "Građevinski radovi" },
  { slug: "kamenorezac-klesar", name: "Kamenorezac, klesar" },
  { slug: "keramika-keramicar", name: "Keramika, keramičar" },
  { slug: "klima-uredjaji-ugradnja-klime", name: "Klima-uređaji, ugradnja klime" },
  { slug: "kontejneri-za-stanovanje", name: "Kontejneri za stanovanje" },
  { slug: "krecenje-moler", name: "Krečenje, moler" },
  { slug: "laminati", name: "Laminati" },
  { slug: "lepljenje-plocica", name: "Lepljenje pločica" },
  { slug: "limarski-radovi", name: "Limarski radovi" },
  { slug: "majstori-za-krov", name: "Majstori za krov" },
  { slug: "masinsko-malterisanje", name: "Mašinsko malterisanje" },
  { slug: "metalne-konstrukcije", name: "Metalne konstrukcije" },
  { slug: "montazne-kuce", name: "Montažne kuće" },
  { slug: "namestaj-po-meri", name: "Nameštaj po meri" },
  { slug: "obnova-drvenih-prozora", name: "Obnova drvenih prozora" },
  { slug: "parketari", name: "Parketari" },
  { slug: "pranje-dvorista-fasade-krova", name: "Pranje dvorišta, fasade, krova" },
  { slug: "pvc-prozori", name: "PVC prozori" },
  { slug: "renoviranje-kupatila", name: "Renoviranje kupatila" },
  { slug: "renoviranje-stana", name: "Renoviranje stana" },
  { slug: "selidbe", name: "Selidbe" },
  { slug: "sobna-vrata", name: "Sobna vrata" },
  { slug: "staklo-staklorezac", name: "Staklo, staklorezac" },
  { slug: "stolar", name: "Stolar" },
  { slug: "tapaciranje-namestaja", name: "Tapaciranje nameštaja" },
  { slug: "temelj-temeljna-ploca", name: "Temelj, temeljna ploča" },
  { slug: "toplotne-pumpe", name: "Toplotne pumpe" },
  { slug: "ulazna-vrata", name: "Ulazna vrata" },
  { slug: "vodoinstalater", name: "Vodoinstalater" },
  { slug: "drugo", name: "Drugo" },
];

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryPriceLabel(category: ServiceCategory): string {
  return `${category.name}, cena`;
}

export const categoryRoutes = {
  majstori: (slug: string) => `/majstori/${slug}`,
  izvodjaci: (slug: string) => `/izvodjaci/${slug}`,
  prosecneCene: (slug: string) => `/prosecne-cene/${slug}`,
} as const;
