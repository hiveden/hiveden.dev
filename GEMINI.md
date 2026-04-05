# hiveden.dev

## Project Overview

**hiveden.dev** 是个人项目文档站，主要展示开源项目、技术文档和工程实践。使用中文（lang="zh-CN"）进行内容输出。

## Building and Running

### 常用命令
- 本地开发：`pnpm dev` (使用 Turbopack, 运行在 4321 端口)
- 生产构建：`pnpm build` (使用 opennextjs-cloudflare)
- 本地预览：`pnpm preview` (构建并使用 wrangler 本地预览)
- 部署：`pnpm deploy` (构建并部署到 Cloudflare Workers)

## Development Conventions

*   **Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript 6.
*   **Styling:** Tailwind CSS 4 (通过 `@tailwindcss/postcss`).
*   **Deployment:** Cloudflare Workers (通过 `@opennextjs/cloudflare` 适配).
*   **Design Language M:** 本项目严格遵循内部的极简设计语言 "M"。请查阅 `DESIGN.md` 了解详细的颜色标记、字体和组件规范。
*   **Code Quality:** 使用 TypeScript 强类型，利用 Tailwind V4 的 CSS 变量进行样式管理，避免硬编码魔法值。
*   **Typography:** 统一使用 Geist (Sans) 和 Geist Mono (Mono)。
