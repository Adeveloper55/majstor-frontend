import api from "@/lib/api";
import type { CompanyRegistrationSubmitData } from "@/types/companyRegistration";

export interface CompanyRegistrationApiResponse {
  id: string;
  status: string;
  message: string;
}

export async function submitCompanyRegistration(
  data: CompanyRegistrationSubmitData
): Promise<CompanyRegistrationApiResponse> {
  const payload = {
    email: data.email,
    phone: data.phone,
    normalizedPhone: data.normalizedPhone,
    selectedServiceIds: data.selectedServiceIds,
    selectedServiceNames: data.selectedServiceNames,
    companyShortDescription: data.companyShortDescription || "",
    selectedDistricts: data.selectedDistricts,
    companyName: data.companyName,
    pib: data.pib,
    address: data.address,
    postalCode: data.postalCode,
    city: data.city,
    country: data.country,
    contactPerson: data.contactPerson,
    password: data.password,
    acceptTerms: data.acceptTerms,
  };

  const { data: response } = await api.post<CompanyRegistrationApiResponse>(
    "/api/auth/register/company",
    payload
  );

  return response;
}
