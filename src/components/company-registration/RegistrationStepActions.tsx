"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RegistrationStepActionsProps {
  onBack?: () => void;
  backLabel?: string;
  submitLabel?: string;
  submitting?: boolean;
  submitDisabled?: boolean;
  type?: "submit" | "button";
  onSubmit?: () => void;
}

export function RegistrationStepActions({
  onBack,
  backLabel = "Nazad",
  submitLabel = "Napred",
  submitting = false,
  submitDisabled = false,
  type = "submit",
  onSubmit,
}: RegistrationStepActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:pt-2">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 w-full sm:w-auto sm:min-w-[100px]"
        >
          {backLabel}
        </Button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Button
        type={type}
        disabled={submitting || submitDisabled}
        onClick={type === "button" ? onSubmit : undefined}
        className={cn(
          "h-11 w-full bg-brand-600 hover:bg-brand-700 sm:w-auto",
          onBack ? "sm:min-w-[120px]" : "sm:min-w-[120px] sm:ml-auto"
        )}
      >
        {submitting ? "Slanje..." : submitLabel}
      </Button>
    </div>
  );
}
