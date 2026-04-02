const LINKS = [
  { label: "GitHub", href: "https://github.com/hiveden" },
  { label: "B站", href: "https://space.bilibili.com/386785020" },
  {
    label: "抖音",
    href: "https://www.douyin.com/user/MS4wLjABAAAAYflHY7e_rvzEYrVzAAm5qyOAwGpSOgEQ_NB8LYDW8kQ5lE2IkiFXDneVXbTcqZBj",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-sm text-subtle">
          <span className="text-accent font-mono font-bold">{">_"}</span>
          <span>hiveden.dev</span>
        </div>
        <div className="flex gap-5">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-subtle hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
