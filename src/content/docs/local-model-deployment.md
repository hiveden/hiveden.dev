# 本地模型部署方案 — Ollama on Apple Silicon

> **硬件参考**: Mac Mini, Apple M4 Pro (14 核 CPU / 20 核 GPU), 64GB 统一内存, macOS 26.x
>
> **适用范围**: 任何 Apple Silicon Mac（M1/M2/M3/M4 系列），8GB 以上内存即可，模型选择按内存调整。
>
> **最后更新**: 2026-04-03

---

## 1. 为什么选 Ollama

| 维度 | Ollama | LM Studio | MLX (llm-mlx) |
|------|--------|-----------|----------------|
| 安装 | `brew install ollama`，一行命令 | GUI 安装包 | `pip install mlx-lm` |
| 服务化 | launchd 守护进程，开机自启 | 需手动启动 GUI | 无内置服务 |
| API 兼容 | OpenAI-compatible `/v1/` 端点 | OpenAI-compatible | 需自己包 API |
| Docker 集成 | `host.docker.internal:11434` 直连 | 同上（端口 1234） | 需额外封装 |
| 模型管理 | `ollama pull/list/rm`，CLI 完整 | GUI 管理 | 手动下载 |
| Apple Silicon 优化 | **MLX 内置**（0.19.0 起）+ Flash Attention | Metal GPU | MLX 原生框架 |
| 生态成熟度 | ★★★★★ | ★★★★ | ★★★ |

**结论**: Ollama 在服务化、CLI 管理、Docker 集成三方面完胜，适合作为开发阶段的本地 LLM 后端。

> **⚠️ Ollama 0.19.0 MLX 加速说明**: 0.19.0 将底层推理引擎切换至 Apple MLX 框架（preview），但目前**仅对 `qwen3.5:35b-a3b` 模型启用 MLX 加速路径**，其他模型仍走原有 llama.cpp 后端。需要 32GB 以上统一内存。后续版本将逐步扩展支持模型范围。

---

## 2. 安装

### 2.1 通过 Homebrew 安装（推荐）

```bash
# 安装
brew install ollama

# 启动服务（注册 launchd，开机自启）
brew services start ollama

# 验证
ollama --version
# ollama version is 0.19.0

curl http://localhost:11434/v1/models | python3 -m json.tool
```

### 2.2 验证安装

```bash
# 服务状态
brew services list | grep ollama
# ollama      started         <user> ~/Library/LaunchAgents/homebrew.mxcl.ollama.plist

# API 健康检查
curl -s http://localhost:11434/ 
# Ollama is running
```

### 2.3 关键路径

| 路径 | 说明 |
|------|------|
| `/opt/homebrew/bin/ollama` | 可执行文件 |
| `~/.ollama/models/` | 模型存储目录 |
| `~/Library/LaunchAgents/homebrew.mxcl.ollama.plist` | launchd 配置 |
| `/opt/homebrew/var/log/ollama.log` | 日志文件 |

---

## 3. 性能优化配置

Ollama 通过 launchd plist 的 `EnvironmentVariables` 设置环境变量。

### 3.1 编辑配置

```bash
# 方法 1：直接编辑 plist
nano ~/Library/LaunchAgents/homebrew.mxcl.ollama.plist

# 方法 2：用 defaults 命令（不推荐，plist 结构复杂时容易出错）
```

### 3.2 推荐配置

在 plist 的 `<dict>` → `EnvironmentVariables` → `<dict>` 内添加：

```xml
<key>EnvironmentVariables</key>
<dict>
    <!-- Flash Attention：Apple Silicon 必开，显著提升推理速度 -->
    <key>OLLAMA_FLASH_ATTENTION</key>
    <string>1</string>
    
    <!-- KV Cache 量化：q8_0 节省显存，几乎不影响质量 -->
    <key>OLLAMA_KV_CACHE_TYPE</key>
    <string>q8_0</string>
    
    <!-- 代理（按需，用于 ollama pull 下载模型） -->
    <key>HTTP_PROXY</key>
    <string>http://127.0.0.1:7890</string>
    <key>HTTPS_PROXY</key>
    <string>http://127.0.0.1:7890</string>
</dict>
```

### 3.3 其他可选参数

| 环境变量 | 默认值 | 说明 |
|---------|--------|------|
| `OLLAMA_HOST` | `127.0.0.1:11434` | 监听地址。局域网共享改为 `0.0.0.0:11434` |
| `OLLAMA_NUM_PARALLEL` | `1` | 并发请求数。64GB 内存可设 `2-4` |
| `OLLAMA_MAX_LOADED_MODELS` | `1` | 同时加载模型数。64GB 可设 `2`（注意内存） |
| `OLLAMA_KEEP_ALIVE` | `5m` | 模型卸载超时。频繁使用可设 `30m` 或 `1h` |
| `OLLAMA_FLASH_ATTENTION` | `0` | **必开**。Apple Silicon Metal 加速 |
| `OLLAMA_KV_CACHE_TYPE` | `f16` | `q8_0` 省内存，`q4_0` 更激进但可能影响质量 |

### 3.4 应用配置变更

```bash
# 重启 Ollama 服务使配置生效
brew services restart ollama

# 验证配置
ollama ps  # 查看当前加载的模型
```

---

## 4. 模型选型指南

### 4.1 当前已安装模型

| 模型 | 参数量 | 量化 | 磁盘 | 架构 | 用途 |
|------|--------|------|------|------|------|
| **qwen3:30b-a3b** | 30.5B (MoE, 3B 激活) | Q4_K_M | 18 GB | qwen3moe | **主力推理**，速度快 |
| **qwen3.5:35b-a3b** | 36B (MoE, 3B 激活) | Q4_K_M | 23 GB | qwen35moe | 多模态（支持 vision），quality > speed |
| **qwen2.5:32b** | 32.8B (Dense) | Q4_K_M | 19 GB | qwen2 | 备用，Dense 架构速度较慢 |
| **qwen2.5:14b** | 14.8B (Dense) | Q4_K_M | 9 GB | qwen2 | 轻量任务 / RAGAS LLM judge |
| **vicuna:7b** | 7B (Dense) | Q4_0 | 3.8 GB | llama | 测试用，不推荐生产 |

**总磁盘占用**: ~70 GB（`~/.ollama/models/`）

### 4.2 选型决策树

```
需要 vision（图片理解）？
  → Yes: qwen3.5:35b-a3b（当前唯一多模态）
  → No: 继续 ↓

对速度敏感（实时交互 / API 后端）？
  → Yes: qwen3:30b-a3b（MoE, 64.7 tok/s）
  → No: 继续 ↓

需要最高质量（评估 / 复杂推理）？
  → Yes: qwen3.5:35b-a3b（更大参数量 + thinking）
  → No: qwen3:30b-a3b（默认选择）

内存有限（< 32GB）？
  → qwen2.5:14b（9 GB，25 tok/s）
  
最低配（8GB Mac）？
  → vicuna:7b 或 qwen2.5:7b
```

### 4.3 MoE vs Dense 的关键区别

**MoE (Mixture of Experts)**: qwen3/qwen3.5 的 `a3b` 后缀表示 **active 3B**——虽然总参数 30-36B，但每次推理只激活 3B 参数。

- **优势**: 推理速度接近 3B 模型，质量接近 30B 模型
- **劣势**: 加载时仍需完整模型的内存（18-23 GB）
- **实测**: qwen3:30b-a3b（64.7 tok/s）比 Dense qwen2.5:32b（11.7 tok/s）**快 5.5 倍**

这是为什么我们从 qwen2.5 迁移到 qwen3 MoE 的核心原因。

### 4.4 拉取新模型

```bash
# 搜索可用模型
ollama search qwen

# 拉取
ollama pull qwen3:30b-a3b

# 查看模型信息
ollama show qwen3:30b-a3b

# 删除不需要的模型（释放磁盘）
ollama rm vicuna:7b
```

---

## 5. 基准测试数据

> 测试环境: Mac Mini M4 Pro 64GB, Ollama 0.19.0, Flash Attention ON, KV Cache q8_0
>
> 测试方法: `POST /api/generate`，`stream: false`，取 `eval_duration` 和 `eval_count`

### 5.1 生成速度

| 模型 | 加载时间 | 生成 tokens | 生成耗时 | **速度 (tok/s)** | 总耗时 |
|------|----------|-------------|----------|------------------|--------|
| qwen3:30b-a3b | 0.1s (hot) | 739 | 11.4s | **64.7** | 11.8s |
| qwen3.5:35b-a3b | 10.1s (cold) | 10840 | 380.1s | **28.5** | 393.0s |
| qwen2.5:32b | 15.1s (cold) | 230 | 19.7s | **11.7** | 35.6s |
| qwen2.5:14b | 8.0s (cold) | 237 | 9.4s | **25.1** | 17.9s |

> **注**: qwen3.5 生成了 thinking tokens（10840 tokens 含 thinking 输出），实际输出约 200 tokens。thinking 模式下总耗时显著增加。

### 5.2 实际应用延迟（ToolRef RAG pipeline）

| 环节 | 耗时 |
|------|------|
| Embedding (BGE-M3, CPU) | ~0.5s |
| Milvus 检索 | ~0.1s |
| Reranking (BGE-Reranker-v2-M3, CPU) | ~6s (10 docs) |
| **LLM 生成 (qwen3:30b-a3b)** | **40-80s** |
| 语义缓存命中 | 0.2-0.3s |
| **端到端（首次查询）** | **~50-90s** |
| **端到端（缓存命中）** | **~0.3s** |

> LLM 生成是瓶颈。RAG prompt 含大量 context（5 个 source chunks），输入 token 多，输出也长。

### 5.3 内存占用参考

Apple Silicon 的统一内存被 CPU 和 GPU 共享。Ollama 加载模型时占用的是 GPU 内存（Metal）。

| 模型 | Q4_K_M 磁盘 | 运行时内存（估算） |
|------|-------------|-------------------|
| qwen3:30b-a3b | 18 GB | ~20 GB |
| qwen3.5:35b-a3b | 23 GB | ~25 GB |
| qwen2.5:32b | 19 GB | ~21 GB |
| qwen2.5:14b | 9 GB | ~11 GB |

> 64 GB 机器可以同时加载 qwen3:30b + qwen2.5:14b，但建议 `OLLAMA_MAX_LOADED_MODELS=1` 避免内存压力。

---

## 6. 日常使用

### 6.1 CLI 交互

```bash
# 对话模式
ollama run qwen3:30b-a3b

# 单次提问
ollama run qwen3:30b-a3b "解释 RAG 是什么"

# 查看当前加载的模型
ollama ps

# 列出所有已安装模型
ollama list
```

### 6.2 API 调用（OpenAI 兼容）

Ollama 在 `http://localhost:11434/v1/` 提供 OpenAI-compatible API：

```bash
# 列出模型
curl http://localhost:11434/v1/models

# Chat Completion
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3:30b-a3b",
    "messages": [{"role": "user", "content": "什么是向量数据库？"}],
    "temperature": 0.7
  }'

# Streaming
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3:30b-a3b",
    "messages": [{"role": "user", "content": "什么是向量数据库？"}],
    "stream": true
  }'
```

### 6.3 Python SDK

```python
# 方式 1：OpenAI SDK（推荐，通用性好）
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Ollama 不验证 key，但 SDK 要求非空
)

response = client.chat.completions.create(
    model="qwen3:30b-a3b",
    messages=[{"role": "user", "content": "什么是 RAG？"}],
    temperature=0.7
)
print(response.choices[0].message.content)

# 方式 2：Ollama 官方 SDK
import ollama

response = ollama.chat(
    model="qwen3:30b-a3b",
    messages=[{"role": "user", "content": "什么是 RAG？"}]
)
print(response["message"]["content"])
```

### 6.4 关闭 Thinking 模式

qwen3/qwen3.5 默认启用 thinking（长链推理），会生成大量 thinking tokens，显著增加延迟。对于 API 后端场景，建议关闭：

```bash
# CLI：加 /nothink
ollama run qwen3:30b-a3b /nothink "简单问题"

# API：通过 chat_template_kwargs（Ollama 原生 API）
# 或在应用层 .env 配置
LLM_DISABLE_THINKING=true
```

---

## 7. 与 Docker 应用集成

这是最常见的使用场景：Docker 容器内的应用需要调用宿主机的 Ollama。

### 7.1 网络拓扑

```
┌─────────────────────────┐
│  macOS Host              │
│  Ollama :11434           │
│                          │
│  ┌────────────────────┐  │
│  │ Docker Desktop      │  │
│  │                     │  │
│  │  container-a ──────────── host.docker.internal:11434
│  │  container-b ──────────── host.docker.internal:11434
│  │                     │  │
│  └────────────────────┘  │
└─────────────────────────┘
```

Docker Desktop for Mac 提供 `host.docker.internal` DNS 名称，指向宿主机。

### 7.2 应用 .env 配置

以 ToolRef 为例（任何使用 OpenAI SDK 的应用通用）：

```env
# LLM 配置
LLM_PROVIDER=openai
LLM_MODEL=qwen3:30b-a3b          # ⚠️ Ollama 模型名，不带 provider 前缀
LLM_TEMPERATURE=0.1

# OpenAI-compatible 端点
OPENAI_API_KEY=ollama              # Ollama 不验证，但 SDK 要求非空
OPENAI_API_BASE=http://host.docker.internal:11434/v1   # Docker → Host

# 可选：关闭 thinking（减少延迟）
LLM_DISABLE_THINKING=true
```

### 7.3 关键注意事项

**⚠️ 模型名格式**:
- ✅ `qwen3:30b-a3b`（Ollama 格式）
- ❌ `qwen/qwen3-30b-a3b`（HuggingFace 格式，Ollama 会报 404）

**⚠️ .env 变更后必须重建容器**:
```bash
# ❌ 错误：restart 不会重载 .env
docker restart my-container

# ✅ 正确：up -d 会检测 .env 变化并重建
docker compose up -d
```

**⚠️ 代理冲突**:
如果宿主机设置了 `ALL_PROXY=socks5://...` 或 `all_proxy=socks5://...`，Python httpx 会尝试通过 SOCKS 代理连接 Ollama，导致 `ImportError: socksio not installed`。解决方案：

```python
# 在脚本中清除代理环境变量
import os
for var in ["ALL_PROXY", "all_proxy", "HTTP_PROXY", "http_proxy", "HTTPS_PROXY", "https_proxy"]:
    os.environ.pop(var, None)
```

或在 Docker Compose 中显式设置：

```yaml
environment:
  - ALL_PROXY=
  - all_proxy=
  - NO_PROXY=host.docker.internal,localhost
```

### 7.4 验证连通性

```bash
# 从宿主机验证
curl http://localhost:11434/v1/models

# 从 Docker 容器内验证
docker exec <container-name> curl -s http://host.docker.internal:11434/v1/models
```

---

## 8. 踩坑记录

### R17: docker restart 不重载 .env

**现象**: 修改 `.env` 中的 `LLM_MODEL` 后 `docker restart backend`，容器仍用旧配置。

**原因**: `docker restart` 只重启进程，不重新读取 `.env` 和 `docker-compose.yml`。

**解决**: 用 `docker compose up -d`，Compose 会检测变化并 recreate 容器。

### R-Ollama-1: 模型名格式错误

**现象**: `openai.NotFoundError: model 'qwen/qwen3-30b-a3b' not found`

**原因**: Ollama 的模型 ID 格式是 `name:tag`（如 `qwen3:30b-a3b`），不是 HuggingFace 的 `org/model` 格式。

**解决**: `.env` 中写 `LLM_MODEL=qwen3:30b-a3b`。可通过 `ollama list` 确认正确名称。

### R-Ollama-2: SOCKS 代理导致连接失败

**现象**: Python httpx 报 `ImportError: socksio not installed`。

**原因**: 宿主机设了 `ALL_PROXY=socks5://127.0.0.1:7890`，httpx 发现 SOCKS 代理但缺少 socksio 库。

**解决**: 清除 `ALL_PROXY`/`all_proxy` 环境变量（见 [7.3](#73-关键注意事项)）。

### R-Ollama-3: 冷启动加载慢

**现象**: 第一次请求模型耗时 10-15s，后续 <0.5s。

**原因**: Ollama 按需加载模型到 GPU 内存（Metal），默认 5 分钟无请求后卸载。

**解决**:
```xml
<!-- 在 plist EnvironmentVariables 中增加 -->
<key>OLLAMA_KEEP_ALIVE</key>
<string>30m</string>  <!-- 30 分钟不卸载 -->
```

### R-Ollama-4: qwen3.5 thinking 导致超长输出

**现象**: 简单问题生成 10000+ tokens，耗时 6 分钟。

**原因**: qwen3.5 默认开启 thinking 模式，会在 `<think>` 标签中输出长链推理。

**解决**: 在应用配置中关闭 thinking（`LLM_DISABLE_THINKING=true`），或用 qwen3（thinking 可控性更好）。

---

## 9. 维护与更新

### 9.1 更新 Ollama

```bash
brew upgrade ollama
brew services restart ollama
```

### 9.2 更新模型

```bash
# 拉取同 tag 的最新版本
ollama pull qwen3:30b-a3b

# 清理旧版本残留
# Ollama 自动管理 blob 去重，通常不需要手动清理
```

### 9.3 监控

```bash
# 查看运行日志
tail -f /opt/homebrew/var/log/ollama.log

# 查看当前加载模型及内存
ollama ps

# 磁盘占用
du -sh ~/.ollama/models
```

### 9.4 开机自启验证

Homebrew 安装的 Ollama 通过 launchd 自动启动：

```bash
# 确认已注册
brew services list | grep ollama
# ollama      started    <user>  ~/Library/LaunchAgents/homebrew.mxcl.ollama.plist

# 如果未启动
brew services start ollama
```

---

## 10. 附录：备选方案对比

### LM Studio

- **优势**: GUI 友好，模型市场直观，支持 GGUF/MLX 双格式
- **劣势**: 无 CLI 管理，无 launchd 服务化，端口默认 1234（需配置）
- **适合**: 个人实验、可视化对比模型

### MLX (Apple 原生框架 / mlx_lm)

- **优势**: Apple Silicon 最底层优化，理论性能上限最高
- **劣势**: 无内置 HTTP 服务，模型格式不通用（.safetensors + MLX config），需自己封装 API
- **适合**: 研究实验、需要裸框架控制推理细节的场景
- **现状**: Ollama 0.19.0 已将 MLX 内置为推理后端（Apple Silicon），`mlx_lm` 更适合作为研究框架，开发者工具建议直接用 Ollama

### oMLX（编码 Agent 专用推理服务器）

- **项目**: [github.com/jundot/omlx](https://github.com/jundot/omlx)，macOS 原生，基于 MLX 框架
- **核心特性**: **Paged SSD KV Cache** — 将 KV cache 持久化到热内存层和冷 SSD 层，即使上下文中途变化也保持缓存可跨请求复用
- **解决的痛点**: 编码 Agent（Claude Code、OpenClaw、Cursor）多轮对话时前缀不断变化，标准 MLX 服务器每次丢弃 KV cache 重新计算，30-90s TTFT；oMLX 可降至 **1-3s**
- **其他特性**: Continuous Batching、OpenAI + Anthropic 双兼容 API、多模型同时加载、MCP 支持、音频模型（STT/TTS）、菜单栏 dmg 管理
- **vs Ollama**: oMLX 针对长对话 Agent 场景 TTFT 更优；Ollama 服务化更成熟、Docker 集成更简单、模型覆盖更广
- **我们为什么暂不换**: ToolRef 主要是单次精准查询（非长对话），oMLX 的 KV cache 优势在我们当前场景收益有限；oMLX 项目较新，生态待成熟。加入 Conversation Memory 后值得重新评估
- **适合**: 重度使用本地编码 Agent、多轮长对话场景、对 TTFT 敏感的用户

### vLLM

- **优势**: 生产级推理服务，PagedAttention，高并发
- **劣势**: 需要 NVIDIA GPU（不支持 Apple Silicon Metal）
- **适合**: 云 GPU（AutoDL 4090）部署验证

### 我们的选择

开发阶段用 **Ollama**（稳定 + 服务化 + Docker 友好），生产部署验证用 **vLLM on 云 GPU**。oMLX 值得关注，Conversation Memory 上线后多轮场景增多时重新评估。

---

## 11. 实际应用案例：ToolRef RAG 引擎

这是 Ollama 在我们项目中的真实使用场景，展示完整的集成方式和性能表现。

### 11.1 项目背景

[ToolRef](https://github.com/hiveden/toolref) 是一个生产级 RAG 引擎，提供 Chat UI + MCP Server 双入口。Ollama 作为 LLM 生成后端，负责根据检索到的文档片段生成最终回答。

**架构链路**:
```
User Query
  → BGE-M3 Embedding (CPU, 容器内)
  → Milvus 向量检索 (dense + sparse hybrid)
  → BGE-Reranker-v2-M3 重排序 (CPU, 容器内)
  → CRAG 自校正 (判断相关性，必要时重写 query)
  → Ollama qwen3:30b-a3b 生成回答 (宿主机 GPU)
  → 语义缓存写入 Redis
  → 返回答案 + Source 卡片
```

### 11.2 服务架构

```
┌──────────────────────────────────────────────────────┐
│  macOS Host                                          │
│  Ollama :11434  (qwen3:30b-a3b, Metal GPU)           │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Docker Compose (9 容器)                          │ │
│  │                                                  │ │
│  │  toolref-frontend (:3002)     ← Chat UI          │ │
│  │  toolref-backend (:8000)      ← FastAPI          │ │
│  │  toolref-mcp-server (:8080)   ← MCP Server       │ │
│  │  toolref-ingestion-worker     ← 文档摄入          │ │
│  │  toolref-postgres (:5432)     ← 文档元数据        │ │
│  │  toolref-redis (:6379)        ← 语义缓存          │ │
│  │  toolref-milvus (:19530)      ← 向量存储          │ │
│  │  toolref-minio (:9000)        ← 文件存储          │ │
│  │  toolref-etcd                 ← Milvus 依赖       │ │
│  │                                                  │ │
│  │  backend → host.docker.internal:11434 → Ollama   │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 11.3 .env 配置（实际使用）

```env
# LLM 生成
LLM_PROVIDER=openai
LLM_MODEL=qwen3:30b-a3b
LLM_TEMPERATURE=0.1
LLM_DISABLE_THINKING=true          # 关闭 thinking，减少延迟
OPENAI_API_KEY=ollama
OPENAI_API_BASE=http://host.docker.internal:11434/v1

# Embedding（容器内 CPU 推理，不走 Ollama）
EMBEDDING_MODEL=BAAI/bge-m3
EMBEDDING_DIM=1024
EMBEDDING_BATCH_SIZE=32
```

> 注意：Embedding 和 Reranking 模型在容器内 CPU 运行（HuggingFace SentenceTransformers），不经过 Ollama。只有 LLM 生成走 Ollama GPU 推理。

### 11.4 知识库规模

| 指标 | 数据 |
|------|------|
| 知识库来源 | Claude/Anthropic 官方文档 (claude-wiki mirror) |
| Namespace | `claude` |
| 文档数量 | **1370 篇** |
| 文档格式 | Markdown + YAML frontmatter |
| 覆盖范围 | API Docs, Claude Code, MCP, Prompt Engineering, Tool Use 等 20 个类别 |
| 摄入耗时 | ~4 小时（单 worker, CPU embedding, ~10s/doc） |
| 另有 `default` namespace | 4 篇测试文档 |

### 11.5 端到端性能数据（实测）

**测试条件**: Mac Mini M4 Pro 64GB, Ollama 0.19.0, qwen3:30b-a3b, Flash Attention ON, top_k=5

| 场景 | 延迟 | 说明 |
|------|------|------|
| **语义缓存命中** | **0.2-0.5s** | 相同/相似 query 直接返回缓存结果 |
| **首次查询（cache miss）** | **40-80s** | 完整链路：embed → search → rerank → generate |
| 其中 Embedding | ~0.5s | BGE-M3, CPU |
| 其中 Milvus 检索 | ~0.1s | dense + sparse hybrid search |
| 其中 Reranking | ~6s | BGE-Reranker-v2-M3, 10 docs, CPU |
| 其中 **LLM 生成** | **30-70s** | **瓶颈环节**，取决于 context 长度和输出长度 |
| 语义缓存 TTL | 24h | 自动过期 |

**实测采样（2026-04-03）**:
```
Query: "What is prompt caching and how to enable it?"
  Cache hit:  0.2s ✅
  Cache miss: 44.1s ✅ (含 LLM 生成)

Query: "How to implement streaming with Claude API?"
  Cache miss: 44.1s ✅
```

### 11.6 质量验证结果

5 个测试 query 全部通过（检索正确 + 生成正确）：

| Query | 检索质量 | 生成质量 |
|-------|---------|---------|
| Prompt Caching | ✅ 正确召回 Prompt Caching 文档 | ✅ 详细说明原理和启用方式 |
| Tool Use | ✅ 正确召回 Tool Use 文档 | ✅ 给出设置和配置步骤 |
| MCP | ✅ 正确召回 MCP 文档 | ✅ 准确描述协议标准 |
| Claude Code Best Practices | ✅ 正确召回 Claude Code 文档 | ✅ 输出 context management 等建议 |
| Rate Limits | ✅ 正确召回 Rate Limits 文档 | ✅ 给出 exponential backoff 方案 |

**评估基线（RAGAS + IR Metrics）**:
- Hit Rate: 100%, MRR: 1.0, Recall@5: 100%
- Answer Relevancy: 0.936
- Context Recall: 0.370（偏低，待优化 ground truth 质量）

### 11.7 踩坑总结（ToolRef 集成相关）

| 编号 | 问题 | 解决方案 |
|------|------|---------|
| R17 | `.env` 改了 `LLM_MODEL` 但 `docker restart` 不生效 | `docker compose up -d` 重建容器 |
| R-OL1 | 模型名写成 `qwen/qwen3-30b-a3b` 报 404 | Ollama 格式是 `qwen3:30b-a3b` |
| R-OL2 | `ALL_PROXY` 导致 httpx 连接 Ollama 失败 | 清除 SOCKS 代理环境变量 |
| R-OL4 | qwen3.5 thinking 输出 10000+ tokens | 用 `LLM_DISABLE_THINKING=true` 或选 qwen3 |
| R-P1 | 首次 query 超慢（80s+） | Ollama 冷启动加载模型（设 `OLLAMA_KEEP_ALIVE=30m`） |

### 11.8 性能优化建议

| 策略 | 效果 | 复杂度 |
|------|------|--------|
| 语义缓存 (已实施) | 重复 query 0.2s（降 99%） | 低 |
| `OLLAMA_KEEP_ALIVE=30m` | 避免冷启动 15s | 低 |
| Flash Attention (已启用) | 推理速度提升 ~20-30% | 低 |
| KV Cache q8_0 (已启用) | 省内存，支持更长 context | 低 |
| 换更小模型 (qwen2.5:14b) | 生成速度 ×2，质量下降 | 中（需评估） |
| 云 GPU (vLLM + 4090) | 生成速度 ×5-10 | 高（需运维） |
| Streaming 输出 (已支持) | 用户感知延迟大幅降低 | 低 |

---

## 快速开始清单（给新人）

```bash
# 1. 安装 Ollama
brew install ollama

# 2. 启动服务
brew services start ollama

# 3. 优化配置（编辑 plist 加 Flash Attention + KV Cache 量化）
nano ~/Library/LaunchAgents/homebrew.mxcl.ollama.plist
# 添加 OLLAMA_FLASH_ATTENTION=1 和 OLLAMA_KV_CACHE_TYPE=q8_0
brew services restart ollama

# 4. 拉取推荐模型
ollama pull qwen3:30b-a3b      # 主力，速度优先（64GB 机器推荐）
ollama pull qwen2.5:14b         # 轻量备用（32GB 以下推荐）

# 5. 验证
ollama run qwen3:30b-a3b "Hello, world!"
curl http://localhost:11434/v1/models

# 6. （可选）Docker 应用集成
# .env: OPENAI_API_BASE=http://host.docker.internal:11434/v1
# .env: LLM_MODEL=qwen3:30b-a3b
# .env: OPENAI_API_KEY=ollama
```

搞定 ✅
