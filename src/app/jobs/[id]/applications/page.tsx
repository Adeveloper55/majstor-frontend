import { redirect } from "next/navigation";

export default function JobApplicationsRedirect({ params }: { params: { id: string } }) {
  redirect(`/jobs/${params.id}`);
}
