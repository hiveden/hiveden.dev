import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/tts-reflection.md";

export const metadata: Metadata = {
  title:
    "从 TTS 工具上线谈起：几个被踩出来的认知 | hiveden.dev",
  description:
    "围绕一个 TTS 流水线工具的复盘：code is cheap 的真实边界、单机脚本到服务化的断层、以及为什么\u201C写个 AI 脚本就能解决\u201D往往是最贵的幻觉。",
};

export default function TtsReflectionPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="从 TTS 工具上线谈起"
        />
      </main>
      <Footer />
    </div>
  );
}
