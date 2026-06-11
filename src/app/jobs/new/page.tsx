"use client";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { JobForm } from "@/components/jobs/JobForm";

export default function NewJobPage() {
  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
        <JobForm />
      </main>
    </PanelLayout>
  );
}
