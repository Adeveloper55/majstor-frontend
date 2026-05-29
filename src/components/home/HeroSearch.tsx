"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBestCategoryMatch,
  getCategoryHref,
  getSearchResultsHref,
  searchCategories,
} from "@/lib/categorySearch";

const PLACEHOLDER = "Šta vam treba? Npr. fasada, krov, prozori...";
const MIN_CHARS = 1;
const MAX_SUGGESTIONS = 8;

interface HeroSearchProps {
  initialQuery?: string;
}

export function HeroSearch({ initialQuery = "" }: HeroSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmed = query.trim();
  const suggestions = useMemo(() => {
    if (trimmed.length < MIN_CHARS) return [];
    return searchCategories(trimmed, MAX_SUGGESTIONS);
  }, [trimmed]);

  const showDropdown = open && trimmed.length >= MIN_CHARS;

  const navigateToResult = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(getCategoryHref(slug));
    },
    [router]
  );

  const runSearch = useCallback(() => {
    const q = query.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }

    const best = getBestCategoryMatch(q);
    setOpen(false);

    if (best) {
      router.push(getCategoryHref(best.slug));
    } else {
      router.push(getSearchResultsHref(q));
    }
  }, [query, router]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigateToResult(suggestions[activeIndex].category.slug);
      } else {
        runSearch();
      }
      return;
    }

    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    }
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[850px] px-1 sm:px-0">
      <div
        className={cn(
          "relative flex h-[62px] items-center rounded-full border border-slate-200/80 bg-white",
          "shadow-[0_8px_30px_rgb(0_0_0_/_0.12)] transition-shadow focus-within:shadow-[0_12px_40px_rgb(0_0_0_/_0.15)]",
          showDropdown && "rounded-b-none rounded-t-[2rem] border-b-transparent shadow-none"
        )}
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (trimmed.length >= MIN_CHARS) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Pretraga usluga"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
          className="h-full w-full rounded-full bg-transparent py-0 pl-6 pr-14 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none sm:pl-8 sm:text-lg"
        />
        <button
          type="button"
          onClick={runSearch}
          aria-label="Pretraži"
          className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-brand-600"
        >
          <Search className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>

      {showDropdown && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[62px] z-50 overflow-hidden rounded-b-2xl border border-t-0 border-slate-200/80 bg-white shadow-[0_12px_40px_rgb(0_0_0_/_0.12)]"
        >
          {suggestions.length === 0 ? (
            <li className="px-5 py-4 text-sm text-slate-500">Nema rezultata za uneti pojam</li>
          ) : (
            suggestions.map(({ category }, index) => (
              <li key={category.slug} role="option" aria-selected={activeIndex === index}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigateToResult(category.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm transition-colors sm:text-base",
                    activeIndex === index
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                  )}
                >
                  <Search className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
                  <span>{category.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
