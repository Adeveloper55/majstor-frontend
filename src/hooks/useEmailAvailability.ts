"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const DEBOUNCE_MS = 450;

export type EmailAvailabilityStatus = "idle" | "typing" | "checking" | "available" | "taken" | "invalid";

export function useEmailAvailability(email: string) {
  const [status, setStatus] = useState<EmailAvailabilityStatus>("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("idle");
      setMessage("");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("invalid");
      setMessage("Unesite ispravnu email adresu.");
      return;
    }

    setStatus("typing");
    setMessage("");
    const timer = window.setTimeout(async () => {
      const id = ++requestId.current;
      setStatus("checking");
      try {
        const { data } = await api.get<{ available: boolean; message: string }>(
          "/api/auth/check-email",
          { params: { email: trimmed } }
        );
        if (id !== requestId.current) return;
        if (data.available) {
          setStatus("available");
          setMessage(data.message || "Email je dostupan.");
        } else {
          setStatus("taken");
          setMessage(data.message || "Email je već zauzet.");
        }
      } catch {
        if (id !== requestId.current) return;
        setStatus("idle");
        setMessage("");
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [email]);

  const isEmailReady = status === "available";
  const isEmailBlocked = status === "taken" || status === "invalid";

  return { status, message, isEmailReady, isEmailBlocked };
}
