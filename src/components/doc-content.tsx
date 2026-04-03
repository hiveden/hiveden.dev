"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DocContent({ content }: { content: string }) {
  return (
    <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
