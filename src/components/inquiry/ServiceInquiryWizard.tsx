"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import api from "@/lib/api";
import { isValidSerbianPhone } from "@/lib/phoneUtils";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getCityCoordinates, normalizeCityName } from "@/constants/serbianCities";
import { searchCities } from "@/lib/citySearch";
import {
  CATEGORY_INQUIRY_HINTS,
  DEFAULT_INQUIRY_HINTS,
  INQUIRY_TIMELINE_OPTIONS,
} from "@/constants/serviceInquiry";

interface ServiceInquiryWizardProps {
  categorySlug: string;
  categoryName: string;
  initialCity?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function ServiceInquiryWizard({
  categorySlug,
  categoryName,
  initialCity = "",
}: ServiceInquiryWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState(initialCity);
  const [timeline, setTimeline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [salutation, setSalutation] = useState<"G." | "Gđa.">("G.");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const hints = useMemo(
    () => CATEGORY_INQUIRY_HINTS[categorySlug] ?? DEFAULT_INQUIRY_HINTS,
    [categorySlug]
  );

  const progress = step === 5 ? 100 : step * 20;

  const validateStep = (current: Step) => {
    const next: Record<string, string> = {};
    if (current === 1) {
      if (!city.trim()) next.city = "Unesite grad.";
      else if (!getCityCoordinates(city)) {
        const best = searchCities(city, 1)[0];
        if (!best || normalizeCityName(best) !== normalizeCityName(city)) {
          next.city = "Izaberite grad iz predloga.";
        }
      }
    }
    if (current === 2 && !timeline) next.timeline = "Izaberite kada želite da počnete.";
    if (current === 3) {
      if (!detailedDescription.trim()) next.detailedDescription = "Opišite šta vam treba.";
    }
    if (current === 4) {
      if (!fullName.trim()) next.fullName = "Unesite ime ili naziv preduzeća.";
      if (!email.trim()) next.email = "Unesite email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Unesite ispravan email.";
      if (phone.trim() && !isValidSerbianPhone(phone)) next.phone = "Unesite ispravan broj telefona.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (step === 1 && city.trim() && !getCityCoordinates(city)) {
      const best = searchCities(city, 1)[0];
      if (best) setCity(best);
    }
    if (!validateStep(step)) return;
    setStep((s) => Math.min(5, s + 1) as Step);
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1) as Step);

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setErrors({});
    try {
      await api.post("/api/inquiries", {
        categorySlug,
        categoryName,
        city: city.trim(),
        startTimeline: timeline,
        shortDescription: shortDescription.trim() || undefined,
        detailedDescription: detailedDescription.trim(),
        salutation,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      setStep(5);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors({ submit: msg || "Greška pri slanju upita. Pokušajte ponovo." });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 5) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Upit je poslat!</h2>
        <p className="mt-3 text-slate-600">
          Hvala. Naš tim će vas kontaktirati za kategoriju <strong>{categoryName}</strong> u gradu{" "}
          <strong>{city}</strong>.
        </p>
        <Button className="mt-6 bg-brand-600 hover:bg-brand-700" onClick={() => router.push("/")}>
          Nazad na početnu
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">{categoryName}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-800 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <CityAutocomplete value={city} onChange={setCity} error={errors.city} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-center text-lg font-medium text-slate-800">Kada želite da počnete sa izvođenjem?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {INQUIRY_TIMELINE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTimeline(option)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
                    timeline === option
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.timeline && <p className="text-sm text-red-600">{errors.timeline}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <Label htmlFor="short-desc">Ukratko šta vam treba, do 5 reči:</Label>
              <Input
                id="short-desc"
                className="mt-2 h-12"
                placeholder="Šta vam je potrebno?"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="detail-desc">Opišite što detaljnije, šta vam treba:</Label>
              <Textarea
                id="detail-desc"
                className="mt-2 min-h-[140px]"
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
              />
              {errors.detailedDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.detailedDescription}</p>
              )}
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
              {hints.map((hint) => (
                <p key={hint} className="text-sm text-slate-400">
                  {hint}
                </p>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <p className="text-center text-lg font-medium text-slate-800">Kako da vas kontaktiramo?</p>
            <div>
              <Label htmlFor="inquiry-email">E-mail adresa:</Label>
              <Input
                id="inquiry-email"
                type="email"
                className="mt-2 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="inquiry-phone">Broj mobilnog telefona:</Label>
              <Input
                id="inquiry-phone"
                type="tel"
                className="mt-2 h-12"
                placeholder="npr. 0641234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            <div className="flex gap-4">
              {(["G.", "Gđa."] as const).map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="salutation"
                    checked={salutation === item}
                    onChange={() => setSalutation(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div>
              <Label htmlFor="inquiry-name">Ime i prezime ili preduzeće:</Label>
              <Input
                id="inquiry-name"
                className="mt-2 h-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Kategorija: <strong>{categoryName}</strong> · Grad: <strong>{city}</strong> · Početak:{" "}
              <strong>{timeline}</strong>
            </div>
            {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={goBack} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button type="button" className="min-w-[140px] bg-brand-600 hover:bg-brand-700" onClick={goNext}>
              Napred
            </Button>
          ) : (
            <Button
              type="button"
              className="min-w-[180px] bg-brand-600 hover:bg-brand-700"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Slanje..." : "Pošalji upit ›"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
