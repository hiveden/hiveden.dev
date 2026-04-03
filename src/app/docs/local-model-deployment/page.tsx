import fs from "fs";
import path from "path";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocContent } from "@/components/doc-content";

export const dynamic = "force-static";

export const metadata = {
  title: "Ollama on Apple Silicon 完整部署指南 | hiveden.dev",
  description:
    "Ollama 在 Apple Silicon Mac 上的完整部署指南：安装、性能优化、模型选型、Docker 集成、踩坑记录。",
};

export default function LocalModelDeploymentPage() {
  const filePath = path.join(
    process.cwd(),
    "src/content/docs/local-model-deployment.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-8 text-sm text-muted font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span className="mx-2 text-subtle">/</span>
          <span className="text-foreground">Ollama on Apple Silicon 完整部署指南</span>
        </nav>
        <DocContent content={content} />
      </main>
      <Footer />
    </div>
  );
}
