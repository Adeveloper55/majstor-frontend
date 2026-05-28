"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/constants";
import type { JobFiltersState } from "@/hooks/useJobs";
import type { Category } from "@/types";

interface JobFiltersProps {
  categories: Category[];
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
}

const defaultFilters: JobFiltersState = {
  categories: [],
  city: "",
  radius: 50,
  minTokenCost: 0,
  maxTokenCost: 100,
  sort: "newest",
};

export function JobFilters({ categories, filters, onChange }: JobFiltersProps) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (!local.lat && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocal((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude })),
        () => {}
      );
    }
  }, [local.lat]);

  const toggleCategory = (id: number) => {
    setLocal((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }));
  };

  const apply = () => onChange(local);
  const reset = () => {
    const resetState = { ...defaultFilters, lat: local.lat, lon: local.lon };
    setLocal(resetState);
    onChange(resetState);
  };

  return (
    <aside className="w-full shrink-0 space-y-5 rounded-xl border-2 border-slate-200 bg-white p-5 lg:w-72">
      <h2 className="text-lg font-bold text-slate-900">Filteri</h2>

      <div>
        <Label className="mb-2">Kategorije</Label>
        <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-100 p-2">
          <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium ${
                local.categories.includes(cat.id)
                  ? "border-primary-800 bg-primary-50 text-primary-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="city">Grad</Label>
        <Input id="city" value={local.city} onChange={(e) => setLocal({ ...local, city: e.target.value })} placeholder="npr. Beograd" />
      </div>

      <div>
        <Label htmlFor="radius">Radijus: {local.radius} km</Label>
        <input
          id="radius"
          type="range"
          min={5}
          max={200}
          step={5}
          value={local.radius}
          onChange={(e) => setLocal({ ...local, radius: Number(e.target.value) })}
          className="mt-2 w-full accent-primary-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="minToken">Min tokeni</Label>
          <Input id="minToken" type="number" min={0} value={local.minTokenCost} onChange={(e) => setLocal({ ...local, minTokenCost: Number(e.target.value) })} />
        </div>
        <div>
          <Label htmlFor="maxToken">Max tokeni</Label>
          <Input id="maxToken" type="number" min={0} value={local.maxTokenCost} onChange={(e) => setLocal({ ...local, maxTokenCost: Number(e.target.value) })} />
        </div>
      </div>

      <div>
        <Label htmlFor="sort">Sortiraj</Label>
        <Select
          id="sort"
          value={local.sort}
          options={SORT_OPTIONS}
          onValueChange={(value) => setLocal({ ...local, sort: value })}
          className="mt-1"
        />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={apply}>Primeni</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
    </aside>
  );
}
