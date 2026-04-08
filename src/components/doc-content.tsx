"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Giscus from "@giscus/react";
import React, { useEffect, useRef, useState } from "react";

interface DocItem {
  title: string;
  href: string;
}

const DOCS: DocItem[] = [
  {
    title: "curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么",
    href: "/docs/curve-fit",
  },
  {
    title: "Ollama on Apple Silicon 完整部署指南",
    href: "/docs/local-model-deployment",
  },
];

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].replace(/[`*_~]/g, "");
      items.push({
        id: generateId(text),
        level: match[1].length,
        text,
      });
    }
  }
  return items;
}

/* Chevron that rotates based on collapsed state */
function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
    >
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

function TocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="12" r="0.5" fill="currentColor" />
      <circle cx="3" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}

function useTocState(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    for (const el of headings) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleItems: TocItem[] = [];
  let skipUntilLevel: number | null = null;
  for (const item of items) {
    if (skipUntilLevel !== null) {
      if (item.level > skipUntilLevel) continue;
      skipUntilLevel = null;
    }
    visibleItems.push(item);
    if (item.level === 2 && collapsedSections.has(item.id)) skipUntilLevel = 2;
  }

  const hasChildren = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    if (items[i].level === 2 && i + 1 < items.length && items[i + 1].level === 3) {
      hasChildren.add(items[i].id);
    }
  }

  return { activeId, collapsedSections, toggleSection, visibleItems, hasChildren };
}

function TocList({
  visibleItems,
  activeId,
  hasChildren,
  collapsedSections,
  toggleSection,
  onNavigate,
}: {
  visibleItems: TocItem[];
  activeId: string;
  hasChildren: Set<string>;
  collapsedSections: Set<string>;
  toggleSection: (id: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5 text-sm border-l border-border">
      {visibleItems.map((item) => (
        <li key={item.id} className="group relative">
          <div className="flex items-center">
            {item.level === 2 && hasChildren.has(item.id) ? (
              <button
                onClick={() => toggleSection(item.id)}
                className="absolute -left-3 opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center text-subtle hover:text-foreground transition-all"
              >
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${collapsedSections.has(item.id) ? "-rotate-90" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ) : null}
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              className={`block py-1 pr-2 w-full break-words leading-snug transition-colors ${
                item.level === 3 ? "pl-6" : "pl-3"
              } ${
                activeId === item.id
                  ? "text-accent border-l-2 border-accent -ml-px"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.text}
            </a>
          </div>
        </li>
      ))}
      <li>
        <a
          href="#comments"
          onClick={onNavigate}
          className={`block py-1 pl-3 pr-2 leading-snug transition-colors ${
            activeId === "comments"
              ? "text-accent border-l-2 border-accent -ml-px"
              : "text-muted hover:text-foreground"
          }`}
        >
          评论
        </a>
      </li>
    </ul>
  );
}

type TocState = ReturnType<typeof useTocState>;

function MobileToc({ toc }: { toc: TocState }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed left-4 top-20 z-[60] lg:hidden w-9 h-9 flex items-center justify-center rounded-md bg-surface/90 backdrop-blur-sm border border-border text-muted hover:text-accent shadow-sm transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none -translate-x-2" : "opacity-100 translate-x-0"
        }`}
        title="展开目录"
      >
        <TocIcon />
      </button>

      {/* Backdrop — always rendered for fade animation */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] lg:hidden bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — always rendered for slide animation */}
      <nav
        onClick={(e) => e.stopPropagation()}
        className={`fixed left-0 top-[57px] z-[80] lg:hidden h-[calc(100dvh-57px)] w-[85%] max-w-[320px] bg-background border-r border-border shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/60">
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider">目录</p>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-subtle hover:text-foreground hover:bg-surface transition-colors -mr-1.5"
            aria-label="关闭目录"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <TocList {...toc} onNavigate={() => setOpen(false)} />
        </div>
      </nav>
    </>
  );
}

function TableOfContents({ toc }: { toc: TocState }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-8" : "w-56"
      }`}
    >
      <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden">
        {/* Toggle button - always present */}
        <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center mb-3`}>
          {!collapsed && (
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider">
              目录
            </p>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-subtle hover:text-foreground hover:bg-surface transition-colors"
            title={collapsed ? "展开目录" : "收起目录"}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>

        {/* TOC content - fade out when collapsed */}
        <div
          className={`transition-opacity duration-300 ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <TocList {...toc} />
        </div>
      </div>
    </nav>
  );
}

function HeadingRenderer({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
        : "";
  const id = generateId(text);
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return <Tag id={id}>{children}</Tag>;
}

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1] : "";
}

function extractDescription(markdown: string): string {
  const match = markdown.match(/^>\s+\*\*(.+?)\*\*[：:]\s*(.+)$/m);
  if (match) return `${match[1]}: ${match[2]}`;
  const lines = markdown.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">") && !trimmed.startsWith("---")) {
      return trimmed;
    }
  }
  return "";
}

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

function CommentIcon() {
  return (
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
}

/* Detect giscus iframe load; returns a ref to attach to the Giscus wrapper */
function useGiscusLoaded() {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timeout = setTimeout(() => setLoaded(true), 5000);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector("iframe.giscus-frame");
      if (iframe) {
        iframe.addEventListener(
          "load",
          () => {
            setLoaded(true);
            clearTimeout(timeout);
          },
          { once: true }
        );
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return { loaded, containerRef };
}

/* Shared panel body: article info + Giscus + docs nav. Used by both desktop rail and mobile drawer. */
function CommentsPanelContent({
  title,
  description,
  containerRef,
  giscusLoaded,
  onNavigate,
}: {
  title: string;
  description: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  giscusLoaded: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <>
      {/* Section 1: Article info */}
      <div className="pb-5 mb-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>

      {/* Section 2: Giscus */}
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
            loading="lazy"
          />
        </div>
      </div>

      {/* Section 3: Docs navigation */}
      <div className="border-t border-border mt-8 pt-6">
        <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">
          全部文档
        </p>
        <ul className="space-y-1 text-sm">
          {DOCS.map((doc) => (
            <li key={doc.href}>
              <Link
                href={doc.href}
                onClick={onNavigate}
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
    </>
  );
}

/* Mirror of CollapseIcon but pointing right by default (so rotate-180 gives left) */
function CollapseIconRight({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
    >
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}

function CommentsRail({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { loaded: giscusLoaded, containerRef } = useGiscusLoaded();

  return (
    <nav
      className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-8" : "w-56"
      }`}
    >
      <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden">
        {/* Header — mirror TOC */}
        <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center mb-3`}>
          {!collapsed && (
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider">
              评论
            </p>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-subtle hover:text-foreground hover:bg-surface transition-colors"
            title={collapsed ? "展开评论" : "收起评论"}
          >
            <CollapseIconRight collapsed={collapsed} />
          </button>
        </div>

        {/* Content — fade out when collapsed */}
        <div
          className={`transition-opacity duration-300 ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <CommentsPanelContent
            title={title}
            description={description}
            containerRef={containerRef}
            giscusLoaded={giscusLoaded}
          />
        </div>
      </div>
    </nav>
  );
}

/* Mobile drawer — mirrors MobileToc but on the right side */
function MobileComments({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const { loaded: giscusLoaded, containerRef } = useGiscusLoaded();

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-4 top-20 z-[60] lg:hidden w-9 h-9 flex items-center justify-center rounded-md bg-surface/90 backdrop-blur-sm border border-border text-muted hover:text-accent shadow-sm transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none translate-x-2" : "opacity-100 translate-x-0"
        }`}
        title="展开评论"
      >
        <CommentIcon />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] lg:hidden bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — always rendered for slide animation, from the right */}
      <nav
        onClick={(e) => e.stopPropagation()}
        className={`fixed right-0 top-[57px] z-[80] lg:hidden h-[calc(100dvh-57px)] w-[85%] max-w-[320px] bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/60">
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider">
            评论
          </p>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-subtle hover:text-foreground hover:bg-surface transition-colors -mr-1.5"
            aria-label="关闭评论"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <CommentsPanelContent
            title={title}
            description={description}
            containerRef={containerRef}
            giscusLoaded={giscusLoaded}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </nav>
    </>
  );
}

export function DocContent({
  content,
  breadcrumb,
}: {
  content: string;
  breadcrumb?: string;
}) {
  const tocItems = extractToc(content);
  const title = extractTitle(content);
  const description = extractDescription(content);
  const toc = useTocState(tocItems);

  return (
    <>
      <MobileToc toc={toc} />
      <MobileComments title={title} description={description} />
      <div className="flex gap-8 lg:gap-12 w-full">
        <TableOfContents toc={toc} />
        <div className="flex-1 min-w-0">
          {breadcrumb ? (
            <nav className="mb-8 text-sm text-muted font-mono">
              <Link href="/" className="hover:text-foreground transition-colors">
                首页
              </Link>
              <span className="mx-2 text-subtle">/</span>
              <span className="text-foreground">{breadcrumb}</span>
            </nav>
          ) : null}
          <article className="prose min-w-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <HeadingRenderer level={2}>{children}</HeadingRenderer>
                ),
                h3: ({ children }) => (
                  <HeadingRenderer level={3}>{children}</HeadingRenderer>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
        <CommentsRail title={title} description={description} />
      </div>
    </>
  );
}
