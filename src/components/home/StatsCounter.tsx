"use client";

import { useEffect, useState } from "react";

const STATS = [
  { value: 5000, suffix: "+", label: "majstora" },
  { value: 20000, suffix: "+", label: "poslova" },
  { value: 100, suffix: "+", label: "gradova" },
] as const;

const DURATION_MS = 2200;
const TICK_MS = 16;

function formatStatNumber(n: number): string {
  return n.toLocaleString("sr-RS");
}

function CounterItem({
  value,
  suffix,
  label,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;

    let cancelled = false;
    const startedAt = performance.now();

    const intervalId = setInterval(() => {
      if (cancelled) return;

      const progress = Math.min((performance.now() - startedAt) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress >= 1) {
        setDisplay(value);
        clearInterval(intervalId);
      }
    }, TICK_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [start, value]);

  return (
    <div className="stats-counter-item text-center">
      <p className="stats-counter-value" aria-live="polite">
        {formatStatNumber(display)}
        {suffix}
      </p>
      <p className="stats-counter-label">{label}</p>
    </div>
  );
}

export function StatsCounter() {
  const [start, setStart] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStart(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="stats-counter-inline" aria-label="Statistike platforme">
      {STATS.map((stat) => (
        <CounterItem key={stat.label} {...stat} start={start} />
      ))}
    </div>
  );
}
