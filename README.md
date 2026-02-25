# study-java-vue

该项目是前身是配合学习 spring-boot3 所搭建的，随着能不再满足后端的正删改查，于是该项目变成了常规的curd项目，该项目使用了vue3 + vite + typescript + pina + vue-router 开发，ui库使用 element-plus + icon-park + postcss + tailwind 等ui库

## 🚀 技术栈

### 核心框架

- Vue 3.4.x - 渐进式 JavaScript 框架
- TypeScript 5.4.x - JavaScript 的超集
- Vite 5.3.x - 下一代前端构建工具
- Pinia 2.3.x - Vue 的状态管理库
- Vue Router 4.4.x - Vue.js 的官方路由

### UI 框架

- Element Plus 2.9.x - 基于 Vue 3 的组件库
- Icon Park - 图标库
- Tailwind CSS 3.1.x - 实用优先的 CSS 框架
- PostCSS - CSS 转换工具

### 开发工具

- pnpm - 包管理工具
- ESLint - 代码检查
- Prettier - 代码格式化
- Husky - Git hooks 工具
- Commitlint - Git 提交信息规范
- Conventional Changelog - 自动生成 CHANGELOG

### 测试框架

- Vitest - 单元测试框架
- Vue Test Utils - Vue 组件测试工具

## 📦 包管理工具

    pnpm

## 🛠️ 开发环境要求

- Node.js >= 18.20.4
- pnpm >= 8.x

## 🚀 快速开始

### 安装依赖

```sh
pnpm install
```

### 开发环境启动指令

```sh
pnpm run dev
```

### 预发环境启动指令

```sh
pnpm run dev:pre
```

### 线上环境启动指令

```sh
pnpm run dev:prod
```

### 日常环境打包

```sh
pnpm run build
```

### 预发环境打包

```sh
pnpm run build:pre
```

### 线上环境打包

```sh
pnpm run build:prod
```

### 预览打包结果

```sh
# 日常环境
pnpm run preview

# 预发环境
pnpm run preview:pre

# 生产环境
pnpm run preview:prod
```

### 运行测试

```sh
pnpm run test:unit
```

### 类型检查

```sh
pnpm run type-check
```

### 代码格式化

```sh
pnpm run format
```

## 📂 项目目录结构

```bash
├── src
│   ├── assets          # 静态资源（图片、样式等）
│   ├── components      # 公共组件
│   ├── views           # 视图页面
│   ├── store           # Pinia 状态管理
│   ├── router          # 路由配置
│   ├── utils           # 工具函数
│   ├── apis            # 接口请求封装
│   ├── plugins         # 插件配置
│   ├── enums           # 枚举定义
│   ├── main.ts         # 入口文件
│   └── App.vue         # 根组件
├── public              # 公共文件（如 index.html）
├── env                 # 不同环境的配置文件
├── types               # TypeScript 声明文件
├── .husky             # Git hooks 配置
├── .vscode            # VSCode 配置
├── index.html          # 项目的根 html 文件
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── postcss.config.cjs  # PostCSS 配置
├── tailwind.config.cjs # Tailwind CSS 配置
├── package.json        # 依赖管理
└── README.md           # 项目说明文档
```

## 🔧 开发规范

### Git 提交规范

项目使用 Conventional Commits 规范，提交信息格式如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 EditorConfig 统一编辑器配置

## 📝 更新日志

详细的更新日志请查看 [CHANGELOG.md](./CHANGELOG.md)

## 📄 许可证

[MIT](./LICENSE)
