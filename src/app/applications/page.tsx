"use client";

import { HandymanViewedJobsHistory } from "@/components/jobs/HandymanViewedJobsHistory";
import { PanelLayout } from "@/components/layout/PanelLayout";

export default function ApplicationsPage() {
  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
        <HandymanViewedJobsHistory />
      </main>
    </PanelLayout>
  );
}
