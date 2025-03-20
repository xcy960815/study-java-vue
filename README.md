# study-java-web

该项目是前身是配合学习 spring-boot3 所搭建的，随着能不再满足后端的正删改查，于是该项目变成了常规的curd项目，该项目使用了vue3 + vite + typescript + pina + vue-router 开发，ui库使用 element-plus + icon-park + postcss + tailwind 等ui库

## 包管理工具
    pnpm

## 安装依赖
```sh
pnpm install
```

### 开发环境启动指令
```sh
pnpm run dev
```

### 预发环境启动指令
```sh
pnpm run dev-pre
```

### 线上环境启动指令
```sh
pnpm run dev-prod
```

### 日常环境打包
```sh
pnpm run build
```

### 预发环境打包
```sh
pnpm run build-pre
```

### 线上环境打包
```sh
pnpm run build-prod
```

### 📂 项目目录结构

```bash
├── src
│   ├── assets          # 静态资源（图片、样式等）
│   ├── components      # 公共组件
│   ├── views           # 视图页面
│   ├── store           # Vuex 状态管理
│   ├── router          # 路由配置
│   ├── utils           # 工具函数
│   ├── api             # 接口请求封装
│   ├── main.js         # 入口文件
│   └── App.vue         # 根组件
├── public              # 公共文件（如 index.html）
├── env                 # 不同环境的配置文件 文件后缀 跟 package.json 的 script 所对应
├── types               # 声明文件
├── index.html          # 项目的根 html文件
├── postcss.config.js   # postcss库配置文件
├── tailwind.config.cjs # tailwind库配置文件
├── tsconfig.app.json   # 浏览器环境的 typescript 配置文件
├── tsconfig.node.json   # node境的 typescript 配置文件
├── package.json        # 依赖管理
├── README.md           # 项目说明文档

└── .gitignore          # Git 忽略文件
```
