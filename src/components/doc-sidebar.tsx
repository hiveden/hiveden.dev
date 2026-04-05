"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Giscus from "@giscus/react";

interface DocItem {
  title: string;
  href: string;
}

const docs: DocItem[] = [
  {
    title: "Ollama on Apple Silicon 完整部署指南",
    href: "/docs/local-model-deployment",
  },
];

const CommentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

function GiscusSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="rounded-lg border border-border bg-surface/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-border" />
          <div className="h-3 w-24 rounded bg-border" />
        </div>
        <div className="h-20 rounded bg-border/50" />
        <div className="flex justify-end">
          <div className="h-7 w-16 rounded bg-border" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-border" />
          <div className="h-3 w-20 rounded bg-border" />
          <div className="h-3 w-12 rounded bg-border" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-border/50" />
          <div className="h-3 w-3/4 rounded bg-border/50" />
        </div>
      </div>
    </div>
  );
}

interface DocSidebarProps {
  title: string;
  description: string;
}

export function DocSidebar({ title, description }: DocSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [giscusLoaded, setGiscusLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect giscus iframe load on mount (preloaded, not tied to open state)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timeout = setTimeout(() => setGiscusLoaded(true), 5000);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector("iframe.giscus-frame");
      if (iframe) {
        iframe.addEventListener("load", () => {
          setGiscusLoaded(true);
          clearTimeout(timeout);
        });
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Closed: comment icon button, top-24 aligned with left TOC */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-4 top-24 z-[60] w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border text-muted hover:text-accent transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        title="展开评论"
      >
        <CommentIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-[57px] right-0 z-40 h-[calc(100%-57px)] w-80 bg-background border-l border-border transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="overflow-y-auto h-full px-5 py-6">
          {/* Section 1: Article info + collapse button */}
          <div className="pb-5 mb-5 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground leading-snug mb-2">
                  {title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {description}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-0.5 w-7 h-7 shrink-0 flex items-center justify-center rounded-md border border-border text-subtle hover:text-foreground hover:bg-surface transition-colors"
                title="收起面板"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section 2: Comments */}
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
            评论
          </p>
          <div ref={containerRef}>
            {!giscusLoaded && <GiscusSkeleton />}
            <div className={giscusLoaded ? "" : "h-0 overflow-hidden"}>
              <Giscus
                repo="hiveden/hiveden.dev"
                repoId="R_kgDOR3goHQ"
                category="Announcements"
                categoryId="DIC_kwDOR3goHc4C6Fip"
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="dark"
                lang="zh-CN"
              />
            </div>
          </div>

          {/* Section 3: Docs navigation */}
          <div className="border-t border-border mt-8 pt-6">
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">
              全部文档
            </p>
            <ul className="space-y-1 text-sm">
              {docs.map((doc) => (
                <li key={doc.href}>
                  <Link
                    href={doc.href}
                    className={`block px-3 py-1.5 rounded-md transition-colors ${
                      pathname === doc.href
                        ? "text-accent bg-accent/10"
                        : "text-muted hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Push content when open */}
      <style>{`
        main {
          margin-right: ${open ? "320px" : "0"};
          transition: margin-right 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
