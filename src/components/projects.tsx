type ProjectType = "article" | "repo" | "doc";

type Project = {
  name: string;
  type: ProjectType;
  repo?: string;
  tagline: string;
  description: string;
  date: string;
  tech: string[];
  github?: string;
  docs?: string;
  video?: string;
  download?: string;
};

const PROJECTS: Project[] = [
  {
    name: "curve-fit",
    type: "article",
    tagline: "curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么",
    description:
      "一堂 ML 入门课意外命名了与 AI 长期协作的双向拟合现象——从决策树调参讲到认知层面的 curve-fit，以及为什么有一个词这件事本身就是解药。",
    docs: "/docs/curve-fit",
    tech: ["ML 入门", "Claude Code", "Meta", "认知"],
    date: "2026.04",
  },
  {
    name: "ai-engineer-roadmap",
    type: "repo",
    repo: "hiveden/ai-engineer-roadmap",
    tagline: "AI Engineer 学习路线图",
    description:
      "面向全栈工程师转型 AI Engineer 的系统化路线：基础能力、Agent 架构、多 Agent 编排、工程化实践与开源项目索引。",
    github: "https://github.com/hiveden/ai-engineer-roadmap",
    tech: ["Roadmap", "Agent", "LLM", "Engineering"],
    date: "2026.04",
  },
  {
    name: "mac-local-llm-benchmark",
    type: "repo",
    repo: "hiveden/mac-local-llm-benchmark",
    tagline: "Mac 本地 LLM 基准测试",
    description:
      "Apple Silicon 上 Ollama vs oMLX vs mlx-lm 的横向对比。统一 harness + provider 适配器架构，跨期基线追踪。",
    github: "https://github.com/hiveden/mac-local-llm-benchmark",
    tech: ["Ollama", "oMLX", "mlx-lm", "Python"],
    date: "2026.04",
  },
  {
    name: "tts-agent-harness",
    type: "repo",
    repo: "hiveden/tts-agent-harness",
    tagline: "三段式 TTS 自动化流水线",
    description:
      "Fish TTS + WhisperX + Claude 组成的多 Agent 生产线。87% chunk 自动通过质量校验，未通过的进入修复循环，3 轮内收敛。",
    github: "https://github.com/hiveden/tts-agent-harness",
    tech: ["Node.js", "Fish TTS", "WhisperX", "Claude"],
    date: "2026.03",
  },
  {
    name: "local-model-deployment",
    type: "doc",
    tagline: "Ollama on Apple Silicon 完整部署指南",
    description:
      "从安装到性能优化、模型选型（MoE vs Dense）、Docker 集成、踩坑记录。含 ToolRef RAG 引擎实战案例和基准测试数据。",
    docs: "/docs/local-model-deployment",
    download: "/downloads/local-model-deployment.md",
    tech: ["Ollama", "Apple Silicon", "qwen3", "Docker"],
    date: "2026.04",
  },
];

async function getStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

const CARD_BASE =
  "group relative block rounded-xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(168,85,247,0.25)]";

function ArticleCard({ project }: { project: Project }) {
  return (
    <a
      href={project.docs}
      className={`${CARD_BASE} p-6 lg:p-8`}
    >
      {/* Accent strip on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

      {/* Meta */}
      <div className="mb-3 flex items-center gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="text-accent">¶</span>
        <span>Article</span>
        <span className="text-border">·</span>
        <span>{project.date}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-xl lg:text-2xl text-foreground group-hover:text-accent transition-colors leading-snug mb-3">
        {project.tagline}
      </h3>

      {/* Description — full, not clamped */}
      <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
        {project.description}
      </p>

      {/* Tech tags + CTA */}
      <div className="flex flex-wrap items-center gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md bg-accent/5 border border-accent/15 px-2 py-0.5 text-[10px] text-accent/80 font-mono"
          >
            {t}
          </span>
        ))}
        <span className="ml-auto text-xs text-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          阅读全文 →
        </span>
      </div>
    </a>
  );
}

function RepoCard({
  project,
  stars,
}: {
  project: Project;
  stars: number | null | undefined;
}) {
  const href = project.github;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${CARD_BASE} p-5`}
    >
      {/* Meta header */}
      <div className="mb-3 flex items-center justify-between gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="flex items-center gap-1.5">
          <span className="text-accent">❯</span>
          <span>Repo</span>
          <span className="text-border">·</span>
          <span>{project.date}</span>
        </span>
        {stars != null && (
          <span className="flex items-center gap-1 text-subtle">
            <span className="text-accent">★</span>
            <span>{stars}</span>
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-mono font-semibold text-sm lg:text-base text-foreground group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
        {project.tagline}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-subtle font-mono"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="text-[10px] text-subtle font-mono py-0.5">
            +{project.tech.length - 3}
          </span>
        )}
      </div>
    </a>
  );
}

function DocCard({ project }: { project: Project }) {
  return (
    <a href={project.docs} className={`${CARD_BASE} p-6`}>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="text-accent">§</span>
        <span>Guide</span>
        <span className="text-border">·</span>
        <span>{project.date}</span>
        {project.download && (
          <>
            <span className="text-border">·</span>
            <span>可下载 .md</span>
          </>
        )}
      </div>

      <h3 className="font-semibold text-base lg:text-lg text-foreground group-hover:text-accent transition-colors leading-snug mb-2">
        {project.tagline}
      </h3>

      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4 max-w-2xl">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-subtle font-mono"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
        {label}
      </h3>
      <span className="text-xs text-subtle font-mono">{count}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
    </div>
  );
}

export async function Projects() {
  const starsMap = new Map<string, number>();
  const repoProjects = PROJECTS.filter((p) => p.repo);
  const results = await Promise.all(
    repoProjects.map((p) => getStars(p.repo!))
  );
  repoProjects.forEach((p, i) => {
    if (results[i] != null) starsMap.set(p.name, results[i]!);
  });

  const articles = PROJECTS.filter((p) => p.type === "article");
  const repos = PROJECTS.filter((p) => p.type === "repo");
  const docs = PROJECTS.filter((p) => p.type === "doc");

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <h2 className="mb-10 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>

      {articles.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="文章 · 思考" count={articles.length} />
          <div className="grid grid-cols-1 gap-5">
            {articles.map((p) => (
              <ArticleCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="开源项目" count={repos.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((p) => (
              <RepoCard key={p.name} project={p} stars={starsMap.get(p.name)} />
            ))}
          </div>
        </div>
      )}

      {docs.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="技术笔记" count={docs.length} />
          <div
            className={`grid gap-4 ${
              docs.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {docs.map((p) => (
              <DocCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 text-xs text-subtle font-mono">
        <div className="w-8 h-px bg-border" />
        <span>2026.05 → building...</span>
      </div>
    </section>
  );
}
