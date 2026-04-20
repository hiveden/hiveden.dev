export type ProjectType = "article" | "repo" | "doc";

export type Project = {
  name: string;
  type: ProjectType;
  repo?: string;
  tagline: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tech: string[];
  github?: string;
  docs?: string;
  video?: string;
  download?: string;
};

export const RECENT_UPDATE_WINDOW_DAYS = 7;

export function formatDate(iso: string): string {
  return iso.slice(0, 10).replaceAll("-", ".");
}

export function isRecentlyUpdated(project: Project): boolean {
  if (!project.updatedAt || project.updatedAt === project.publishedAt)
    return false;
  const updated = new Date(project.updatedAt).getTime();
  if (Number.isNaN(updated)) return false;
  const ageDays = (Date.now() - updated) / 86_400_000;
  return ageDays >= 0 && ageDays <= RECENT_UPDATE_WINDOW_DAYS;
}

export const PROJECTS: Project[] = [
  {
    name: "interview-analysis",
    type: "article",
    tagline: "2026-04-20 面经深度分析报告",
    description:
      "1884 篇面经、9666 道题目、36 家公司的结构化分析：Tier 分层必考清单、Top 公司画像、Tag 时效演进、跨公司高频真八股与备考时间分配建议。",
    docs: "/docs/interview-analysis",
    tech: ["AI Agent", "面经", "数据分析", "求职"],
    publishedAt: "2026-04-20",
  },
  {
    name: "disable-auto-memory",
    type: "article",
    tagline: "我为什么关闭了 Claude 的 Auto Memory",
    description:
      "关闭 Auto Memory 不是因为它有 bug，而是它的设计假设与学习期状态不匹配：快照一旦落盘就开始过期，追加式记忆与默认遗忘的人脑机制方向相反。",
    docs: "/docs/disable-auto-memory",
    tech: ["Claude Code", "Memory", "Agent", "认知"],
    publishedAt: "2026-04-19",
  },
  {
    name: "openclaw-news-redo",
    type: "article",
    tagline: "我用 OpenClaw 做了一个资讯推送，然后决定再做一遍",
    description:
      "一篇关于 Agent 产品设计的思考：LLM 到底该在什么节点、以什么方式、多深地介入一个任务？",
    docs: "/docs/openclaw-news-redo",
    tech: ["Agent", "OpenClaw", "产品设计", "认知"],
    publishedAt: "2026-04-15",
  },
  {
    name: "tts-reflection",
    type: "article",
    tagline: "从 TTS 工具上线谈起：几个被踩出来的认知",
    description:
      "围绕一个 TTS 流水线工具的复盘：code is cheap 的真实边界、单机脚本到服务化的断层、以及为什么\u201C写个 AI 脚本就能解决\u201D往往是最贵的幻觉。",
    docs: "/docs/tts-reflection",
    tech: ["TTS", "服务化", "Agent", "认知"],
    publishedAt: "2026-04-15",
  },
  {
    name: "practice-01-claude-code-methodology",
    type: "article",
    tagline: "TTS Harness 工程实践（一）：Claude Code 编程方法论",
    description:
      "16 天 239 commits 的实践总结：人机协作的边界、CLAUDE.md 演进、Wave/Gate 并行开发、指令粒度与效率、确定性任务 vs LLM 任务的边界。",
    docs: "/docs/practice-01-claude-code-methodology",
    tech: ["Claude Code", "Agent", "工程实践"],
    publishedAt: "2026-04-15",
  },
  {
    name: "practice-02-engineering-principles",
    type: "article",
    tagline: "TTS Harness 工程实践（二）：编程工程化思想",
    description:
      "确定性优先原则、类型安全贯穿全链路、分层架构演进、Dev Mode 双轨设计、Pipeline 拓扑、测试分层、错误处理架构。",
    docs: "/docs/practice-02-engineering-principles",
    tech: ["TypeScript", "FastAPI", "工程实践"],
    publishedAt: "2026-04-15",
  },
  {
    name: "practice-03-requirements-design",
    type: "article",
    tagline: "TTS Harness 工程实践（三）：需求设计",
    description:
      "从痛点到产品形态、做减法的艺术、面向下游的导出契约、渐进式 MVP、tts_text 分离、API Key 安全设计。",
    docs: "/docs/practice-03-requirements-design",
    tech: ["产品设计", "MVP", "工程实践"],
    publishedAt: "2026-04-15",
  },
  {
    name: "ai-fit-fragile-mind",
    type: "article",
    tagline: "当安慰没有尽头——AI 拟合与心智脆弱状态",
    description:
      "AI 拟合在心智脆弱状态下的真正危险：不是说错话，而是让\u201c停留在脆弱状态\u201d变得可持续。一个思考题，不给答案。",
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
      "一段两天对话的结构化整理：围绕一篇视频稿件的迭代、Claude 的中招、发布策略选择，以及对\u201c普通人在 AI 时代\u201d的延伸思考。",
    docs: "/docs/curve-fit-script",
    tech: ["写作", "Claude Code", "Meta", "认知"],
    publishedAt: "2026-04-09",
  },
  {
    name: "curve-fit",
    type: "article",
    tagline:
      "curve-fit：和 AI 协作一年之后，我才知道我每天在防御什么",
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

export function getAllArticles(): Project[] {
  return PROJECTS.filter((p) => p.type === "article").sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

export function getAllArticleTags(): string[] {
  const tags = new Set<string>();
  for (const p of PROJECTS) {
    if (p.type === "article") {
      for (const t of p.tech) tags.add(t);
    }
  }
  return [...tags];
}
