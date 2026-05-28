import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/constants/categories";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryPageVariant = "majstori" | "izvodjaci" | "prosecne-cene";

const VARIANT_COPY: Record<
  CategoryPageVariant,
  { titlePrefix: string; description: string; ctaHref: string; ctaLabel: string }
> = {
  majstori: {
    titlePrefix: "Majstori —",
    description: "Pošaljite besplatnu potražnju i pronađite proverene majstore za ovu uslugu.",
    ctaHref: "/register/client",
    ctaLabel: "Pošalji potražnju",
  },
  izvodjaci: {
    titlePrefix: "Izvođači —",
    description: "Pregledajte izvođače i majstore specijalizovane za ovu kategoriju.",
    ctaHref: "/register/client",
    ctaLabel: "Pronađi izvođača",
  },
  "prosecne-cene": {
    titlePrefix: "Prosečne cene —",
    description: "Informacije o prosečnim cenama rada za ovu kategoriju usluga.",
    ctaHref: "/register/client",
    ctaLabel: "Zatraži ponudu",
  },
};

interface CategoryLandingProps {
  slug: string;
  variant: CategoryPageVariant;
}

export function CategoryLanding({ slug, variant }: CategoryLandingProps) {
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const copy = VARIANT_COPY[variant];
  const displayName =
    variant === "prosecne-cene" ? `${category.name}, cena` : category.name;

  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          {copy.titlePrefix}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{displayName}</h1>
        <p className="mt-4 text-lg text-slate-600">{copy.description}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`${copy.ctaHref}?category=${category.slug}`}
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-600 hover:bg-brand-700")}
          >
            {copy.ctaLabel}
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Nazad na početnu
          </Link>
        </div>
      </div>
    </main>
  );
}
