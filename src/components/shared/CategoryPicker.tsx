"use client";

import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

const MAX_CATEGORIES = 10;

interface CategoryPickerProps {
  categories: Category[];
  selected: number[];
  onChange?: (ids: number[]) => void;
  max?: number;
  error?: string;
  readOnly?: boolean;
}

export function CategoryPicker({
  categories,
  selected,
  onChange,
  max = MAX_CATEGORIES,
  error,
  readOnly = false,
}: CategoryPickerProps) {
  const toggle = (id: number) => {
    if (readOnly || !onChange) return;
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
      return;
    }
    if (selected.length >= max) return;
    onChange([...selected, id]);
  };

  const visibleCategories = readOnly
    ? categories.filter((cat) => selected.includes(cat.id))
    : categories;

  return (
    <div>
      <Label className="mb-2 block">
        {readOnly ? "Vaše kategorije poslova" : "Kategorije poslova *"}{" "}
        {!readOnly && (
          <span className="font-normal text-slate-500">
            ({selected.length}/{max} — minimum 1)
          </span>
        )}
      </Label>
      {readOnly && (
        <p className="mb-2 text-sm text-slate-500">
          Kategorije su izabrane pri registraciji i ne mogu se menjati. Za izmene kontaktirajte podršku.
        </p>
      )}
      <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 p-2">
        <div className="flex flex-wrap gap-2">
          {visibleCategories.length === 0 && readOnly && (
            <p className="text-sm text-slate-500">Nema izabranih kategorija.</p>
          )}
          {visibleCategories.map((cat) => {
            const isSelected = selected.includes(cat.id);
            const disabled = readOnly || (!isSelected && selected.length >= max);
            return (
              <button
                key={cat.id}
                type="button"
                disabled={disabled}
                onClick={() => toggle(cat.id)}
                className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary-800 bg-primary-50 text-primary-900"
                    : disabled
                      ? "cursor-not-allowed border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                } ${readOnly ? "cursor-default" : ""}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
