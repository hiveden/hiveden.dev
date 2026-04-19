import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260409-learning-methodology.md";

export const metadata: Metadata = {
  title: "一份学东西的 checklist | hiveden.dev",
  description:
    "几条关于学东西的规矩：哪些靠读就懂、哪些只能靠做；闭环要跑到发布和反馈；以及怎么不被「懂了」的感觉糊弄过去。",
};

export default function LearningMethodologyPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="一份学东西的 checklist"
        />
      </main>
      <Footer />
    </div>
  );
}
