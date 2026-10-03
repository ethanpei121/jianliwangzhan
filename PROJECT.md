# 简历网站 (jianliwangzhan) — 项目说明

## 一、项目概述

**简历网站**是一款基于 Next.js 14 的全栈 SaaS 应用，为求职者和应届毕业生提供一站式在线简历编辑、实时预览、AI 智能优化和多格式导出服务。用户登录后即可通过可视化表单录入个人信息，实时查看简历渲染效果，并一键导出为 PDF 或 Word 文件。

---

## 二、核心功能

### 1. 多模块简历编辑

提供 **11 个内容模块**，覆盖求职简历所需的全部信息：

| 模块 | 说明 |
|------|------|
| 基本信息 | 姓名、性别、出生日期、电话、邮箱、城市、求职意向、头像、政治面貌、籍贯、GitHub 等 |
| 教育背景 | 学校、学历、专业、起止时间、课程、GPA/排名、荣誉（支持多条） |
| 实习经历 | 公司、职位、起止时间、工作内容、业绩成果、项目模块（支持多条） |
| 项目经历 | 项目名称、起止时间、角色、描述、职责、技术栈、项目成果（支持多条） |
| 工作经历 | 公司、职位、起止时间、工作内容、业绩成果、管理经验（支持多条） |
| 校园经历 | 组织、角色、时间、职责、成果（支持多条） |
| 技能证书 | 英语、计算机、专业资格、软件技能、语言能力 |
| 获奖情况 | 奖项名称、颁发机构、获奖时间、级别（支持多条，最多 20 项） |
| 自我评价 | 个人优势、专业能力、工作态度、职业规划 |
| 附加模块 | 作品集链接、培训经历、论文专利、社会实践、兴趣爱好（均可独立开关） |
| AI 智能优化 | 对各模块内容进行 AI 润色和优化建议 |

所有多条目模块均支持动态新增和删除，最少保留 1 条。

### 2. 三种简历模板 + 实时预览

编辑数据时，右侧面板实时渲染简历效果。提供三种风格模板，用户可随时切换：

- **模板一（侧边栏+卡片式）**：左侧彩色侧边栏放置头像、基本信息、技能证书和自我评价；右侧以卡片形式展示各模块内容。信息密度高，适合内容丰富的求职者。
- **模板二（经典单栏）**：顶部渐变色 Header 区域放置头像和求职意向，下方按模块依次排列。排版简洁，适合校招和应届生。
- **模板三（时间线 / 现代商务）**：左侧 30% 放置个人信息和技能，右侧 70% 使用时间线形式串联工作/项目经历。视觉效果现代，适合有一定工作经验的求职者。

三种模板均支持：
- **自定义配色**：侧边栏颜色（`sidebarColor`）和强调色（`accentColor`）
- **间距调节**：侧边栏间距（6-20px）和内容间距（0-24px）
- **自动文字色适配**：根据背景色深浅自动切换黑/白文字

### 3. AI 智能优化

集成阿里云 DashScope（通义千问 qwen-turbo 模型），针对简历的不同模块提供专业优化：

| 优化类型 | 优化策略 |
|---------|---------|
| 自我评价 | 强化竞争力，避免套话，量化描述 |
| 工作经历 | STAR 法则，动词开头，数据量化 |
| 实习经历 | 突出成长和贡献，技术成果 |
| 项目经历 | 架构设计能力，关键问题解决 |
| 校园经历 | 领导力、组织能力、数据量化 |
| 全局分析 | 多维度分析，给出 5 条具体改进建议 |

优化结果可一键**应用**（写回表单）或**复制**到剪贴板。

### 4. 多格式导出

- **PDF 导出**：基于 html2canvas（4.8 倍缩放高清渲染）+ jsPDF，按 A4 纸张尺寸生成 PDF 文件。
- **Word 导出**：将简历 DOM 克隆并图片化后打包为 .docx 文件。
- 导出前自动等待字体和图片加载完成（含 3 秒超时），确保渲染完整。
- 文件名格式：`{姓名}_{yyyymmdd}.pdf / .docx`

### 5. 用户认证

使用 **Clerk** 提供完整的用户注册/登录体系：
- `/builder` 路由受保护，未登录自动跳转登录页
- 首页根据登录状态显示不同按钮（"登录/注册" vs "进入工作台"）
- 支持中文本地化界面

### 6. 数据存储

使用 **本地 MySQL 8** 作为数据存储（`jianliwangzhan` 库、`resumes` 表，一人一条记录）。

- 简历整份内容以 JSON 列存储，保存即覆盖（`INSERT ... ON DUPLICATE KEY UPDATE`）
- 浏览器**永不直连数据库**，只调用 `/api/resumes`；用户隔离由 Clerk 的 `userId` 在应用层保证（所有 SQL 均带 `WHERE user_id = ?`）
- 编辑器挂载时自动拉取，停止输入 1 秒后自动保存，右上角实时显示保存状态
- 建库建表：`npm run init:db`（执行 `db/schema.sql`）
- 连接池封装在 `lib/db.ts`，仅服务端可用；客户端误导入会直接抛错

---

## 三、技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.35 | 全栈 React 框架（App Router） |
| React | ^18 | UI 视图层 |
| TypeScript | ^5 | 类型安全 |
| Tailwind CSS | ^3.4.1 | 原子化 CSS 样式引擎 |

### 表单 & 数据验证

| 库 | 用途 |
|------|------|
| react-hook-form | 高性能表单状态管理 |
| zod | 运行时数据验证（Schema 定义） |
| @hookform/resolvers | react-hook-form 与 zod 的桥接 |

### UI 组件

| 库 | 用途 |
|------|------|
| Shadcn UI (Radix UI) | 无头 UI 组件（Button、Form、Input、Label） |
| Lucide React | SVG 图标库 |
| class-variance-authority | CSS 变体管理 |
| clsx + tailwind-merge | 类名合并与冲突处理 |

### 认证 & 后端服务

| 服务 | 用途 |
|------|------|
| Clerk | 用户注册/登录/会话管理 |
| MySQL 8 (mysql2) | 简历数据持久化（`jianliwangzhan.resumes`） |
| 阿里云 DashScope | AI 简历优化（qwen-turbo 模型） |

### 导出

| 库 | 用途 |
|------|------|
| html2canvas | HTML 元素转 Canvas 截图 |
| jsPDF | Canvas 转 PDF 文件 |

---

## 四、项目架构

### 目录结构

```
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（ClerkProvider + 中文本地化）
│   ├── page.tsx                  # 首页（Landing Page）
│   ├── globals.css               # 全局样式 + CSS 变量主题
│   ├── api/
│   │   └── ai-optimize/
│   │       └── route.ts          # AI 优化 API（POST）
│   ├── builder/
│   │   └── page.tsx              # 简历编辑器（受保护路由）
│   ├── sign-in/[[...sign-in]]/   # Clerk 登录页
│   └── sign-up/[[...sign-up]]/   # Clerk 注册页
│
├── components/                   # React 组件
│   ├── ui/                       # Shadcn UI 原子组件
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── PersonalInfoForm.tsx      # 基本信息表单
│   ├── EducationForm.tsx         # 教育背景表单
│   ├── InternshipForm.tsx        # 实习经历表单
│   ├── ProjectExperienceForm.tsx # 项目经历表单
│   ├── WorkExperienceForm.tsx    # 工作经历表单
│   ├── CampusExperienceForm.tsx  # 校园经历表单
│   ├── CertificatesForm.tsx      # 技能证书表单
│   ├── AwardsForm.tsx            # 获奖情况表单
│   ├── SelfEvaluationForm.tsx    # 自我评价表单
│   ├── OptionalModulesForm.tsx   # 附加模块表单
│   ├── AIOptimizePanel.tsx       # AI 优化面板
│   ├── ExportActions.tsx         # PDF/Word 导出
│   ├── ResumePreview.tsx         # 简历预览总控（模板路由）
│   ├── ResumeTemplate2.tsx       # 模板二：经典单栏
│   └── ResumeTemplate3.tsx       # 模板三：时间线布局
│
├── lib/                          # 业务逻辑 & 工具
│   ├── schema.ts                 # Zod 数据模型定义（完整验证规则）
│   ├── db.ts                     # MySQL 连接池（仅服务端）
│   ├── resume-defaults.ts        # 表单默认值 + 防御性数据合并
│   ├── use-resume-persistence.ts # 加载 / 防抖自动保存 Hook
│   ├── resume-templates.ts       # 模板工具函数（颜色、格式化、数据清洗）
│   └── utils.ts                  # 通用工具（cn 类名合并）
│
├── middleware.ts                 # Clerk 路由保护中间件
├── next.config.mjs               # Next.js 配置（standalone 输出）
├── tailwind.config.ts            # Tailwind 配置 + CSS 变量主题
├── ecosystem.config.cjs          # PM2 进程管理配置
├── DEPLOY.md                     # 部署文档
└── scripts/pack.mjs              # 部署打包脚本
```

### 数据流

#### 简历编辑 → 预览

```
用户在表单组件中输入数据
    ↓
react-hook-form 收集并管理表单状态
    ↓
Zod schema 实时验证（mode: "onChange"）
    ↓
form.watch() 获取最新数据 (liveData)
    ↓
ResumePreview 组件接收 liveData
    ↓
processResumeData() 清洗数据（移除空项）
    ↓
根据 activeTemplate 路由到对应模板组件
    ↓
模板组件渲染最终简历视图
```

#### AI 优化

```
用户点击某模块的"优化"按钮
    ↓
getContent() 提取该模块的内容文本
    ↓
POST /api/ai-optimize { section, content }
    ↓
服务端拼装 prompt → 调用阿里云 DashScope API
    ↓
返回 AI 优化结果
    ↓
前端展示结果 → 用户选择"应用"或"复制"
    ↓
应用 → form.setValue() 写回表单数据
```

#### 导出

```
用户点击"导出 PDF/Word"
    ↓
等待字体加载 + 图片加载（含超时）
    ↓
html2canvas 将预览区域渲染为 Canvas
    ↓
jsPDF 将 Canvas 转为 A4 尺寸 PDF / 打包为 Word
    ↓
触发浏览器下载（文件名带日期戳）
```

---

## 五、实现细节

### 1. 表单系统

- 使用 `react-hook-form` 的 `useForm` 管理全局表单状态，所有模块共享同一个 form 实例
- 多条目模块（教育、工作、项目等）使用 `useFieldArray` 实现动态增删
- 通过 `zodResolver` 将 Zod schema 接入表单验证，实现输入即校验
- 验证规则包括：字符长度限制、邮箱格式、URL 格式、十六进制颜色格式等

### 2. 模板渲染

- 模板工具函数库（`resume-templates.ts`）提供颜色处理（HEX 校验、透明度计算、深浅判断）、日期格式化、数据清洗等基础能力
- `processResumeData()` 在渲染前清洗数据：删除全空字段的条目，避免空白块出现
- `getContrastTextColor()` 根据背景色亮度自动选择黑色或白色文字，保证可读性

### 3. AI 优化 API

- 后端 API Route（`/api/ai-optimize`）接收 section 类型和内容文本
- 根据不同 section 类型拼装专业化的中文 prompt
- 调用阿里云 DashScope 兼容 OpenAI 格式的接口（`qwen-turbo` 模型，温度 0.7，最大 2000 tokens）
- 前端 `AIOptimizePanel` 以卡片形式展示 6 种优化选项，支持结果展示、应用和复制

### 4. 导出机制

- PDF：4.8 倍缩放确保高清晰度，按 A4 纸张比例裁切
- Word：2.5 倍缩放，DOM 克隆后图片化打包
- 导出前通过 `document.fonts.ready` 等待字体加载，并遍历 `<img>` 标签等待图片加载完成（3 秒超时兜底）
- 文件名自动移除非法字符，确保跨平台兼容

### 5. 认证与路由保护

- `middleware.ts` 使用 Clerk 的 `clerkMiddleware` 配合 `createRouteMatcher` 保护 `/builder` 路由
- 未登录用户访问受保护路由时自动重定向到登录页
- 登录/注册完成后自动跳转到 `/builder`
- `ClerkProvider` 配置中文本地化（`zhCN`）

### 6. 响应式设计

- 编辑器页面在桌面端呈三栏布局（菜单 + 表单 + 预览）
- 移动端通过 Tab 切换"编辑"和"预览"视图
- xl 以下屏幕显示汉堡菜单

### 7. 主题系统

- 基于 CSS 变量的主题方案，支持暗色模式（`darkMode: "class"`）
- 定义了完整的语义化颜色变量：background、foreground、primary、secondary、accent、muted、destructive 等
- 简历模板内部使用独立配色系统，不受全局主题影响

---

## 六、部署方案

### 构建

```bash
npm run build              # Next.js 生产构建
npm run deploy:pack        # 构建 + 打包 standalone 产物
```

Next.js 配置为 `output: "standalone"` 模式，构建产物包含所有依赖，无需 `node_modules`。

### 服务器部署

**方式一：直接启动**
```bash
HOSTNAME=0.0.0.0 PORT=3000 NODE_ENV=production node server.js
```

**方式二：PM2 进程管理（推荐）**
```bash
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup
```
- 自动重启、内存限制 512M、fork 模式

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 环境要求

- Node.js 18.17+（建议 Node.js 20 LTS）
- Linux 服务器
- 需配置以下环境变量：Clerk 密钥、MySQL 连接信息（DB_HOST/DB_USER/DB_PASSWORD/DB_NAME）、阿里云 API Key

---

## 七、开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发服务器（localhost:3000） |
| `npm run build` | 生产构建 |
| `npm run start` | 生产模式启动 |
| `npm run lint` | ESLint 代码检查 |
| `npm run deploy:pack` | 部署打包（生成 standalone 产物） |

---

## 八、技术决策说明

| 决策 | 选型 | 理由 |
|------|------|------|
| 全栈框架 | Next.js 14 (App Router) | SSR/SSG 支持、API Routes、文件系统路由 |
| 用户认证 | Clerk | SaaS 托管方案，开箱即用，无需自建 |
| 数据验证 | Zod + react-hook-form | 运行时类型安全 + 高性能表单管理 |
| 样式方案 | Tailwind CSS + CSS 变量 | 原子化高效开发 + 灵活主题切换 |
| UI 组件 | Shadcn UI (Radix) | 可定制的无头组件，与 Tailwind 深度集成 |
| 数据库 | MySQL 8 + mysql2 驱动 | 本地/自建均可，连接池复用；用户隔离在应用层用 Clerk userId 保证 |
| AI 能力 | 阿里云 DashScope | 国内低延迟，成本可控，兼容 OpenAI 接口 |
| 导出方案 | html2canvas + jsPDF | 纯前端实现，无需后端渲染服务 |
| 状态管理 | react-hook-form（无 Redux） | 表单场景足够，避免引入额外复杂度 |
| 部署模式 | Standalone + PM2 | 轻量产物，进程守护，适合 VPS 部署 |
