import Link from "next/link";

const NAV_ITEMS = [
  { label: "Projects", href: "#projects" },
  { label: "Channel", href: "#channel" },
  { label: "GitHub", href: "https://github.com/hiveden", external: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent font-mono font-bold text-lg">{">_"}</span>
          <span className="font-semibold">hiveden.dev</span>
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
