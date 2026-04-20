"use client";

import { useEffect, useState } from "react";

/**
 * Homepage card view badge. Read-only — never increments.
 * Returns null while loading (and for zero-view items) to avoid
 * layout shift noise and empty-looking new posts.
 */
export function ViewBadge({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`/api/views/${slug}`)
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
  }, [slug]);

  if (count === null || count === 0) return null;
  return (
    <span className="text-subtle" title={`${count.toLocaleString()} 次阅读`}>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="inline-block -mt-0.5 mr-1"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {count.toLocaleString()}
    </span>
  );
}
