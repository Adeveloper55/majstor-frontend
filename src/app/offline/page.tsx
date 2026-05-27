import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Nema interneta</h1>
      <p className="text-slate-600">Proverite konekciju i pokušajte ponovo.</p>
      <Link href="/"><Button>Početna stranica</Button></Link>
    </main>
  );
}
