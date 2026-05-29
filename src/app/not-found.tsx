import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Stranica nije pronađena</h1>
      <p className="max-w-md text-slate-600">Tražena stranica ne postoji ili je uklonjena.</p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Nazad na početnu
      </Link>
    </main>
  );
}
