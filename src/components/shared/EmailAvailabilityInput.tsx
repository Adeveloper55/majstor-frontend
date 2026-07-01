"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEmailAvailability, type EmailAvailabilityStatus } from "@/hooks/useEmailAvailability";

interface EmailAvailabilityInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  onAvailabilityChange?: (state: {
    status: EmailAvailabilityStatus;
    isEmailReady: boolean;
    isEmailBlocked: boolean;
  }) => void;
}

export function EmailAvailabilityInput({
  id = "email",
  label = "Email",
  value,
  onChange,
  required = true,
  placeholder,
  className,
  autoComplete = "email",
  onAvailabilityChange,
}: EmailAvailabilityInputProps) {
  const { status, message, isEmailReady, isEmailBlocked } = useEmailAvailability(value);

  useEffect(() => {
    onAvailabilityChange?.({ status, isEmailReady, isEmailBlocked });
  }, [status, isEmailReady, isEmailBlocked, onAvailabilityChange]);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="email"
        inputMode="email"
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className, isEmailBlocked && "border-red-400")}
      />
      {status === "checking" && (
        <p className="mt-1 text-sm text-slate-500">Proveravam email...</p>
      )}
      {status === "available" && (
        <p className="mt-1 text-sm text-green-600">{message}</p>
      )}
      {(status === "taken" || status === "invalid") && (
        <p className="mt-1 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
