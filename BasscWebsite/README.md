# BASSC 速滑俱乐部 官方网站

基于 React + Vite 构建的速滑俱乐部官网前端项目。

## 技术栈

- **React 19** - 前端框架
- **Vite 7** - 构建工具，支持快速热更新
- **ESLint** - 代码规范

## 环境要求

- Node.js 18+ 
- npm 或 pnpm

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

在浏览器中访问 `http://localhost:5173` 查看网站。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 4. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
Bassc website/
├── public/          # 静态资源
├── src/
│   ├── assets/      # 图片、字体等资源
│   ├── App.jsx      # 主应用组件
│   ├── App.css      # 主应用样式
│   ├── main.jsx     # 入口文件
│   └── index.css    # 全局样式
├── index.html       # HTML 模板
├── package.json
├── vite.config.js   # Vite 配置
└── README.md
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 本地预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |

## 注意事项

如项目位于 OneDrive 同步文件夹，`npm install` 时可能因文件同步出现权限提示。一般不影响使用，可忽略或重试。若开发服务器启动失败，可尝试在**非 OneDrive 目录**下重新创建项目。
