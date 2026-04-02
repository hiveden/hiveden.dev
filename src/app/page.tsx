import { Terminal } from "@/components/terminal";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <span className="text-accent font-bold text-lg">{">_"}</span>
        <span className="text-foreground font-semibold">hiveden.dev</span>
      </header>

      {/* Terminal */}
      <div className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <Terminal />
        </div>
      </div>
    </main>
  );
}
