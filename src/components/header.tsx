import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent font-mono font-bold text-base lg:text-lg">{">_"}</span>
          <span className="font-semibold text-sm lg:text-base">hiveden.dev</span>
        </Link>
        <a
          href="https://github.com/hiveden"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
