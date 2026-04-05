import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";
import { Comments } from "@/components/comments";

import content from "@/content/docs/local-model-deployment.md";

export const metadata = {
  title: "Ollama on Apple Silicon 完整部署指南 | hiveden.dev",
  description:
    "Ollama 在 Apple Silicon Mac 上的完整部署指南：安装、性能优化、模型选型、Docker 集成、踩坑记录。",
};

export default function LocalModelDeploymentPage() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-8 text-sm text-muted font-mono max-w-5xl mx-auto w-full">
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span className="mx-2 text-subtle">/</span>
          <span className="text-foreground">Ollama on Apple Silicon 完整部署指南</span>
        </nav>
        <DocContent content={content}>
          <Comments />
        </DocContent>
      </main>
      <Footer />
    </div>
  );
}
