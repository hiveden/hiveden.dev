import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260415-我用OpenClaw做了一个资讯推送然后决定再做一遍.md";

export const metadata: Metadata = {
  title:
    "我用 OpenClaw 做了一个资讯推送，然后决定再做一遍 | hiveden.dev",
  description:
    "一篇关于 Agent 产品设计的思考：LLM 到底该在什么节点、以什么方式、多深地介入一个任务？",
};

export default function OpenclawNewsRedoPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="OpenClaw 资讯推送复盘"
        />
      </main>
      <Footer />
    </div>
  );
}
