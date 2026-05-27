import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          Majstor na klik
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/contact">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Kontakt
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Prijava
            </Button>
          </Link>
          <Link href="/register/client">
            <Button size="sm">Registracija</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
