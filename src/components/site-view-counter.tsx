"use client";

import { useEffect, useState } from "react";

/**
 * Site-wide accumulated view count. Read-only — the number is
 * incremented server-side as a side effect of every article
 * POST /api/views/[slug]. Renders null until loaded to avoid a
 * lonely "—" after the accent dot.
 */
export function SiteViewCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site/views")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { count: number } | null) => {
        if (!cancelled && d) setCount(d.count);
      })
      .catch(() => {
        /* noop */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null || count === 0) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-subtle font-mono"
      title={`累计 ${count.toLocaleString()} 次阅读`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>累计 {count.toLocaleString()} 次阅读</span>
    </span>
  );
}
