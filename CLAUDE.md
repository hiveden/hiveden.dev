# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

hiveden.dev — 个人项目文档站，展示开源项目、技术文档和工程实践。中文站点（lang="zh-CN"）。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript 6
- **样式**: Tailwind CSS 4 (通过 `@tailwindcss/postcss` 插件)
- **字体**: Geist / Geist Mono (via `next/font/google`)
- **部署**: Cloudflare Workers (通过 `@opennextjs/cloudflare` 适配)
- **包管理**: pnpm

## 常用命令

```bash
pnpm dev          # 本地开发（Turbopack，端口 4321）
pnpm build        # 生产构建（opennextjs-cloudflare）
pnpm preview      # 构建 + wrangler 本地预览
pnpm deploy       # 构建 + 部署到 Cloudflare Workers
```

无 lint/test 脚本配置。TypeScript 类型检查通过 `npx tsc --noEmit`。

## 架构

- `src/app/` — App Router 页面（首页 + `docs/` 下的文档页）
- `src/components/` — 页面组件
- `src/content/docs/` — Markdown 文档源文件
- `public/llms.txt` — AI agent 发现文件
- `@/*` 路径别名映射到 `./src/*`

### 文档系统

文档内容以 `.md` 文件存放在 `src/content/docs/`，通过 `raw-loader`（Turbopack 在 `next.config.ts` 配置）作为字符串导入。类型声明在 `src/types/md.d.ts`。

每个文档页是独立的 App Router 页面（如 `src/app/docs/local-model-deployment/page.tsx`），手动 import 对应的 markdown 文件，传给 `DocContent` 组件渲染。`DocContent` 使用 `react-markdown` + `remark-gfm` 渲染，自动提取 h2/h3 生成右侧 TOC。

添加新文档页的步骤：
1. 在 `src/content/docs/` 创建 `.md` 文件
2. 在 `src/app/docs/<slug>/page.tsx` 创建页面，import markdown 并传给 `DocContent`

### 评论系统

使用 Giscus（GitHub Discussions），配置在 `src/components/comments.tsx`，repo 为 `hiveden/hiveden.dev`。

### 设计 tokens

颜色和字体在 `src/app/globals.css` 的 `@theme` 块中定义（Tailwind CSS 4 语法）。主题色 accent 为紫色 `#A855F7`，暗色背景。自定义 `.prose` 类提供 markdown 排版样式。

## 部署

Cloudflare Workers 部署通过 `open-next.config.ts` + `wrangler.toml` 配置。Worker 名称 `hiveden-dev`，入口 `.open-next/worker.js`。

### Cloudflare 限制

- 不能使用 `fs.readFileSync` 等 Node.js 文件系统 API（Workers 运行时不支持）
- 静态数据必须通过 static import 或放入 `public/` 目录
