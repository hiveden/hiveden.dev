import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/curve-fit-script.md";

export const metadata: Metadata = {
  title: "一篇关于 curve-fit 的视频稿是如何被改出来、发出去的 | hiveden.dev",
  description:
    '一段两天对话的结构化整理：围绕一篇视频稿件的迭代、Claude 的中招、发布策略选择，以及对"普通人在 AI 时代"的延伸思考。',
};

export default function CurveFitScriptPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="一篇关于 curve-fit 的视频稿是如何被改出来、发出去的"
        />
      </main>
      <Footer />
    </div>
  );
}
