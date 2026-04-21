import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260421-ai-jobs.md";

export const metadata: Metadata = {
  title: "2026-04 AI 应用开发岗位市场总览 | hiveden.dev",
  description:
    "限定 AI 应用开发方向（Agent / LLM 工程 / 大模型应用 / 智能体 / AI 全栈），不含算法研究 / 预训练。基于 9096 条有效岗位的结构化分析：薪资矩阵、Top 公司画像、融资阶段、需求侧画像、职业资本评分、校招信号。",
};

export default function AiJobsPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="2026-04 AI 应用开发岗位市场总览"
        />
      </main>
      <Footer />
    </div>
  );
}
