# CLAUDE.md

这份文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 常用命令

```bash
npm run dev       # 启动 Vite 开发服务器 (http://localhost:5173)
npm run build     # 类型检查 (tsc -b) 后构建生产包到 dist/
npm run preview   # 本地预览生产构建
```

未配置测试或代码检查命令。

## 项目概况

**手账待办清单** — 单页 React 18 + TypeScript 待办应用，日系手账/文具美学风格。无路由，无状态管理库，纯客户端 localhost 开发。

### 技术栈

- React 18.3 + TypeScript 5.6（strict 模式，启用 `noUnusedLocals` / `noUnusedParameters`）
- Vite 6 构建，`@vitejs/plugin-react`
- 零依赖运行（仅 react + react-dom）
- 数据持久化：`localStorage`（键名 `journal_todos`）

### 数据流

所有状态集中在 `src/hooks/useTodos.ts` 这一个自定义 Hook 中，暴露 `todos`、`filteredTodos`、`stats` 以及全部修改方法。每次 `todos` 变更时通过 `useEffect` 自动持久化到 `localStorage`。派生数据（`filteredTodos`、`stats`）通过 `useMemo` 计算。

`App.tsx` 调用 `useTodos()`，把数据通过 props 分发给子组件——没有 Context 或 Redux。

### 组件树

```
App
├── Header         — 标题、日期印章、装订环、和纸胶带（纯展示）
├── StatsBar       — 待办/完成计数 + 进度条（接收 stats: TodoStats）
├── TaskInput      — 文字输入框、分类标签选择器、添加按钮、"AI分解"按钮
├── FilterBar      — 全部 / 进行中 / 已完成 切换（接收 current: Filter）
├── TaskList       — 遍历 filteredTodos[] → TaskItem 组件
│   └── TaskItem   — 单行：复选框、文字（支持行内编辑）、分类徽标、时间戳、编辑/删除按钮
└── Footer         — "清除已完成"按钮 + 底部花饰
```

### 类型系统（`src/types.ts`）

- `Todo { id, text, done, cat, createdAt }` — id 由 `Date.now() + Math.random()` 生成
- `Category = '' | 'work' | 'life' | 'study' | 'other'` — 空字符串表示未分类
- `Filter = 'all' | 'active' | 'done'`
- `CATEGORY_CONFIG`：每个分类 → `{ label, bg, text }`（中文标签 + 配色对），供 TaskInput 选择器和 TaskItem 徽标共用
- `CATEGORIES`：所有分类值的数组，用于遍历渲染

### AI 拆解功能（`src/api/deepseek.ts`）

- 直接通过 `fetch`（无 SDK）调用 DeepSeek Chat Completions API
- `decomposeTask()` 接收任务描述，返回 3-7 个子任务的 `string[]`
- 模型：`deepseek-v4-flash`，`temperature: 0.7`，`max_tokens: 1024`
- 健壮的错误处理：API Key 缺失、响应非 OK、JSON 解析失败、模型在数组外包裹解释性文字（正则 `content.match(/\[[\s\S]*\]/)` 兜底提取）
- 自定义错误类 `DecomposeError` 区分 API 错误和网络错误
- 需要 `.env` 中配置 `VITE_DEEPSEEK_API_KEY`（参考 `.env.example`），API 调用完全在客户端执行

### 交互细节

- `Ctrl+K` / `Cmd+K` 全局快捷键聚焦输入框（`App.tsx` 中注册 `keydown` 监听，通过 `useEffect` 绑定/解绑）
- 回车直接添加待办；编辑模式下回车保存、Escape 取消
- 输入框 `maxLength={200}`
- TaskItem 行内编辑：双击编辑按钮进入，失焦自动保存

### 样式规范

- CSS 变量统一在 `src/App.css :root` 中定义——`--paper`、`--ink`、`--accent`、`--line` 等，是所有组件 CSS 文件的配色唯一来源
- 每个组件 `.tsx` 同目录下放置同名的 `.css` 文件
- Google Fonts 通过 CDN 加载：ZCOOL KuaiLe（标题）、Ma Shan Zheng（中文手写体）、Noto Sans SC（正文），在 `index.html` 中引入
- 手账美学通过伪元素装饰实现（装订环、和纸胶带、波点网格线桌面背景）——纯 CSS，无图片
- 响应式：每个 CSS 文件内设有 `@media (max-width: 480px)` 断点

### 项目 Skills

- `weekly-report`（`.claude/skills/weekly-report.md`）：生成结构化周报，包含本周完成、开发详情、待办事项、风险阻塞、下周计划等板块

### 其他

- `.gitignore` 已忽略 `node_modules`、`dist`、`.env`、`*.local`
- 未设置自动化测试、CI/CD 或代码检查
