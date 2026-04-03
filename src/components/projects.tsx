import { PipelineDiagram } from "./pipeline-diagram";

type Project = {
  name: string;
  tagline: string;
  description: string;
  date: string;
  tech: string[];
  github?: string;
  docs?: string;
  video?: string;
  download?: string;
  stars?: number;
  hasDiagram?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "local-model-deployment",
    tagline: "Ollama on Apple Silicon 完整部署指南",
    description:
      "从安装到性能优化、模型选型（MoE vs Dense）、Docker 集成、踩坑记录。含 ToolRef RAG 引擎实战案例和基准测试数据。",
    docs: "/docs/local-model-deployment",
    download: "/downloads/local-model-deployment.md",
    tech: ["Ollama", "Apple Silicon", "qwen3", "Docker"],
    date: "2026.04",
  },
  {
    name: "tts-agent-harness",
    tagline: "三段式 TTS 自动化流水线",
    description:
      "Fish TTS + WhisperX + Claude 组成的多 Agent 生产线。87% chunk 自动通过质量校验，未通过的进入修复循环，3 轮内收敛。",
    github: "https://github.com/hiveden/tts-agent-harness",
    docs: "/projects/tts-agent-harness",
    video: "https://space.bilibili.com/386785020",
    tech: ["Node.js", "Fish TTS", "WhisperX", "Claude"],
    stars: 21,
    date: "2026.03",
    hasDiagram: true,
  },
];

export function Projects() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <h2 className="mb-8 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>
      <div className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          {PROJECTS.map((project) => (
            <div key={project.tagline} className="relative pl-8">
              {/* Timeline dot + line */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-accent bg-background shrink-0 mt-2" />
                <div className="w-px flex-1 bg-border" />
              </div>

              {/* Date */}
              <div className="text-xs text-subtle font-mono mb-2">
                {project.date}
              </div>

              {/* Card */}
              <div className="group rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors overflow-hidden">
                {/* Diagram area */}
                {project.hasDiagram && (
                  <div className="border-b border-border bg-background/50 px-5 pt-4 pb-3">
                    <PipelineDiagram />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-mono font-semibold text-lg group-hover:text-accent transition-colors">
                      {project.docs ? (
                        <a href={project.docs} className="hover:underline">
                          {project.tagline}
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    {project.stars != null && (
                      <span className="shrink-0 text-xs text-subtle font-mono">
                        {project.stars} stars
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mb-1">{project.tagline}</p>
                  <p className="text-sm text-muted mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {project.docs && (
                      <a
                        href={project.docs}
                        className="rounded border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent hover:bg-accent/10 transition-colors"
                      >
                        文档
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {project.video && (
                      <a
                        href={project.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                      >
                        视频讲解
                      </a>
                    )}
                    {project.download && (
                      <a
                        href={project.download}
                        download
                        className="rounded border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                      >
                        下载 .md
                      </a>
                    )}
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-border/50 px-2 py-0.5 text-xs text-subtle font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Timeline: next */}
          <div className="relative pl-8 pt-6">
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border-2 border-border bg-background shrink-0 mt-2" />
            </div>
            <div className="text-xs text-subtle font-mono mb-1">2026.05</div>
            <div className="text-sm text-subtle">building...</div>
          </div>
        </div>
      </div>
    </section>
  );
}
