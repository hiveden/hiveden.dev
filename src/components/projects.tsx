const PROJECTS = [
  {
    name: "tts-agent-harness",
    tagline: "三段式 TTS 自动化流水线",
    description:
      "Fish TTS + WhisperX + Claude，87% chunk 自动通过，修复循环 3 轮收敛。",
    github: "https://github.com/hiveden/tts-agent-harness",
    docs: "/projects/tts-agent-harness",
    video: "https://space.bilibili.com/386785020",
    tech: ["Node.js", "Fish TTS", "WhisperX", "Claude"],
    stars: 21,
  },
];

export function Projects() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <h2 className="mb-6 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>
      <div className="grid gap-4">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-mono font-semibold text-lg">
                {project.name}
              </h3>
              <span className="shrink-0 text-xs text-subtle font-mono">
                {project.stars} stars
              </span>
            </div>
            <p className="text-sm text-foreground mb-1">{project.tagline}</p>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.docs && (
                <a
                  href={project.docs}
                  className="rounded border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent hover:bg-accent/10 transition-colors"
                >
                  文档
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                GitHub
              </a>
              {project.video && (
                <a
                  href={project.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  视频讲解
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
        ))}

        {/* Coming soon */}
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-subtle">
          更多项目陆续上线
        </div>
      </div>
    </section>
  );
}
