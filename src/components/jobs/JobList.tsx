import { JobCard } from "./JobCard";
import type { JobListing } from "@/types";

interface JobListProps {
  jobs: JobListing[];
  showDistance?: boolean;
  emptyMessage?: string;
}

export function JobList({ jobs, showDistance = false, emptyMessage = "Nema poslova." }: JobListProps) {
  if (!jobs.length) {
    return <p className="text-base text-slate-500">{emptyMessage}</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} showDistance={showDistance} />
      ))}
    </div>
  );
}
