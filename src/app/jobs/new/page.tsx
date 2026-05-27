"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { JobForm } from "@/components/jobs/JobForm";

export default function NewJobPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <JobForm />
      </main>
    </div>
  );
}
