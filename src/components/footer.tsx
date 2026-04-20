import { SiteViewCounter } from "@/components/site-view-counter";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-sm text-subtle">
          <span className="text-accent font-mono font-bold">{">_"}</span>
          <span>hiveden.dev</span>
        </div>
        <div className="flex items-center gap-4">
          <SiteViewCounter />
          <a
            href="https://github.com/hiveden"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-subtle hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
