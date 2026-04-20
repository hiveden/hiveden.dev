# Page View Counter

基于 Cloudflare KV 的浏览量计数器。展示用，不是统计学。

## 架构

```
Browser ── POST /api/views/[slug] ──► KV: views:<slug> +1
            │                        └─► KV: site:total  +1  (搭车)
            └─ GET /api/views/[slug]    读 views:<slug>
            └─ GET /api/site/views      读 site:total
```

单一 KV namespace `VIEWS`，绑定在 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "VIEWS"
id = "b6b4c8e33493407bb665dccf948e4e0d"
preview_id = "36f0f0947cb9453ba2ec7042ac5498a0"
```

类型通过 `cloudflare-env.d.ts` 的 `declare global { interface CloudflareEnv }` 扩展进 OpenNext 的全局类型。

## Key 约定

| Key | 值 | 写入方 | 说明 |
|---|---|---|---|
| `views:<slug>` | number as string | `POST /api/views/[slug]` | 单文章阅读量 |
| `site:total` | number as string | `POST /api/views/[slug]` 搭车 | 整站文章阅读量之和 |

`<slug>` 必须匹配 `/^[a-z0-9][a-z0-9-]{0,63}$/`（route handler 里白名单），防止 `/api/views/junk123...` 写入任意 key 污染 KV。

## 组件矩阵

| 组件 | 位置 | 动作 | 文件 |
|---|---|---|---|
| `ViewCounter` | 文章 breadcrumb 右侧 | POST（去重后）或 GET | `src/components/view-counter.tsx` |
| `ViewBadge` | 首页/articles 卡片元信息栏 | GET | `src/components/view-badge.tsx` |
| `SiteViewCounter` | Footer 右侧 | GET 一次 | `src/components/site-view-counter.tsx` |

`ViewCounter` 通过 `usePathname()` 自动识别 slug，12 个 `src/app/docs/<slug>/page.tsx` **零改动**。slug = pathname 最后一段。

## 去重逻辑

**客户端 localStorage 滚动窗口，24h**。

```ts
// src/components/view-counter.tsx
const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;
const last = localStorage.getItem(`viewed:${slug}`);
const shouldIncrement = !last || Date.now() - Number(last) >= DEDUP_WINDOW_MS;
fetch(`/api/views/${slug}`, { method: shouldIncrement ? "POST" : "GET" });
if (shouldIncrement) localStorage.setItem(`viewed:${slug}`, String(Date.now()));
```

**强度评估**：

| 场景 | 重复计数 |
|---|---|
| 同浏览器刷新 | ❌ |
| 同浏览器 24h 后 | ✅ |
| 清 localStorage / 无痕 / 换浏览器 / 换设备 | ✅ |
| curl / 爬虫（不执行 JS） | ❌（不 fetch） |
| 构造 POST 攻击 | ✅ |

定位：**展示用**。想做统计学意义上的精确 PV，接 Cloudflare Web Analytics。

## 失败模式

- KV 不可达 / fetch 失败 → 组件 catch 后保持 `count === null`，**不 crash 页面**。
- `ViewBadge` / `SiteViewCounter` 在 `count === 0` 时渲染 null（避免"0 次阅读"的空洞观感）。
- `ViewCounter` 在 loading 时显示 `—`。

## 竞态

**存在轻微竞态**：POST 内部 `get + put` 不是原子的。两个请求同时到达 edge 可能都读到 N 然后都 put N+1，少记 1 次。

**不修**的理由：个人站流量量级影响可忽略。要修就换 D1 `UPDATE counts SET n = n + 1` 或 Durable Object。

## 运维命令

所有命令前加代理（ClashX 混合端口）：

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
```

### 列出所有 key

```bash
pnpm wrangler kv key list --remote \
  --namespace-id=b6b4c8e33493407bb665dccf948e4e0d
```

### 读单个 key

```bash
pnpm wrangler kv key get --remote \
  --namespace-id=b6b4c8e33493407bb665dccf948e4e0d \
  "views:interview-analysis"
```

### 手动塞值（初始化 / 修正）

```bash
pnpm wrangler kv key put --remote \
  --namespace-id=b6b4c8e33493407bb665dccf948e4e0d \
  "site:total" "123"
```

### 删除（重置）

```bash
pnpm wrangler kv key delete --remote \
  --namespace-id=b6b4c8e33493407bb665dccf948e4e0d \
  "views:some-slug"
```

### Namespace id

- Production: `b6b4c8e33493407bb665dccf948e4e0d`
- Preview   : `36f0f0947cb9453ba2ec7042ac5498a0`

## 口径说明

- `views:<slug>`：单文章 POST 次数（去重后）。
- `site:total`：所有 `views:*` 的 POST 累积之和（不是 KV 里各 key 的当前值之和）。部署前的旧计数**不回溯**。手动补齐见"运维命令"。
- **首页 / /articles / 其他非文章页的访问不计入任何地方**。想要全站 PV 另接 Cloudflare Web Analytics。

## 未来扩展方向（暂不做）

| 需求 | 方案 |
|---|---|
| 严格原子计数 | 迁 D1 (`UPDATE +1`) 或 Durable Object |
| 服务端 IP 限频 | Route handler 里取 `request.cf` + KV 存 `ratelimit:<ip>:<slug>` TTL 60s |
| UV / 国家 / referer | 接 Cloudflare Web Analytics（beacon script）|
| 每篇文章趋势图 | 加 cron 每日 snapshot 到另一个 KV key `views:<slug>:<date>` |
| 管理员仪表盘 | 新建 `/admin` 页面 + basic auth，展示所有 key 的当前值 |

## 变更历史

- **2026-04-20** — 初版：KV + `/api/views/[slug]` + 三个 client 组件（af833f7）
- **2026-04-20** — 加 `site:total` 搭车自增 + Footer 展示（00ec008）
