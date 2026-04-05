"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useState } from "react";
import { DocSidebar } from "./doc-sidebar";

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
              className={`block py-1 w-full whitespace-nowrap transition-colors ${
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
          className={`block py-1 pl-3 whitespace-nowrap transition-colors ${
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed left-4 top-24 z-[60] lg:hidden w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border text-muted hover:text-accent transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        title="展开目录"
      >
        <TocIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <nav
            className="absolute left-0 top-[57px] h-[calc(100%-57px)] w-72 bg-background border-r border-border overflow-y-auto px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider">目录</p>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border text-subtle hover:text-foreground hover:bg-surface transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <TocList {...toc} onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      )}
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
  // Extract first blockquote content as description
  const match = markdown.match(/^>\s+\*\*(.+?)\*\*[：:]\s*(.+)$/m);
  if (match) return `${match[1]}: ${match[2]}`;
  // Fallback: first paragraph after title
  const lines = markdown.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">") && !trimmed.startsWith("---")) {
      return trimmed;
    }
  }
  return "";
}

export function DocContent({
  content,
  header,
  children,
}: {
  content: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const tocItems = extractToc(content);
  const title = extractTitle(content);
  const description = extractDescription(content);
  const toc = useTocState(tocItems);

  return (
    <>
      <MobileToc toc={toc} />
      <div className="flex gap-8 lg:gap-12 w-full">
        <TableOfContents toc={toc} />
        <div className="flex-1 min-w-0">
          {header}
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
          {children}
        </div>
      </div>
      <DocSidebar title={title} description={description} />
    </>
  );
}
