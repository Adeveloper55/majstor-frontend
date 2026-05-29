"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceGroup } from "@/constants/companyServiceGroups";

interface ServiceAccordionGroupProps {
  group: ServiceGroup;
  isOpen: boolean;
  onToggle: () => void;
  selectedIds: Set<string>;
  onToggleService: (id: string) => void;
}

export function ServiceAccordionGroup({
  group,
  isOpen,
  onToggle,
  selectedIds,
  onToggleService,
}: ServiceAccordionGroupProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors hover:bg-slate-50 sm:gap-3 sm:px-4 sm:py-3.5"
      >
        <span className="text-sm font-semibold text-slate-900 sm:text-base">{group.title}</span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-slate-500 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 px-2 py-2 sm:px-4 sm:py-3">
          <ul className="space-y-1">
            {group.subcategories.map((sub) => {
              const checked = selectedIds.has(sub.id);
              return (
                <li key={sub.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleService(sub.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                    />
                    <span className="text-sm leading-snug text-slate-700">{sub.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
