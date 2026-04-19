import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260415-practice-01-claude-code-methodology.md";

export const metadata: Metadata = {
  title:
    "TTS Harness 工程实践（一）：Claude Code 编程方法论 | hiveden.dev",
  description:
    "16 天 239 commits 的实践总结：人机协作的边界、CLAUDE.md 演进、Wave/Gate 并行开发、指令粒度与效率、确定性任务 vs LLM 任务的边界。",
};

export default function Practice01Page() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="工程实践（一）：Claude Code 编程方法论"
        />
      </main>
      <Footer />
    </div>
  );
}
