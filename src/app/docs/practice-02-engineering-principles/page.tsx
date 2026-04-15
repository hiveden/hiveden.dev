import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/practice-02-engineering-principles.md";

export const metadata: Metadata = {
  title:
    "TTS Harness 工程实践（二）：编程工程化思想 | hiveden.dev",
  description:
    "确定性优先原则、类型安全贯穿全链路、分层架构演进、Dev Mode 双轨设计、Pipeline 拓扑、测试分层、错误处理架构。",
};

export default function Practice02Page() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="工程实践（二）：编程工程化思想"
        />
      </main>
      <Footer />
    </div>
  );
}
