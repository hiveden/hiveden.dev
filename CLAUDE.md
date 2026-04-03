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
pnpm dev          # 本地开发（Turbopack）
pnpm build        # 生产构建（opennextjs-cloudflare）
pnpm preview      # 构建 + wrangler 本地预览
pnpm deploy       # 构建 + 部署到 Cloudflare Workers
```

## 架构

- `src/app/` — Next.js App Router 页面，当前为单页站点
- `src/components/` — 页面组件（header, footer, typing-hero, projects, pipeline-diagram）
- `public/llms.txt` — AI agent 发现文件
- `@/*` 路径别名映射到 `./src/*`

## 部署

Cloudflare Workers 部署通过 `open-next.config.ts` + `wrangler.toml` 配置。Worker 名称 `hiveden-dev`，入口 `.open-next/worker.js`。
