export interface CompanyRegistrationStepOneData {
  email: string;
  phone: string;
  normalizedPhone: string;
}

export interface CompanyRegistrationStepTwoData {
  selectedServiceIds: string[];
  companyShortDescription: string;
}

export interface CompanyRegistrationStepThreeData {
  selectedDistricts: string[];
}

export interface CompanyRegistrationStepFourData {
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
  captchaVerified: boolean;
}

export interface CompanyRegistrationPayload
  extends CompanyRegistrationStepOneData,
    CompanyRegistrationStepTwoData,
    CompanyRegistrationStepThreeData {
  selectedServiceNames: string[];
  companyName: string;
  pib: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  contactPerson: string;
  acceptTerms: boolean;
  submittedAt: string;
}

/** Payload for API submit — includes password */
export interface CompanyRegistrationSubmitData extends CompanyRegistrationPayload {
  password: string;
}

export const COMPANY_REGISTRATION_STORAGE_KEY = "company-registration-draft";

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;

export const REGISTRATION_STEP_LABELS = [
  "Kontakt",
  "Delatnosti",
  "Okruzi",
  "Preduzeće",
] as const;

export const REGISTRATION_STEP_LABELS_MOBILE = [
  "Kontakt",
  "Delat.",
  "Okruzi",
  "Pred.",
] as const;
