type ProjectType = "article" | "repo" | "doc";

type Project = {
  name: string;
  type: ProjectType;
  repo?: string;
  tagline: string;
  description: string;
  publishedAt: string; // ISO date, e.g. "2026-04-09"
  updatedAt?: string; // ISO date, optional; omit if same as publishedAt
  tech: string[];
  github?: string;
  docs?: string;
  video?: string;
  download?: string;
};

const RECENT_UPDATE_WINDOW_DAYS = 7;

function formatDate(iso: string): string {
  // "2026-04-09" -> "2026.04.09"
  return iso.slice(0, 10).replaceAll("-", ".");
}

function isRecentlyUpdated(project: Project): boolean {
  if (!project.updatedAt || project.updatedAt === project.publishedAt) return false;
  const updated = new Date(project.updatedAt).getTime();
  if (Number.isNaN(updated)) return false;
  const ageDays = (Date.now() - updated) / 86_400_000;
  return ageDays >= 0 && ageDays <= RECENT_UPDATE_WINDOW_DAYS;
}

function DateBadge({ project }: { project: Project }) {
  const recent = isRecentlyUpdated(project);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{formatDate(project.publishedAt)}</span>
      {recent && (
        <span
          title={`更新于 ${formatDate(project.updatedAt!)}`}
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(168,85,247,0.8)]"
        />
      )}
    </span>
  );
}

const PROJECTS: Project[] = [
  {
    name: "ai-fit-fragile-mind",
    type: "article",
    tagline: "当安慰没有尽头——AI 拟合与心智脆弱状态",
    description:
      "AI 拟合在心智脆弱状态下的真正危险：不是说错话，而是让"停留在脆弱状态"变得可持续。一期视频的思考题，不给答案。",
    docs: "/docs/ai-fit-fragile-mind",
    tech: ["AI 安全", "Meta", "认知"],
    publishedAt: "2026-04-12",
  },
  {
    name: "reject-self-fit",
    type: "article",
    tagline: "拒绝自拟合 — 现阶段试行",
    description:
      "把上下文沉淀到自己的个人网站，不沉淀到 AI 的记忆里。一次反主流的个人实验记录：AI 从长期伙伴降级为一次性推理引擎。",
    docs: "/docs/reject-self-fit",
    tech: ["Agent", "Context", "Meta", "认知"],
    publishedAt: "2026-04-09",
  },
  {
    name: "learning-methodology",
    type: "article",
    tagline: "一份学东西的 checklist",
    description:
      "几条关于学东西的规矩：哪些靠读就懂、哪些只能靠做；闭环要跑到发布和反馈；以及怎么不被「懂了」的感觉糊弄过去。",
    docs: "/docs/learning-methodology",
    tech: ["学习", "Meta", "认知"],
    publishedAt: "2026-04-09",
  },
  {
    name: "curve-fit-script",
    type: "article",
    tagline: "一篇关于 curve-fit 的视频稿是如何被改出来、发出去的",
    description:
      "一段两天对话的结构化整理：围绕一篇视频稿件的迭代、Claude 的中招、发布策略选择，以及对“普通人在 AI 时代”的延伸思考。",
    docs: "/docs/curve-fit-script",
    tech: ["写作", "Claude Code", "Meta", "认知"],
    publishedAt: "2026-04-09",
  },
  {
    name: "curve-fit",
    type: "article",
    tagline: "curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么",
    description:
      "一堂 ML 入门课意外命名了与 AI 长期协作的双向拟合现象——从决策树调参讲到认知层面的 curve-fit，以及为什么有一个词这件事本身就是解药。",
    docs: "/docs/curve-fit",
    tech: ["ML 入门", "Claude Code", "Meta", "认知"],
    publishedAt: "2026-04-08",
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
    publishedAt: "2026-04-08",
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
    publishedAt: "2026-04-06",
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
    publishedAt: "2026-04-02",
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
    publishedAt: "2026-04-03",
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
    <a href={project.docs} className={`${CARD_BASE} p-5 lg:p-6`}>
      {/* Accent strip on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

      {/* Meta */}
      <div className="mb-3 flex items-center gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="text-accent">¶</span>
        <span>Article</span>
        <span className="text-border">·</span>
        <DateBadge project={project} />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-base lg:text-lg text-foreground group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
        {project.tagline}
      </h3>

      {/* Description — clamped */}
      <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
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
          <DateBadge project={project} />
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
        <DateBadge project={project} />
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

  const sorted = [...PROJECTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const articles = sorted.filter((p) => p.type === "article");
  const repos = sorted.filter((p) => p.type === "repo");
  const docs = sorted.filter((p) => p.type === "doc");

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <h2 className="mb-10 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>

      {articles.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="文章 · 思考" count={articles.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
