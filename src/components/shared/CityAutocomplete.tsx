"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { searchCities } from "@/lib/citySearch";
import { getCityCoordinates } from "@/constants/serbianCities";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function CityAutocomplete({
  value,
  onChange,
  label = "Upišite mesto izvođenja radova:",
  placeholder = "Lokacija izvođenja radova",
  error,
  required = true,
}: CityAutocompleteProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = searchCities(value);
    setSuggestions(next);
    setOpen(Boolean(value.trim()) && next.length > 0);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const unknownCity = value.trim().length >= 2 && !getCityCoordinates(value) && suggestions.length === 0;

  return (
    <div ref={wrapRef} className="relative">
      <Label htmlFor="city-autocomplete">{label}</Label>
      <div className="relative mt-2">
        <Input
          id="city-autocomplete"
          value={value}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
          className={cn("h-12 pr-10 text-base", error && "border-red-400")}
        />
        <MapPin className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>
      {open && (
        <ul
          id={listId}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-50 hover:text-brand-700"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
      {unknownCity && (
        <p className="mt-1.5 text-sm text-amber-700">
          Grad nije prepoznat — proverite pravopis ili izaberite iz predloga.
        </p>
      )}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
