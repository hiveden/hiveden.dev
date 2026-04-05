export function PipelineDiagram() {
  const steps = [
    { label: "Script", sub: "JSON chunks" },
    { label: "Fish TTS", sub: "语音合成" },
    { label: "WhisperX", sub: "质量校验" },
    { label: "Claude", sub: "自动修复" },
    { label: "Output", sub: "87% pass" },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-3 px-1">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className="rounded border border-accent/20 bg-surface px-3 py-2 text-center min-w-[60px] sm:min-w-[72px]">
              <div className="text-xs font-mono text-foreground">{step.label}</div>
              <div className="text-[10px] text-subtle">{step.sub}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <span className="text-accent/40 text-xs mx-1 shrink-0">{"→"}</span>
          )}
        </div>
      ))}
    </div>
  );
}
