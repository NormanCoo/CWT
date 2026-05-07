# 项目名称：Cross-Platform Calendar Task Manager (CP-CTM)
# 开发者指令集：用于 Claude Code 引导开发

## 1. 项目愿景
开发一个轻量级、跨平台互通的日历计划软件。
- **PC端**：响应式 Web 界面，侧重于高效的任务排布和周/月视图查看。
- **手机端**：通过 PWA（渐进式Web应用）实现接近原生 App 的体验，侧重于快速记录和状态勾选。
- **核心能力**：数据实时同步、多端统一鉴权、响应式布局。

## 2. 技术栈要求 (Technical Stack)
请 Claude Code 严格按照以下技术栈进行开发：
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件库**: shadcn/ui (必须包含 Calendar, Dialog, Form, Button, Card)
- **后端/数据库**: Supabase (PostgreSQL + Auth + Realtime)
- **状态管理**: Zustand (轻量级跨组件状态共享)
- **部署目标**: Vercel (前端) + Supabase (后端)

## 3. 数据库模型 (Schema)
在 Supabase 中构建以下表结构：

### 表：profiles (用户扩展信息)
- id: uuid (references auth.users)
- full_name: text
- avatar_url: text

### 表：tasks (计划任务)
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- title: text (not null)
- description: text
- start_time: timestamp with time zone (not null)
- end_time: timestamp with time zone
- status: enum ('todo', 'in-progress', 'done')
- priority: enum ('low', 'medium', 'high')
- created_at: timestamp with time zone

## 4. 开发阶段规划 (Development Phases)

### Phase 1: 环境初始化与基础配置
1. 初始化 Next.js 项目。
2. 配置 Tailwind CSS 与 shadcn/ui 基础组件。
3. 建立 Supabase Client 客户端连接，配置 `.env.local` 模板。

### Phase 2: 用户鉴权系统 (Authentication)
1. 实现登录、注册、找回密码页面。
2. 封装 `useAuth` Hook，管理全局登录状态。
3. 设置中间件 (Middleware) 保护受限路由 `/dashboard`。

### Phase 3: 核心日历视图 (Calendar Engine)
1. 实现响应式 Dashboard：
   - **Desktop**: 采用左侧边栏 + 右侧大日历视图（月/周切换）。
   - **Mobile**: 采用顶部紧凑型日历条 + 下方任务列表滚动视图。
2. 集成 `date-fns` 进行时间处理。

### Phase 4: 任务管理功能 (CRUD)
1. 实现点击日历新建任务的对话框（Dialog）。
2. 实现任务编辑、删除、状态快速切换。
3. **关键点**：确保所有操作后，UI 通过 Supabase Realtime 或优化后的 SWR/React Query 实现即时同步。

### Phase 5: 移动端优化与 PWA
1. 配置 `next-pwa`，生成 `manifest.json` 和 Service Worker。
2. 确保图标、启动屏适配手机端。
3. 增加“添加到主屏幕”的引导说明。

## 5. UI/UX 约束
- **配色**：支持暗黑模式 (Dark Mode)，默认深色系（适合工程师审美）。
- **交互**：手机端必须支持滑动操作（如左滑删除、右滑完成）。
- **性能**：首屏加载时间需控制在 1.5s 以内。

## 6. 给 Claude Code 的第一步指令
> "请阅读上述文档，首先帮我初始化项目结构，并列出你需要我手动在 Supabase 控制台配置的 SQL 建表语句。"