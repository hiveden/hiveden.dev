import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260420-interview-analysis.md";

export const metadata: Metadata = {
  title: "2026-04-20 面经深度分析报告 | hiveden.dev",
  description:
    "1884 篇面经、9666 道题目、36 家公司的结构化分析：Tier 分层必考清单、Top 公司画像、Tag 时效演进、跨公司高频真八股。",
};

export default function InterviewAnalysisPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="2026-04-20 面经深度分析报告"
        />
      </main>
      <Footer />
    </div>
  );
}
