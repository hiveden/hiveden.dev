"use client";

import { useSearchParams, useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { ArticleCard } from "@/components/projects";

export function ArticlesFilter({
  articles,
  tags,
}: {
  articles: Project[];
  tags: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? articles.filter((a) => a.tech.includes(activeTag))
    : articles;

  function setTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    const qs = params.toString();
    router.replace(qs ? `/articles?${qs}` : "/articles", { scroll: false });
  }

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">
        <span className="text-accent font-mono">#</span> 文章 · 思考
        <span className="ml-2 text-xs text-subtle font-mono">
          {filtered.length}
        </span>
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setTag(null)}
          className={`rounded px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
            !activeTag
              ? "bg-accent/20 text-accent border border-accent/30"
              : "bg-border/40 text-subtle hover:text-foreground"
          }`}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTag(activeTag === tag ? null : tag)}
            className={`rounded px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
              activeTag === tag
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-border/40 text-subtle hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <ArticleCard key={p.name} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-subtle text-center py-12">
          没有匹配的文章
        </p>
      )}
    </>
  );
}
