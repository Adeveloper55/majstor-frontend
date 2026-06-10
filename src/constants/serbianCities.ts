export interface SerbianCity {
  name: string;
  latitude: number;
  longitude: number;
}

export const SERBIAN_CITIES: SerbianCity[] = [
  { name: "Beograd", latitude: 44.8176, longitude: 20.4633 },
  { name: "Novi Sad", latitude: 45.2671, longitude: 19.8335 },
  { name: "Niš", latitude: 43.3209, longitude: 21.8958 },
  { name: "Kragujevac", latitude: 44.0128, longitude: 20.9114 },
  { name: "Subotica", latitude: 46.1004, longitude: 19.6658 },
  { name: "Zrenjanin", latitude: 45.3836, longitude: 20.3819 },
  { name: "Pančevo", latitude: 44.8708, longitude: 20.6403 },
  { name: "Čačak", latitude: 43.8914, longitude: 20.3497 },
  { name: "Kraljevo", latitude: 43.7258, longitude: 20.6896 },
  { name: "Novi Pazar", latitude: 43.1367, longitude: 20.5122 },
  { name: "Smederevo", latitude: 44.365, longitude: 20.9587 },
  { name: "Leskovac", latitude: 42.9981, longitude: 21.9461 },
  { name: "Valjevo", latitude: 44.2744, longitude: 19.8822 },
  { name: "Kruševac", latitude: 43.5806, longitude: 21.3339 },
  { name: "Vranje", latitude: 42.5514, longitude: 21.9003 },
  { name: "Šabac", latitude: 44.7553, longitude: 19.6914 },
  { name: "Užice", latitude: 43.8586, longitude: 19.8428 },
  { name: "Sombor", latitude: 45.7742, longitude: 19.1122 },
  { name: "Požarevac", latitude: 44.6211, longitude: 21.1878 },
  { name: "Pirot", latitude: 43.1531, longitude: 22.5861 },
  { name: "Zaječar", latitude: 43.9045, longitude: 22.2737 },
  { name: "Kikinda", latitude: 45.8297, longitude: 20.4651 },
  { name: "Sremska Mitrovica", latitude: 44.9764, longitude: 19.6122 },
  { name: "Jagodina", latitude: 43.9799, longitude: 21.2617 },
  { name: "Loznica", latitude: 44.5317, longitude: 19.2208 },
  { name: "Prokuplje", latitude: 43.2342, longitude: 21.588 },
  { name: "Bor", latitude: 44.0699, longitude: 22.0977 },
  { name: "Vršac", latitude: 45.1167, longitude: 21.3036 },
  { name: "Ruma", latitude: 45.0075, longitude: 19.8252 },
  { name: "Bačka Palanka", latitude: 45.2508, longitude: 19.3889 },
  { name: "Inđija", latitude: 45.0481, longitude: 20.0817 },
  { name: "Aranđelovac", latitude: 44.3069, longitude: 20.5603 },
  { name: "Gornji Milanovac", latitude: 44.026, longitude: 20.4617 },
  { name: "Vrbas", latitude: 45.5714, longitude: 19.6406 },
  { name: "Apatin", latitude: 45.6722, longitude: 18.9847 },
  { name: "Negotin", latitude: 44.2269, longitude: 22.5311 },
];

export const SERBIAN_CITY_NAMES = SERBIAN_CITIES.map((c) => c.name);

export function getCityCoordinates(cityName: string): SerbianCity | undefined {
  const normalized = normalizeCityName(cityName);
  return SERBIAN_CITIES.find((c) => normalizeCityName(c.name) === normalized);
}

export function normalizeCityName(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9\s-]/g, "");
}

export function citiesMatch(jobCity: string | undefined, filterCity: string): boolean {
  if (!filterCity.trim()) return true;
  if (!jobCity?.trim()) return false;
  const job = normalizeCityName(jobCity);
  const filter = normalizeCityName(filterCity);
  return job === filter || job.includes(filter) || filter.includes(job);
}
