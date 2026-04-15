import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllArticles, getAllArticleTags } from "@/data/projects";
import { ArticlesFilter } from "@/components/articles-filter";

export const metadata: Metadata = {
  title: "全部文章 | hiveden.dev",
  description:
    "hiveden.dev 全部文章索引——AI 工程实践、认知思考、技术复盘，支持按标签筛选。",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const tags = getAllArticleTags();

  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <nav className="mb-8 text-sm text-muted font-mono">
          <a
            href="/"
            className="hover:text-foreground transition-colors"
          >
            首页
          </a>
          <span className="mx-2 text-subtle">/</span>
          <span className="text-foreground">全部文章</span>
        </nav>
        <Suspense>
          <ArticlesFilter articles={articles} tags={tags} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
