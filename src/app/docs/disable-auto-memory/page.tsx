import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260419-我为什么关闭了Claude的Auto Memory.md";

export const metadata: Metadata = {
  title: "我为什么关闭了 Claude 的 Auto Memory | hiveden.dev",
  description:
    "关闭 Auto Memory 不是因为它有 bug，而是它的设计假设与学习期状态不匹配：快照一旦落盘就开始过期，追加式记忆与默认遗忘的人脑机制方向相反。",
};

export default function DisableAutoMemoryPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="我为什么关闭了 Claude 的 Auto Memory"
        />
      </main>
      <Footer />
    </div>
  );
}
