"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  COMPANY_SERVICE_GROUPS,
  filterServiceGroups,
} from "@/constants/companyServiceGroups";
import { validateStepTwo } from "@/lib/companyRegistrationValidation";
import type { CompanyRegistrationStepTwoData } from "@/types/companyRegistration";
import { ServiceAccordionGroup } from "./ServiceAccordionGroup";
import { SelectedServiceTags } from "./SelectedServiceTags";
import { RegistrationStepActions } from "./RegistrationStepActions";

const MAX_DESCRIPTION = 100;

interface CompanyRegistrationStepServicesProps {
  data: CompanyRegistrationStepTwoData;
  onChange: (data: CompanyRegistrationStepTwoData) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CompanyRegistrationStepServices({
  data,
  onChange,
  onBack,
  onNext,
}: CompanyRegistrationStepServicesProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [errors, setErrors] = useState<{ services?: string; description?: string }>({});
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const selectedSet = useMemo(() => new Set(data.selectedServiceIds), [data.selectedServiceIds]);

  const { groups: filteredGroups, openGroupIds } = useMemo(
    () => filterServiceGroups(filterQuery),
    [filterQuery]
  );

  const displayGroups = filterQuery.trim() ? filteredGroups : COMPANY_SERVICE_GROUPS;

  useEffect(() => {
    if (openGroupIds.length > 0) {
      setOpenGroups((prev) => {
        const next = new Set(prev);
        openGroupIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [openGroupIds]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleService = (id: string) => {
    const next = selectedSet.has(id)
      ? data.selectedServiceIds.filter((x) => x !== id)
      : [...data.selectedServiceIds, id];
    onChange({ ...data, selectedServiceIds: next });
    if (errors.services) setErrors((e) => ({ ...e, services: undefined }));
  };

  const removeService = (id: string) => {
    onChange({
      ...data,
      selectedServiceIds: data.selectedServiceIds.filter((x) => x !== id),
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= MAX_DESCRIPTION) {
      onChange({ ...data, companyShortDescription: value });
      if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateStepTwo(data.selectedServiceIds, data.companyShortDescription);
    setErrors(result.errors);
    if (!result.isValid) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="service-filter" className="text-sm font-medium text-slate-800">
          Navedite delatnosti kojim se bavite:
        </Label>
        <Input
          id="service-filter"
          placeholder="Ovde upišite 3 glavne delatnosti"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="mt-2 h-12 rounded-lg"
        />
      </div>

      <SelectedServiceTags selectedIds={data.selectedServiceIds} onRemove={removeService} />

      <hr className="border-slate-200" />

      <p className="text-sm text-amber-800">
        Delatnosti birate jednom pri prijavi — naknadna izmena nije moguća.
      </p>
      <p className="text-sm text-slate-600">
        Kliknite na odgovarajuće ponuđene oblasti i označite radove koje obavljate:
      </p>

      {errors.services && <p className="text-sm text-red-600">{errors.services}</p>}

      <div className="-mx-1 max-h-[42vh] space-y-3 overflow-y-auto px-1 sm:max-h-none sm:overflow-visible">
        {displayGroups.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Nema rezultata za uneti pojam
          </p>
        ) : (
          displayGroups.map((group) => (
            <ServiceAccordionGroup
              key={group.id}
              group={group}
              isOpen={openGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
              selectedIds={selectedSet}
              onToggleService={toggleService}
            />
          ))
        )}
      </div>

      <div>
        <Label htmlFor="company-desc" className="text-sm font-medium text-slate-800">
          Ukratko opišite vaše preduzeće da bi vas stranke lakše odabrale:
        </Label>
        <div className="relative mt-2">
          <textarea
            id="company-desc"
            rows={4}
            placeholder="Ukratko opišite vašu ponudu, iskustva, prednosti..."
            value={data.companyShortDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className={cn(
              "w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20",
              errors.description && "border-red-400"
            )}
          />
          <span className="absolute bottom-2 right-3 text-xs text-slate-400">
            {data.companyShortDescription.length}/{MAX_DESCRIPTION}
          </span>
        </div>
        {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
      </div>

      <RegistrationStepActions onBack={onBack} />
    </form>
  );
}
