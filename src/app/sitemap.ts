import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hiveden.dev";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/docs/local-model-deployment`,
      lastModified: new Date("2026-04-03"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/curve-fit-script`,
      lastModified: new Date("2026-04-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/reject-self-fit`,
      lastModified: new Date("2026-04-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
