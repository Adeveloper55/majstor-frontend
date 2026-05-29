"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { REGISTRATION_DISTRICTS } from "@/constants/districts";
import { validateStepThree } from "@/lib/companyRegistrationValidation";
import type { CompanyRegistrationStepThreeData } from "@/types/companyRegistration";
import { RegistrationStepActions } from "./RegistrationStepActions";

interface CompanyRegistrationStepDistrictsProps {
  data: CompanyRegistrationStepThreeData;
  onChange: (data: CompanyRegistrationStepThreeData) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CompanyRegistrationStepDistricts({
  data,
  onChange,
  onBack,
  onNext,
}: CompanyRegistrationStepDistrictsProps) {
  const [error, setError] = useState<string | undefined>();

  const toggleDistrict = (district: string) => {
    const next = data.selectedDistricts.includes(district)
      ? data.selectedDistricts.filter((d) => d !== district)
      : [...data.selectedDistricts, district];
    onChange({ selectedDistricts: next });
    if (error && next.length > 0) setError(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateStepThree(data.selectedDistricts);
    if (!result.isValid) {
      setError(result.errors.districts);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Odaberite okruge koje pokrivate:
      </h2>

      <ul className="max-h-[50vh] divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200 sm:max-h-none sm:overflow-visible">
        {REGISTRATION_DISTRICTS.map((district) => {
          const checked = data.selectedDistricts.includes(district);
          return (
            <li key={district}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-4 sm:py-3.5",
                  checked && "bg-brand-50/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDistrict(district)}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
                <span className="text-sm font-medium text-slate-800 sm:text-base">{district}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <RegistrationStepActions onBack={onBack} />
    </form>
  );
}
