"use client";

import { useEffect, useState } from "react";

const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
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
  );
}

/**
 * Detail-page view counter. Mount once, increments at most once per
 * (slug, browser) every 24h via localStorage dedup. Gracefully degrades
 * to a blank on network / KV failure.
 */
export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const storageKey = `viewed:${slug}`;
    let shouldIncrement = true;
    try {
      const last = localStorage.getItem(storageKey);
      if (last && Date.now() - Number(last) < DEDUP_WINDOW_MS) {
        shouldIncrement = false;
      }
    } catch {
      /* private mode etc. — fall through and increment */
    }

    const run = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`, {
          method: shouldIncrement ? "POST" : "GET",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
        if (shouldIncrement) {
          try {
            localStorage.setItem(storageKey, String(Date.now()));
          } catch {
            /* noop */
          }
        }
      } catch {
        /* offline — leave count null */
      }
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-subtle font-mono">
      <EyeIcon />
      <span>{count === null ? "—" : `${count.toLocaleString()} 次阅读`}</span>
    </span>
  );
}
