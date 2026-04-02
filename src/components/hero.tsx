const TAGS = ["折腾记录", "工具测评", "效率实验", "上海"];

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        {/* Avatar */}
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.png"
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full border-2 border-border"
          />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold md:text-3xl">
            工具人研究所所长
            <span className="text-accent"> · </span>
            模型调教师
          </h1>
          <p className="text-lg text-muted">
            用 AI 和自动化帮自己偷懒
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
