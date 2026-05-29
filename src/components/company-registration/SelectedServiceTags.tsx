"use client";

import { X } from "lucide-react";
import { getSubcategoryById } from "@/constants/companyServiceGroups";

interface SelectedServiceTagsProps {
  selectedIds: string[];
  onRemove: (id: string) => void;
}

export function SelectedServiceTags({ selectedIds, onRemove }: SelectedServiceTagsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedIds.map((id) => {
        const sub = getSubcategoryById(id);
        if (!sub) return null;
        return (
          <span
            key={id}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-800 sm:text-sm"
          >
            <span className="truncate">{sub.name}</span>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="shrink-0 rounded-full p-0.5 hover:bg-brand-100"
              aria-label={`Ukloni ${sub.name}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        );
      })}
    </div>
  );
}
