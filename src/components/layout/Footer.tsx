import Link from "next/link";
import { Wrench } from "lucide-react";
import { APP_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="page-container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-primary-800">
          <Wrench className="h-5 w-5" />
          <span className="font-semibold">{APP_NAME}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href="/" className="hover:text-primary-800">
            Početna strana
          </Link>
          <Link href="/contact" className="hover:text-primary-800">
            Kontakt
          </Link>
          <Link href="/magazin" className="hover:text-primary-800">
            Magazin
          </Link>
          <Link href="/register" className="hover:text-primary-800">
            Registracija
          </Link>
          <Link href="/register/handyman" className="hover:text-primary-800">
            Registracija majstora
          </Link>
          <Link href="/login" className="hover:text-primary-800">
            Prijava
          </Link>
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} {APP_NAME}</p>
      </div>
    </footer>
  );
}
