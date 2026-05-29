import { isValidSerbianPhone, normalizeSerbianPhone } from "@/lib/phoneUtils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStepOne(email: string, phone: string) {
  const errors: { email?: string; phone?: string } = {};

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = "Email je obavezan.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Unesite ispravnu email adresu.";
  }

  const trimmedPhone = phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Broj telefona je obavezan.";
  } else if (!isValidSerbianPhone(trimmedPhone)) {
    errors.phone = "Unesite ispravan srpski mobilni broj (npr. 0641234567).";
  }

  const normalizedPhone = normalizeSerbianPhone(trimmedPhone);

  return {
    errors,
    isValid: Object.keys(errors).length === 0 && !!normalizedPhone,
    normalizedPhone: normalizedPhone ?? "",
    email: trimmedEmail,
  };
}

export function validateStepTwo(selectedServiceIds: string[], description: string) {
  const errors: { services?: string; description?: string } = {};

  if (selectedServiceIds.length === 0) {
    errors.services = "Molimo izaberite najmanje jednu vrstu radova.";
  }

  if (description.length > 100) {
    errors.description = "Opis ne sme biti duži od 100 karaktera.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateStepThree(selectedDistricts: string[]) {
  const errors: { districts?: string } = {};

  if (selectedDistricts.length === 0) {
    errors.districts = "Molimo izaberite najmanje jedan okrug koji pokrivate.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export interface StepFourFields {
  companyName: string;
  pib: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  contactPerson: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type StepFourErrors = Partial<Record<
  keyof StepFourFields | "acceptTerms",
  string
>>;

export function validateStepFour(data: StepFourFields) {
  const errors: StepFourErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName = "Naziv preduzeća je obavezan.";
  }

  const pibDigits = data.pib.replace(/\D/g, "");
  if (!pibDigits) {
    errors.pib = "PIB je obavezan.";
  } else if (pibDigits.length !== 9) {
    errors.pib = "PIB mora imati 9 cifara.";
  }

  if (!data.address.trim()) {
    errors.address = "Adresa je obavezna.";
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = "Poštanski broj je obavezan.";
  }

  if (!data.city.trim() || data.city === "Nije izabrano") {
    errors.city = "Grad/mesto je obavezno.";
  }

  if (!data.country.trim()) {
    errors.country = "Država je obavezna.";
  }

  if (!data.contactPerson.trim()) {
    errors.contactPerson = "Ime kontaktne osobe je obavezno.";
  }

  if (!data.password) {
    errors.password = "Lozinka je obavezna.";
  } else if (data.password.length < 6) {
    errors.password = "Lozinka mora imati najmanje 6 karaktera.";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Lozinke se ne poklapaju.";
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = "Morate prihvatiti uslove korišćenja.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    pib: pibDigits,
  };
}
