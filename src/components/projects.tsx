const PROJECTS = [
  {
    name: "tts-agent-harness",
    description:
      "多 Agent TTS 生产线：Fish TTS + WhisperX + Claude，支持跨集记忆和自动修复循环。",
    url: "https://github.com/hiveden/tts-agent-harness",
    tech: ["Node.js", "Fish TTS", "WhisperX", "Claude"],
    stars: 21,
  },
];

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-8 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>
      <div className="grid gap-4">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-mono font-semibold group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
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
              <span className="shrink-0 text-xs text-subtle font-mono">
                {project.stars} stars
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
