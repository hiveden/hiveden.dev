import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/practice-03-requirements-design.md";

export const metadata: Metadata = {
  title:
    "TTS Harness 工程实践（三）：需求设计 | hiveden.dev",
  description:
    "从痛点到产品形态、做减法的艺术、面向下游的导出契约、渐进式 MVP、tts_text 分离、API Key 安全设计。",
};

export default function Practice03Page() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="工程实践（三）：需求设计"
        />
      </main>
      <Footer />
    </div>
  );
}
