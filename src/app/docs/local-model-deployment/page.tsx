import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

import content from "@/content/docs/20260403-local-model-deployment.md";

export const metadata: Metadata = {
  title: "Ollama on Apple Silicon 完整部署指南 | hiveden.dev",
  description:
    "Ollama 在 Apple Silicon Mac 上的完整部署指南：安装、性能优化、模型选型、Docker 集成、踩坑记录。",
};

export default function LocalModelDeploymentPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <DocContent
          content={content}
          breadcrumb="Ollama on Apple Silicon 完整部署指南"
        />
      </main>
      <Footer />
    </div>
  );
}
