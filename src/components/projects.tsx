import {
  PROJECTS,
  type Project,
  formatDate,
  isRecentlyUpdated,
} from "@/data/projects";

const HOMEPAGE_ARTICLE_LIMIT = 4;

function DateBadge({ project }: { project: Project }) {
  const recent = isRecentlyUpdated(project);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{formatDate(project.publishedAt)}</span>
      {recent && (
        <span
          title={`更新于 ${formatDate(project.updatedAt!)}`}
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(168,85,247,0.8)]"
        />
      )}
    </span>
  );
}

const CARD_BASE =
  "group relative block rounded-xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(168,85,247,0.25)]";

export function ArticleCard({ project }: { project: Project }) {
  return (
    <a href={project.docs} className={`${CARD_BASE} p-5 lg:p-6`}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

      <div className="mb-3 flex items-center gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="text-accent">¶</span>
        <span>Article</span>
        <span className="text-border">·</span>
        <DateBadge project={project} />
      </div>

      <h3 className="font-semibold text-base lg:text-lg text-foreground group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
        {project.tagline}
      </h3>

      <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-subtle font-mono"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function RepoCard({
  project,
  stars,
}: {
  project: Project;
  stars: number | null | undefined;
}) {
  const href = project.github;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${CARD_BASE} p-5`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="flex items-center gap-1.5">
          <span className="text-accent">❯</span>
          <span>Repo</span>
          <span className="text-border">·</span>
          <DateBadge project={project} />
        </span>
        {stars != null && (
          <span className="flex items-center gap-1 text-subtle">
            <span className="text-accent">★</span>
            <span>{stars}</span>
          </span>
        )}
      </div>

      <h3 className="font-mono font-semibold text-sm lg:text-base text-foreground group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
        {project.tagline}
      </h3>

      <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-subtle font-mono"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="text-[10px] text-subtle font-mono py-0.5">
            +{project.tech.length - 3}
          </span>
        )}
      </div>
    </a>
  );
}

function DocCard({ project }: { project: Project }) {
  return (
    <a href={project.docs} className={`${CARD_BASE} p-6`}>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-subtle font-mono uppercase tracking-[0.15em]">
        <span className="text-accent">§</span>
        <span>Guide</span>
        <span className="text-border">·</span>
        <DateBadge project={project} />
        {project.download && (
          <>
            <span className="text-border">·</span>
            <span>可下载 .md</span>
          </>
        )}
      </div>

      <h3 className="font-semibold text-base lg:text-lg text-foreground group-hover:text-accent transition-colors leading-snug mb-2">
        {project.tagline}
      </h3>

      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4 max-w-2xl">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-subtle font-mono"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
        {label}
      </h3>
      <span className="text-xs text-subtle font-mono">{count}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
    </div>
  );
}

async function getStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

export async function Projects() {
  const starsMap = new Map<string, number>();
  const repoProjects = PROJECTS.filter((p) => p.repo);
  const results = await Promise.all(
    repoProjects.map((p) => getStars(p.repo!))
  );
  repoProjects.forEach((p, i) => {
    if (results[i] != null) starsMap.set(p.name, results[i]!);
  });

  const sorted = [...PROJECTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const articles = sorted.filter((p) => p.type === "article");
  const repos = sorted.filter((p) => p.type === "repo");
  const docs = sorted.filter((p) => p.type === "doc");

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <h2 className="mb-10 text-lg font-semibold">
        <span className="text-accent font-mono">#</span> Projects
      </h2>

      {articles.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="文章 · 思考" count={articles.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.slice(0, HOMEPAGE_ARTICLE_LIMIT).map((p) => (
              <ArticleCard key={p.name} project={p} />
            ))}
          </div>
          {articles.length > HOMEPAGE_ARTICLE_LIMIT && (
            <div className="mt-4 text-right">
              <a
                href="/articles"
                className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-mono transition-colors"
              >
                查看全部 →
              </a>
            </div>
          )}
        </div>
      )}

      {repos.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="开源项目" count={repos.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((p) => (
              <RepoCard
                key={p.name}
                project={p}
                stars={starsMap.get(p.name)}
              />
            ))}
          </div>
        </div>
      )}

      {docs.length > 0 && (
        <div className="mb-14">
          <SectionHeader label="技术笔记" count={docs.length} />
          <div
            className={`grid gap-4 ${
              docs.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {docs.map((p) => (
              <DocCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 text-xs text-subtle font-mono">
        <div className="w-8 h-px bg-border" />
        <span>2026.05 → building...</span>
      </div>
    </section>
  );
}
