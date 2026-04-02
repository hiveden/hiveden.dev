"use client";

import { useState, useEffect } from "react";

const LINES = [
  { prompt: "~", cmd: "git log --oneline | wc -l" },
  { output: "2,147 commits" },
  { prompt: "~", cmd: "ls projects/ | head -3" },
  { output: "tts-agent-harness/  harness-demo/  hiveden.dev/" },
  { prompt: "~", cmd: "_", cursor: true },
];

export function TypingHero() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= LINES.length) return;
    const delay = LINES[visibleLines].output ? 200 : 600;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <section className="relative overflow-hidden">
      {/* Glow */}
      <div className="glow-accent absolute inset-0 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Big brand */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          <span className="text-accent font-mono">{">_"}</span>{" "}
          <span className="text-foreground">Build in public,</span>
          <br />
          <span className="text-foreground ml-12 md:ml-16">ship in code.</span>
        </h1>

        {/* Terminal mini */}
        <div className="mt-8 rounded-lg border border-border bg-surface/60 backdrop-blur-sm p-5 max-w-lg font-mono text-sm">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="leading-relaxed">
              {line.prompt !== undefined ? (
                <div>
                  <span className="text-subtle">{line.prompt}</span>
                  <span className="text-accent">{" $ "}</span>
                  <span className="text-foreground">
                    {line.cursor ? "" : line.cmd}
                  </span>
                  {line.cursor && (
                    <span className="inline-block w-2 h-4 bg-accent ml-0.5 translate-y-0.5 animate-blink" />
                  )}
                </div>
              ) : (
                <div className="text-muted">{line.output}</div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-subtle text-sm">
          开源项目 · 技术文档 · 工程实践记录
        </p>
      </div>
    </section>
  );
}
