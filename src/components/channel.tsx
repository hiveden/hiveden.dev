const EPISODES = [
  {
    title: "Harness Engineering — 从最小demo到TTS流水线落地",
    topic: "AI Agent 架构",
  },
  {
    title: "3月AI应用岗全景分析：1608岗位 × 5个维度",
    topic: "求职市场",
  },
  {
    title: "大厂AI工程真实技术栈：1353篇面经 × 36家公司",
    topic: "面经分析",
  },
  {
    title: "GitHub Stars 项目兴衰：怎么判断一个 AI 工具值不值得投入",
    topic: "工具评测",
  },
  {
    title: "250块买了1000美元API额度，一天烧光",
    topic: "成本优化",
  },
];

const PLATFORMS = [
  {
    name: "B站",
    url: "https://space.bilibili.com/386785020",
    clickable: true,
  },
  {
    name: "抖音",
    url: "https://www.douyin.com/user/MS4wLjABAAAAYflHY7e_rvzEYrVzAAm5qyOAwGpSOgEQ_NB8LYDW8kQ5lE2IkiFXDneVXbTcqZBj",
    clickable: true,
  },
  { name: "小红书", url: "", clickable: false },
  { name: "微信视频号", url: "", clickable: false },
];

export function Channel() {
  return (
    <section id="channel" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-2 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> 工具人研究Hive
      </h2>
      <p className="mb-8 text-sm text-muted">
        AI 工程 × 求职市场 × 工具评测，用数据说话的技术短视频
      </p>

      {/* Episode list */}
      <div className="mb-8 space-y-3">
        {EPISODES.map((ep) => (
          <div
            key={ep.title}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface px-5 py-4"
          >
            <span className="mt-0.5 shrink-0 rounded bg-accent/10 px-2 py-0.5 text-xs text-accent font-mono">
              {ep.topic}
            </span>
            <span className="text-sm text-muted">{ep.title}</span>
          </div>
        ))}
      </div>

      {/* Platform links */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-subtle">在这里找到我：</span>
        {PLATFORMS.map((p) =>
          p.clickable ? (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {p.name}
            </a>
          ) : (
            <span
              key={p.name}
              className="rounded-full border border-border px-3 py-1 text-xs text-subtle"
              title="搜索：工具人研究Hive"
            >
              {p.name}
            </span>
          )
        )}
        <span className="text-xs text-subtle ml-1">
          小红书 / 视频号搜索「工具人研究Hive」
        </span>
      </div>
    </section>
  );
}
