import type { JobListing } from "@/types";

export function hasJobMapLocation(job: Pick<JobListing, "locationPinned" | "latitude" | "longitude">) {
  return Boolean(job.locationPinned && job.latitude != null && job.longitude != null);
}

export function getJobMapCoordinates(job: Pick<JobListing, "locationPinned" | "latitude" | "longitude">) {
  if (!hasJobMapLocation(job)) return null;
  return { latitude: job.latitude!, longitude: job.longitude! };
}
