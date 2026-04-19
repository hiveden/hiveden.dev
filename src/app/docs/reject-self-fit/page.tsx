import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260409-reject-self-fit.md";

export const metadata: Metadata = {
  title: "拒绝自拟合 — 现阶段试行 | hiveden.dev",
  description:
    "把上下文沉淀到自己的个人网站，不沉淀到 AI 的记忆里——一次反主流的个人实验记录。",
};

export default function RejectSelfFitPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="拒绝自拟合 — 现阶段试行"
        />
      </main>
      <Footer />
    </div>
  );
}
