import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  REGISTRATION_STEP_LABELS,
  REGISTRATION_STEP_LABELS_MOBILE,
  type RegistrationStep,
} from "@/types/companyRegistration";

interface CompanyRegistrationProgressProps {
  currentStep: RegistrationStep;
}

export function CompanyRegistrationProgress({ currentStep }: CompanyRegistrationProgressProps) {
  if (currentStep >= 5) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative flex justify-between gap-1 px-0.5 sm:gap-0 sm:px-0">
        <div className="absolute left-2 right-2 top-3.5 h-0.5 bg-slate-200 sm:left-0 sm:right-0 sm:top-4" aria-hidden />
        <div
          className="absolute left-2 top-3.5 h-0.5 bg-brand-600 transition-all duration-300 sm:left-0 sm:top-4"
          style={{
            width: `calc(${((currentStep - 1) / (REGISTRATION_STEP_LABELS.length - 1)) * 100}% - 0.5rem)`,
            maxWidth: "calc(100% - 1rem)",
          }}
          aria-hidden
        />
        {REGISTRATION_STEP_LABELS.map((label, index) => {
          const stepNum = (index + 1) as RegistrationStep;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          const mobileLabel = REGISTRATION_STEP_LABELS_MOBILE[index];

          return (
            <div
              key={label}
              className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:max-w-none sm:flex-none sm:gap-2"
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors sm:h-9 sm:w-9 sm:text-sm",
                  isCompleted && "border-brand-600 bg-brand-600 text-white",
                  isActive && "border-brand-600 bg-white text-brand-600",
                  !isCompleted && !isActive && "border-slate-200 bg-white text-slate-400"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "w-full truncate text-center text-[10px] font-medium leading-tight sm:hidden",
                  isActive || isCompleted ? "text-brand-600" : "text-slate-400"
                )}
              >
                {mobileLabel}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive || isCompleted ? "text-brand-600" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
