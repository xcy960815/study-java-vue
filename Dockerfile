# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 启用 corepack 并准备 pnpm (比 npm install -g pnpm 更轻量)
RUN corepack enable && corepack prepare pnpm@latest --activate

# 先拷贝依赖定义文件，利用 Docker 缓存层
COPY package.json pnpm-lock.yaml ./

# 安装依赖
# --frozen-lockfile 确保 lock 文件不被修改
RUN pnpm install --frozen-lockfile

# 拷贝源代码 (注意：.dockerignore 中已排除 node_modules)
COPY . .

# 构建生产环境包
RUN pnpm run build:prod

# 第二阶段：运行阶段
# 使用 alpine 版本减小体积
FROM nginx:alpine

# 设置时区 (确保日志时间正确)
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 替换 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 清理默认文件并从构建阶段拷贝资源
# 注意：nginx:alpine 默认目录即为 /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]