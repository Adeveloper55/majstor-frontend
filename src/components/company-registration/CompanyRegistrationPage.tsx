"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyRegistrationStepOne } from "./CompanyRegistrationStepOne";
import { CompanyRegistrationStepServices } from "./CompanyRegistrationStepServices";
import { CompanyRegistrationStepDistricts } from "./CompanyRegistrationStepDistricts";
import { CompanyRegistrationStepCompanyInfo } from "./CompanyRegistrationStepCompanyInfo";
import { CompanyRegistrationProgress } from "./CompanyRegistrationProgress";
import { getSubcategoryById } from "@/constants/companyServiceGroups";
import { submitCompanyRegistration } from "@/lib/submitCompanyRegistration";
import {
  type CompanyRegistrationStepOneData,
  type CompanyRegistrationStepTwoData,
  type CompanyRegistrationStepThreeData,
  type CompanyRegistrationStepFourData,
  type CompanyRegistrationSubmitData,
  type RegistrationStep,
} from "@/types/companyRegistration";

const initialStepOne: CompanyRegistrationStepOneData = {
  email: "",
  phone: "",
  normalizedPhone: "",
};

const initialStepTwo: CompanyRegistrationStepTwoData = {
  selectedServiceIds: [],
  companyShortDescription: "",
};

const initialStepThree: CompanyRegistrationStepThreeData = {
  selectedDistricts: [],
};

const initialStepFour: CompanyRegistrationStepFourData = {
  companyName: "",
  pib: "",
  address: "",
  postalCode: "",
  city: "",
  country: "Srbija",
  contactPerson: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  captchaVerified: true,
};

const STEP_TITLES: Record<1 | 2 | 3 | 4, { title: string; subtitle?: string }> = {
  1: {
    title: "Registruj preduzeće",
    subtitle: "Obezbedite pristup do klijenata koji traže vaše usluge",
  },
  2: { title: "Kakvu vrstu radova nudite?" },
  3: { title: "Odaberite okruge koje pokrivate:" },
  4: { title: "Preduzeće" },
};

export function CompanyRegistrationPage() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [stepOne, setStepOne] = useState(initialStepOne);
  const [stepTwo, setStepTwo] = useState(initialStepTwo);
  const [stepThree, setStepThree] = useState(initialStepThree);
  const [stepFour, setStepFour] = useState(initialStepFour);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFinalSubmit = async (fourData: CompanyRegistrationStepFourData) => {
    setStepFour(fourData);
    setSubmitting(true);
    setSubmitError("");

    const payload: CompanyRegistrationSubmitData = {
      email: stepOne.email,
      phone: stepOne.phone,
      normalizedPhone: stepOne.normalizedPhone,
      selectedServiceIds: stepTwo.selectedServiceIds,
      companyShortDescription: stepTwo.companyShortDescription,
      selectedServiceNames: stepTwo.selectedServiceIds
        .map((id) => getSubcategoryById(id)?.name)
        .filter(Boolean) as string[],
      selectedDistricts: stepThree.selectedDistricts,
      companyName: fourData.companyName.trim(),
      pib: fourData.pib,
      address: fourData.address.trim(),
      postalCode: fourData.postalCode.trim(),
      city: fourData.city,
      country: fourData.country,
      contactPerson: fourData.contactPerson.trim(),
      acceptTerms: fourData.acceptTerms,
      password: fourData.password,
      submittedAt: new Date().toISOString(),
    };

    try {
      const result = await submitCompanyRegistration(payload);
      if (result.status === "PENDING") {
        setStep(5);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitError(msg || "Greška pri slanju prijave. Pokušajte ponovo.");
    } finally {
      setSubmitting(false);
    }
  };

  const header = step <= 4 ? STEP_TITLES[step as 1 | 2 | 3 | 4] : null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-3 py-6 sm:px-4 sm:py-10 md:py-14">
      <div className="mx-auto w-full max-w-[700px]">
        {step <= 4 && <CompanyRegistrationProgress currentStep={step} />}

        {header && step !== 3 && step !== 4 && (
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">{header.title}</h1>
            {header.subtitle && (
              <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">{header.subtitle}</p>
            )}
          </div>
        )}

        <div
          className={
            step === 5
              ? "rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:rounded-2xl sm:p-8"
              : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8"
          }
        >
          {step === 1 && (
            <CompanyRegistrationStepOne
              data={stepOne}
              onChange={setStepOne}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CompanyRegistrationStepServices
              data={stepTwo}
              onChange={setStepTwo}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <CompanyRegistrationStepDistricts
              data={stepThree}
              onChange={setStepThree}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <>
              {submitError && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
              )}
              <CompanyRegistrationStepCompanyInfo
              data={stepFour}
              onChange={setStepFour}
              onBack={() => setStep(3)}
              onSubmit={handleFinalSubmit}
              submitting={submitting}
            />
            </>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900">Prijava je poslata na odobrenje</h2>
              <p className="text-slate-600">
                Hvala, <span className="font-semibold">{stepFour.companyName}</span>! Admin će pregledati
                vašu prijavu. Kada bude odobrena, moći ćete se prijaviti na{" "}
                <span className="font-semibold">{stepOne.email}</span>.
              </p>
              <p className="text-sm text-slate-500">
                {stepTwo.selectedServiceIds.length} delatnosti · {stepThree.selectedDistricts.length}{" "}
                okruga
              </p>
              <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-center">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="h-11 w-full sm:w-auto">
                    Nazad na početnu
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="h-11 w-full bg-brand-600 hover:bg-brand-700 sm:w-auto">
                    Prijava
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
