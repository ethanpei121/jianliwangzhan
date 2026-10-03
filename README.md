# 简历工作台

面向求职者和应届生的一站式在线简历编辑器：可视化表单录入 → 实时预览 → 一键导出 PDF / Word。

用户数据通过 Clerk 登录隔离，持久化在 MySQL，停止输入 1 秒自动保存。

---

## 核心功能

### 11 个简历模块

| 模块 | 说明 |
|------|------|
| 基本信息 | 姓名、性别、出生年月、电话、邮箱、城市、求职意向、头像、政治面貌、籍贯、GitHub |
| 教育背景 | 学校、学历、专业、起止时间、主修课程、GPA/排名、在校荣誉（多条） |
| 实习经历 | 公司、岗位、时间、工作内容、工作成果、负责模块（多条） |
| 项目经历 | 项目名称、时间、角色、描述、职责、技术栈、成果（多条） |
| 工作经历 | 公司、职位、时间、工作内容、业绩成果、管理经验（多条） |
| 校园经历 | 组织、职务、时间、职责、成果（多条） |
| 技能证书 | 英语、计算机、专业资格、软件技能、语言能力 |
| 获奖情况 | 奖项、颁发单位、时间、级别（最多 20 条） |
| 自我评价 | 个人优势、专业能力、工作态度、职业规划 |
| 附加模块 | 作品集、培训经历、论文专利、社会实践、兴趣爱好（各自独立开关） |
| AI 智能优化 | 通义千问润色（**当前未启用**，见「已知限制」） |

多条目模块均支持动态增删，至少保留 1 条。

### 3 套模板

- **模板一**：左侧彩色侧栏 + 右侧卡片式，信息密度高
- **模板二**：经典单栏，顶部渐变 Header，适合校招应届生
- **模板三**：时间线布局，左侧个人信息 + 右侧经历串联，适合有工作经验者

均支持自定义侧栏色 / 强调色、间距调节，以及按背景色深浅自动切换黑白文字。

### 导出

html2canvas 4.8 倍缩放渲染 + jsPDF，按 A4 分页生成 PDF；Word 走 DOM 图片化打包。导出前会等待字体与图片加载（含 3 秒超时兜底）。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 14.2.35（App Router）+ React 18 + TypeScript 5 |
| 样式 | Tailwind CSS 3.4 + CSS 变量主题 |
| 表单 | react-hook-form 7 + Zod 4 |
| UI 组件 | shadcn UI（Radix）+ Lucide 图标 |
| 鉴权 | Clerk 6 |
| 数据库 | MySQL 8 + mysql2 3（服务端连接池） |
| 导出 | html2canvas + jsPDF |
| AI（未启用） | 阿里云 DashScope `qwen-turbo` |

---

## 快速开始

### 1. 环境要求

- Node.js 18.17+（建议 20 LTS）
- MySQL 8.x
- 一个 Clerk 应用（https://dashboard.clerk.com）

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

至少填这几项：

```bash
# Clerk（必填）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MySQL（必填）
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=jianliwangzhan
```

### 3. 建库建表

```bash
npm install
npm run init:db
```

脚本会读 `.env.local` 的连接配置并执行 `db/schema.sql`，创建 `jianliwangzhan` 库和 `resumes` 表。

### 4. 启动

```bash
npm run dev
```

打开 http://localhost:3000 ，注册登录后进入工作台。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 生产模式启动 |
| `npm run lint` | ESLint 检查 |
| `npm run init:db` | 建库建表（幂等，可重复执行） |
| `npm run deploy:pack` | 构建 + 打包 standalone 产物 |

---

## 项目结构

```text
jianliwangzhan/
├─ app/
│  ├─ api/
│  │  ├─ resumes/route.ts      # 简历读写（GET 拉取 / PUT 覆盖）
│  │  └─ ai-optimize/route.ts  # AI 优化（当前未启用）
│  ├─ builder/page.tsx         # 简历编辑器（受 Clerk 保护）
│  ├─ sign-in/ sign-up/        # Clerk 认证页
│  └─ layout.tsx page.tsx
├─ components/
│  ├─ ResumePreview.tsx        # 模板一 + 模板路由总控
│  ├─ ResumeTemplate2/3.tsx    # 模板二、三
│  ├─ AIOptimizePanel.tsx      # AI 优化面板
│  ├─ ExportActions.tsx        # PDF / Word 导出
│  ├─ SaveStatusIndicator.tsx  # 保存状态提示
│  ├─ XxxForm.tsx              # 各模块表单
│  └─ ui/                      # shadcn 原子组件
├─ lib/
│  ├─ schema.ts                # Zod 数据模型（字段唯一真相源）
│  ├─ resume-templates.ts      # 模板工具 + 数据清洗
│  ├─ resume-defaults.ts       # 默认值 + 防御性合并
│  ├─ use-resume-persistence.ts# 加载 / 防抖自动保存 Hook
│  └─ db.ts                    # MySQL 连接池（仅服务端）
├─ db/schema.sql               # 建表脚本
├─ scripts/init-db.mjs         # 数据库初始化脚本
└─ middleware.ts               # Clerk 路由保护
```

---

## 数据存储

### 表结构

`jianliwangzhan.resumes`：一人一条记录，`user_id` 唯一索引，整份简历以 JSON 列存储。

```sql
id          CHAR(36)     PRIMARY KEY
user_id     VARCHAR(191) UNIQUE   -- Clerk userId
data        JSON                  -- 整份简历快照
created_at  DATETIME
updated_at  DATETIME     ON UPDATE CURRENT_TIMESTAMP
```

### 用户隔离

MySQL 没有行级安全（RLS），隔离完全由应用层保证：

1. 浏览器**永不直连数据库**，只能调 `/api/resumes`
2. 接口用 Clerk 的 `auth()` 取 `userId`，所有 SQL 都带 `WHERE user_id = ?`
3. `user_id` 唯一索引保证一人一条，不会串号

### 自动保存

停止输入 1 秒后落库。用 JSON 快照比对跳过无意义保存，用 `hydrated` 标志避免空表单覆盖云端数据。

草稿**不做严格 schema 校验**（否则邮箱输到一半就保存失败了），改为在读取时用 `mergeResumeData()` 逐字段兜底。

> 生产环境请用专用账号，不要用 root：
> `GRANT SELECT, INSERT, UPDATE ON jianliwangzhan.* TO 'jianli'@'%';`

---

## 部署

构建为 `standalone` 产物，无需在服务器执行 `npm install`：

```bash
npm run deploy:pack
```

上传 `.next/standalone` 到服务器后启动：

```bash
HOSTNAME=0.0.0.0 PORT=3000 NODE_ENV=production node server.js
# 或用 PM2
pm2 start ecosystem.config.cjs
```

Nginx 反向代理与完整说明见 [DEPLOY.md](./DEPLOY.md)。

---

## 已知限制

- **AI 优化功能当前不可用**：`ALIYUN_API_KEY` 已过期，调用 `/api/ai-optimize` 返回 502。代码保留未删，换一个有效的阿里云百炼 Key 即可恢复；未配置时编辑器不报错，仅在点击优化时提示。
- 头像以 base64 存在简历 JSON 里，单份数据体积较大（上限约 6MB）。
- 目前仅支持单人简历，没有多份简历管理、模板市场、在线分享等功能。
