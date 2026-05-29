import { normalizeText } from "@/lib/textNormalize";

export interface ServiceSubcategory {
  id: string;
  name: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  subcategories: ServiceSubcategory[];
}

function sub(name: string): ServiceSubcategory {
  const id = normalizeText(name).replace(/\s+/g, "-");
  return { id, name };
}

function group(id: string, title: string, names: string[]): ServiceGroup {
  return { id, title, subcategories: names.map(sub) };
}

export const COMPANY_SERVICE_GROUPS: ServiceGroup[] = [
  group("arhitekta-geometar-projektant", "Arhitekta, geometar, projektant", [
    "3D modelovanje, renderi",
    "Arhitekta",
    "Dizajn enterijera",
    "Energetski pasoš",
    "Energetski razred",
    "Geomehanika",
    "Geometar, geodeta",
    "Građevinska dozvola",
    "Građevinski nadzor",
    "Inženjering",
    "Legalizacija objekta",
    "Pejzažna arhitektura",
    "Plan zaštite od požara",
    "Predmer, popis radova",
    "Procenitelj nekretnina",
    "Projektovanje",
    "Projektovanje mašinskih instalacija",
    "Projektovanje niskogradnje",
    "Projektovanje rasvete",
    "Projektovanje elektroinstalacija",
    "PZI projekat za izvođenje",
    "Šef gradilišta",
    "Statika",
    "Termovizija",
    "Urbanizam",
    "Zaštita na radu",
  ]),
  group("gradjevinski-radovi", "Građevinski radovi", [
    "Adaptacija, uređenje potkrovlja",
    "Betoniranje",
    "Bušenje betona",
    "Bušenje bunara",
    "Drvene kuće, brvnare",
    "Drov gradnja",
    "Gradnja kuće - ključ u ruke",
    "Građevinski materijal",
    "Građevinski radovi",
    "Hidroizolacija temelja, podruma",
    "Iskop zemlje",
    "Kamene kuće",
    "Kopanje kanala",
    "Lamelirano drvo",
    "Manji zidarski radovi",
    "Montažne kuće",
    "Niskoenergetske kuće",
    "Novogradnja",
    "Obnova, sanacija",
    "Pasivne kuće",
    "Renoviranje kuće",
    "Renoviranje kupatila",
    "Renoviranje stana",
    "Rušenje objekata",
    "Rušenje, manja rušenja",
    "Šalovanje",
    "Sanacija balkona, terase",
    "Sanacija vlage",
    "Sečenje betona, bušenje",
    "Šipovi",
    "Specijalni građevinski radovi",
    "Temelj, temeljna ploča",
    "Zemljani radovi",
    "Zidanje dimnjaka",
    "Zidarski radovi, zidar",
  ]),
  group("krovovi-limarija", "Krovovi, limarija", [
    "Drvene nastrešnice",
    "Krovni prozori",
    "Majstori za krov",
    "Gromobrani",
    "Hidroizolacija ravnog krova",
    "Krovni pokrivači",
    "Limarski radovi",
    "Limeni krovovi, lim za krov",
    "Oluci",
    "Ravni krovovi",
    "Slameni krovovi",
    "Tesar",
    "Zeleni krovovi",
  ]),
  group("prozori-vrata-senila", "Prozori, vrata, senila", [
    "Garažna vrata",
    "Prozori",
    "PVC prozori",
    "PVC ulazna vrata",
    "Sobna vrata",
    "Aluminijumska ulazna vrata",
    "Aluminijumski prozori",
    "Drvena ulazna vrata",
    "Drveni prozori",
    "Industrijska garažna vrata",
    "Klizna vrata",
    "Komarnici",
    "Krilna garažna vrata",
    "Montaža, ugradnja prozora",
    "Obnova drvenih prozora",
    "Panelne zavese",
    "Panoramski prozori i zidovi",
    "Plisirane roletne",
    "Pokretna garažna vrata",
    "Popravka stolarije",
    "Popravka venecijanera, žaluzina",
    "Pripremne radnje",
    "Rolo garažna vrata",
    "Rolo-zastori",
    "Segmentna garažna vrata",
    "Senila",
    "Sigurnosna vrata",
    "Spoljne roletne",
    "Spoljni rolo-zastori",
    "Staklene fasade",
    "Staklene ograde",
    "Staklenici, plastenici",
    "Staklo, staklorezac",
    "Tende, markize",
    "Trakaste zavese",
    "Ugradnja vrata",
    "Ulazna vrata",
    "Unutrašnja senila",
    "Venecijaneri",
    "Žaluzine",
    "Zastakljivanje terase",
    "Zavese",
  ]),
  group("grejanje-klima-instalacije", "Centralno grejanje, toplotne pumpe, hlađenje, vodovod i električne instalacije", [
    "Elektroinstalacije, električar",
    "Klima-uređaji, ugradnja klime",
    "Toplotne pumpe",
    "Vodoinstalater",
    "Alarmni sistemi",
    "Centralni usisni sistem",
    "Dimnjak",
    "Električna merenja",
    "Električno podno grejanje",
    "Elektroservis",
    "Gasne instalacije",
    "Grejanje",
    "IC paneli",
    "Kaljeve peći",
    "Kamini",
    "Kape za dimnjak",
    "Keramički dimnjaci",
    "Kotlovi na biomasu",
    "Kupovina struje",
    "Liftovi",
    "Lož-ulje",
    "Mašinske instalacije",
    "Pametne kuće",
    "Pelet, briketi, trinje, drva",
    "Podno grejanje",
    "Prohromski dimnjaci",
    "Rasveta, osvetljenje",
    "Sanacija dimnjaka",
    "Servis peći i uređaja",
    "Solarne elektrane",
    "Solarni kolektori",
    "Solarni sistemi",
    "Telekomunikacije",
    "Ventilacija",
    "Vodoinstalaterski radovi",
    "Zidno grejanje",
  ]),
  group("fasade-moleraj", "Fasade, moleraj", [
    "Fasade",
    "Gipsarski radovi",
    "Krečenje, moler",
    "Celulozna izolacija",
    "Dekorativni molerski radovi",
    "Drvene fasade",
    "Farbanje drveta",
    "Farbanje metala",
    "Građevinske skele",
    "Izolacija potkrovlja",
    "Lepljenje tapeta",
    "Metalne fasade",
    "Štukature",
    "Suvi estrih",
    "Ventilisane fasade",
    "Zidne obloge",
  ]),
  group("malterisanje-kosuljice", "Malterisanje, košuljice", [
    "Cementna košuljica, ravnajući sloj, estrih",
    "Malterisanje",
    "Mašinsko malterisanje",
    "Ručno malterisanje",
    "Samorazlivni estrih",
  ]),
  group("podovi-keramika", "Podovi, keramika", [
    "Keramika, keramičar",
    "Parketari",
    "Epoksidni podovi",
    "Industrijski podovi",
    "Keramičke pločice",
    "Laminati",
    "Lepljenje pločica",
    "Parket",
    "Pećari",
    "Podne obloge",
    "Postavljanje parketa",
    "Tekstilne podne obloge",
    "Vinilni podovi, PVC podovi",
  ]),
  group("metalne-konstrukcije", "Metalne konstrukcije", [
    "ALU ograde",
    "Bravarija, bravarske usluge",
    "CNC obrada metala",
    "Dvorišne kapije",
    "Elektrostatsko farbanje",
    "Kontejneri za stanovanje",
    "Kovane ograde, kovane ograde",
    "Metalne konstrukcije",
    "Metalne nastrešnice",
    "Metalne ograde",
    "Metalne stepenice",
    "Metalni nameštaj, oprema",
    "Montažne garaže",
    "Panelne ograde",
    "Pergole",
    "Peskanje",
    "Prohromske nastrešnice",
    "Prohromske ograde",
    "Prohromske stepenice",
  ]),
  group("stolarija-namestaj", "Stolarija, nameštaj", [
    "Baštenske garniture, baštenski nameštaj",
    "Dečje sobe",
    "Dnevne sobe",
    "Drvene ograde",
    "Drvene stepenice",
    "Kuhinje po meri",
    "Kuhinjski pultovi",
    "Kupatila",
    "Manje popravke nameštaja",
    "Nameštaj od punog drveta",
    "Nameštaj po meri",
    "Obloge za zid",
    "Renoviranje, obnova kuhinje",
    "Restauracija nameštaja",
    "Sastavljanje nameštaja, kuhinje",
    "Saune",
    "Spavaće sobe",
    "Stolar",
    "Tapaciranje nameštaja",
    "Ugradni plakari",
  ]),
  group("uredenje-asfaltiranje", "Uređenje, asfaltiranje", [
    "Behaton ploče, popločavanje",
    "Asfaltiranje",
    "Baštenske kućice",
    "Bazeni",
    "Betonska galanterija",
    "Dečja igrališta",
    "Dekorativni kamen",
    "Drvene terase",
    "Gradnja puteva",
    "Hortikultura, bašta, dvorište",
    "Kamenorezac, klesar",
    "Kišni kolektori i cisterne",
    "Komunalni priključci",
    "Niskogradnja",
    "Potporni zidovi",
    "Prečišćavanje otpadnih voda",
    "PVC ograde",
    "Rasadnik",
    "Ribnjaci",
    "Sistemi za navodnjavanje",
    "Štampani beton",
    "Teraco kamen",
    "Transport",
    "Uporni zidovi",
    "Uređenje dvorišta",
    "Visinski radovi, seča stabala",
  ]),
  group("odrzavanje", "Održavanje", [
    "Agencija za čišćenje",
    "Bravar, bravarski poslovi",
    "Čišćenje dimnjaka",
    "Hausmajstor",
    "Održavanje",
    "Pranje dvorišta, fasade, krova",
    "Radovi na visini",
    "Selidbe",
  ]),
  group("drugo", "Drugo", [
    "Drugo",
    "Iznajmljivanje bagera, građevinskih mašina",
    "Iznajmljivanje dizalice, krana",
    "Iznajmljivanje kombija, kamiona",
    "Osiguranje kuće, stana",
    "Stambeni kredit",
    "Uramljivanje slika",
    "Zimska služba",
  ]),
];

export function getAllSubcategories(): ServiceSubcategory[] {
  return COMPANY_SERVICE_GROUPS.flatMap((g) => g.subcategories);
}

export function getSubcategoryById(id: string): ServiceSubcategory | undefined {
  return getAllSubcategories().find((s) => s.id === id);
}

export interface FilteredServiceGroupsResult {
  groups: ServiceGroup[];
  openGroupIds: string[];
}

export function filterServiceGroups(query: string): FilteredServiceGroupsResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { groups: COMPANY_SERVICE_GROUPS, openGroupIds: [] };
  }

  const normalized = normalizeText(trimmed);
  const tokens = normalized.split(" ").filter(Boolean);
  const openGroupIds: string[] = [];

  const groups = COMPANY_SERVICE_GROUPS.map((g) => {
    const titleMatch = tokens.some((t) => normalizeText(g.title).includes(t));
    const matchingSubs = g.subcategories.filter((sub) => {
      const subNorm = normalizeText(sub.name);
      return tokens.some((t) => subNorm.includes(t) || t.includes(subNorm));
    });

    if (matchingSubs.length > 0 || titleMatch) {
      openGroupIds.push(g.id);
      return {
        ...g,
        subcategories: matchingSubs.length > 0 ? matchingSubs : g.subcategories,
      };
    }
    return null;
  }).filter((g): g is ServiceGroup => g !== null);

  return { groups, openGroupIds };
}
