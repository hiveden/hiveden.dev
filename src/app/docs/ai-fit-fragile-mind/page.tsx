import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/ai-fit-fragile-mind.md";

export const metadata: Metadata = {
  title: "当安慰没有尽头——AI 拟合与心智脆弱状态 | hiveden.dev",
  description:
    "AI 拟合在心智脆弱状态下的真正危险：不是说错话，而是让"停留在脆弱状态"变得可持续。一期视频的思考题，不给答案。",
};

export default function AiFitFragileMindPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="AI 拟合与心智脆弱状态"
        />
      </main>
      <Footer />
    </div>
  );
}
