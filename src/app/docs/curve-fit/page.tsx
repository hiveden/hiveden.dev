import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260408-curve-fit.md";

export const metadata: Metadata = {
  title: "curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么 | hiveden.dev",
  description:
    "一堂 ML 入门课意外命名了与 AI 长期协作的双向拟合现象——从决策树调参到认知层面的 curve-fit。",
};

export default function CurveFitPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么"
        />
      </main>
      <Footer />
    </div>
  );
}
