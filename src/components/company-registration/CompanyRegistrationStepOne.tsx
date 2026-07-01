"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EmailAvailabilityStatus } from "@/hooks/useEmailAvailability";
import { EmailAvailabilityInput } from "@/components/shared/EmailAvailabilityInput";
import { validateStepOne } from "@/lib/companyRegistrationValidation";
import type { CompanyRegistrationStepOneData } from "@/types/companyRegistration";
import { RegistrationStepActions } from "./RegistrationStepActions";

interface CompanyRegistrationStepOneProps {
  data: CompanyRegistrationStepOneData;
  onChange: (data: CompanyRegistrationStepOneData) => void;
  onNext: () => void;
}

export function CompanyRegistrationStepOne({
  data,
  onChange,
  onNext,
}: CompanyRegistrationStepOneProps) {
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [emailStatus, setEmailStatus] = useState<EmailAvailabilityStatus>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateStepOne(data.email, data.phone);
    const nextErrors = { ...result.errors };

    if (emailStatus !== "available") {
      nextErrors.email =
        emailStatus === "taken" || emailStatus === "invalid"
          ? "Email nije dostupan za registraciju."
          : "Sačekajte proveru email adrese.";
    }

    setErrors(nextErrors);
    if (!result.isValid || emailStatus !== "available") return;

    onChange({
      email: result.email,
      phone: data.phone.trim(),
      normalizedPhone: result.normalizedPhone,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <EmailAvailabilityInput
        id="company-email"
        label="Vaš e-mail (korisničko ime):"
        placeholder="npr. firma@email.rs"
        value={data.email}
        onChange={(email) => onChange({ ...data, email })}
        onAvailabilityChange={({ status }) => setEmailStatus(status)}
        className={cn("mt-2 h-11 rounded-lg text-base sm:h-12", errors.email && "border-red-400")}
      />
      {errors.email && <p className="-mt-3 text-sm text-red-600">{errors.email}</p>}

      <div>
        <Label htmlFor="company-phone" className="text-sm font-medium text-slate-800">
          Broj mobilnog telefona:
        </Label>
        <div className="mt-2 flex min-w-0 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-brand-600/30">
          <span className="flex shrink-0 items-center border-r border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 sm:px-3 sm:text-sm">
            <span className="sm:hidden">+381</span>
            <span className="hidden sm:inline">(RS) +381</span>
          </span>
          <input
            id="company-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="6X XXX XXXX"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={cn(
              "h-11 min-w-0 flex-1 px-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none sm:h-12",
              errors.phone && "bg-red-50/30"
            )}
          />
        </div>
        {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
        <p className="mt-1.5 text-xs text-slate-500">Unesite broj bez pozivnog +381 (npr. 641234567).</p>
      </div>

      <RegistrationStepActions submitDisabled={emailStatus === "checking"} />
    </form>
  );
}
