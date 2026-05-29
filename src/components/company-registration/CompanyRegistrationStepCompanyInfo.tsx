"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { REGISTRATION_CITIES, CITY_PLACEHOLDER } from "@/constants/registrationCities";
import { validateStepFour } from "@/lib/companyRegistrationValidation";
import type { CompanyRegistrationStepFourData } from "@/types/companyRegistration";
import type { StepFourErrors } from "@/lib/companyRegistrationValidation";
import { RegistrationStepActions } from "./RegistrationStepActions";

interface CompanyRegistrationStepCompanyInfoProps {
  data: CompanyRegistrationStepFourData;
  onChange: (data: CompanyRegistrationStepFourData) => void;
  onBack: () => void;
  onSubmit: (data: CompanyRegistrationStepFourData) => void;
  submitting?: boolean;
}

export function CompanyRegistrationStepCompanyInfo({
  data,
  onChange,
  onBack,
  onSubmit,
  submitting = false,
}: CompanyRegistrationStepCompanyInfoProps) {
  const [errors, setErrors] = useState<StepFourErrors>({});

  const setField = <K extends keyof CompanyRegistrationStepFourData>(
    key: K,
    value: CompanyRegistrationStepFourData[K]
  ) => {
    onChange({ ...data, [key]: value });
    if (errors[key as keyof StepFourErrors]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as keyof StepFourErrors];
        return next;
      });
    }
  };

  const handlePibChange = (value: string) => {
    setField("pib", value.replace(/\D/g, "").slice(0, 9));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateStepFour(data);
    setErrors(result.errors);
    if (!result.isValid) return;

    onSubmit({ ...data, pib: result.pib, captchaVerified: true });
  };

  const fieldClass = (key: keyof StepFourErrors) =>
    cn(errors[key] && "border-red-400");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Preduzeće</h2>

      <div>
        <Label htmlFor="companyName">Naziv preduzeća:</Label>
        <Input
          id="companyName"
          placeholder="Naziv preduzeća"
          value={data.companyName}
          onChange={(e) => setField("companyName", e.target.value)}
          className={cn("mt-2 h-11", fieldClass("companyName"))}
        />
        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
      </div>

      <div>
        <Label htmlFor="pib">PIB - Poreski identifikacioni broj:</Label>
        <Input
          id="pib"
          inputMode="numeric"
          placeholder="PIB - Poreski identifikacioni broj"
          value={data.pib}
          onChange={(e) => handlePibChange(e.target.value)}
          className={cn("mt-2 h-11", fieldClass("pib"))}
        />
        {errors.pib && <p className="mt-1 text-sm text-red-600">{errors.pib}</p>}
      </div>

      <div>
        <Label htmlFor="address">Upišite ulicu i broj:</Label>
        <Input
          id="address"
          placeholder="Upišite ulicu i broj"
          value={data.address}
          onChange={(e) => setField("address", e.target.value)}
          className={cn("mt-2 h-11", fieldClass("address"))}
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>

      <div>
        <Label>Poštanski broj:</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <Input
              placeholder="Poštanski broj"
              value={data.postalCode}
              onChange={(e) => setField("postalCode", e.target.value)}
              className={cn("h-11", fieldClass("postalCode"))}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>
          <div>
            <select
              value={data.city || CITY_PLACEHOLDER}
              onChange={(e) =>
                setField("city", e.target.value === CITY_PLACEHOLDER ? "" : e.target.value)
              }
              className={cn(
                "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20",
                fieldClass("city")
              )}
            >
              <option value={CITY_PLACEHOLDER}>{CITY_PLACEHOLDER}</option>
              {REGISTRATION_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="country">Država:</Label>
        <select
          id="country"
          value={data.country}
          onChange={(e) => setField("country", e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        >
          <option value="Srbija">Srbija</option>
        </select>
      </div>

      <div>
        <Label htmlFor="contactPerson">Ime kontaktne osobe</Label>
        <Input
          id="contactPerson"
          placeholder="Ime kontaktne osobe"
          value={data.contactPerson}
          onChange={(e) => setField("contactPerson", e.target.value)}
          className={cn("mt-2 h-11", fieldClass("contactPerson"))}
        />
        {errors.contactPerson && (
          <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
        )}
      </div>

      <div>
        <Label>Lozinka</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <Input
              type="password"
              placeholder="Izaberi lozinku"
              value={data.password}
              onChange={(e) => setField("password", e.target.value)}
              className={cn("h-11", fieldClass("password"))}
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Ponovi lozinku"
              value={data.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              className={cn("h-11", fieldClass("confirmPassword"))}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={data.acceptTerms}
            onChange={(e) => setField("acceptTerms", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
          />
          <span className="text-sm leading-snug text-slate-700">
            Slažem se sa uslovima korišćenja platforme.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-sm text-red-600">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span className="text-sm font-medium text-slate-800">Uspešno!</span>
        </div>
        <span className="text-xs text-slate-400">Privacy • Terms</span>
      </div>

      <RegistrationStepActions
        onBack={onBack}
        submitLabel="Upiši preduzeće"
        submitting={submitting}
      />
    </form>
  );
}
