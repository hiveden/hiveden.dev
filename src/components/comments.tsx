"use client";

import Giscus from "@giscus/react";

export function Comments() {
  return (
    <div id="comments" className="mt-16 border-t border-subtle pt-12">
      <Giscus
        repo="hiveden/hiveden.dev"
        repoId="R_kgDOR3goHQ"
        category="Announcements"
        categoryId="DIC_kwDOR3goHc4C6Fip"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="dark"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
