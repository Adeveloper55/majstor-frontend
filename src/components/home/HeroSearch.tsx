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
  /** hero = tamni glass na početnoj; light = svetli glass na /pretraga */
  variant?: "hero" | "light";
}

export function HeroSearch({ initialQuery = "", variant = "hero" }: HeroSearchProps) {
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

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-3xl px-1 sm:px-0">
      <div
        className={cn(
          "relative flex h-[58px] items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 sm:h-[62px] sm:pl-6 sm:pr-2",
          isHero ? "hero-search-bar" : "hero-search-bar-light",
          showDropdown && "rounded-b-none rounded-t-[2rem] border-b-transparent"
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0",
            isHero ? "text-blue-300/80" : "text-slate-400"
          )}
          strokeWidth={2.25}
          aria-hidden
        />
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
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent py-0 text-base focus:outline-none sm:text-lg",
            isHero
              ? "text-white placeholder:text-blue-200/60"
              : "text-slate-700 placeholder:text-slate-400"
          )}
        />
        <button
          type="button"
          onClick={runSearch}
          aria-label="Pretraži"
          className="hero-search-btn"
        >
          Pretraži
        </button>
      </div>

      {showDropdown && (
        <ul
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-2xl border border-t-0",
            isHero
              ? "border-blue-400/25 bg-slate-900/95 shadow-glow-blue-sm backdrop-blur-xl"
              : "border-slate-200/80 bg-white/95 shadow-[0_12px_40px_rgb(0_0_0_/_0.12)] backdrop-blur-md"
          )}
        >
          {suggestions.length === 0 ? (
            <li className={cn("px-5 py-4 text-sm", isHero ? "text-blue-200/70" : "text-slate-500")}>
              Nema rezultata za uneti pojam
            </li>
          ) : (
            suggestions.map(({ category }, index) => (
              <li key={category.slug} role="option" aria-selected={activeIndex === index}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigateToResult(category.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm transition-colors sm:text-base",
                    isHero
                      ? activeIndex === index
                        ? "bg-blue-500/20 text-cyan-300"
                        : "text-blue-50 hover:bg-blue-500/15 hover:text-cyan-300"
                      : activeIndex === index
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
