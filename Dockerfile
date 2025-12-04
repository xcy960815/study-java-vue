# 第一阶段：node 镜像打包前端
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /study-java-web

# 安装pnpm
RUN npm install pnpm -g

# 先拷贝依赖文件，利用 Docker 缓存层
COPY package.json pnpm-lock.yaml ./

# 清理并安装依赖
RUN rm -rf node_modules package-lock.json dist && \
    pnpm install --frozen-lockfile

# 拷贝项目文件（在安装依赖之后，利用缓存）
COPY . .

# 确保 env 目录存在，如果不存在则创建并写入默认环境变量
RUN mkdir -p env && \
    if [ ! -f env/.env.prod ]; then \
        echo "VITE_PORT=80" > env/.env.prod && \
        echo "VITE_APP_TITLE=study-java-web" >> env/.env.prod && \
        echo "VITE_BASE_URL=/" >> env/.env.prod && \
        echo "VITE_API_DOMAIN_PREFIX=/prod-api" >> env/.env.prod && \
        echo "VITE_API_SERVER_DOMAIN=http://study-java-container:8084" >> env/.env.prod && \
        echo "VITE_API_SERVER_DOMAIN_PREFIX=/prod-api" >> env/.env.prod; \
    fi

# 构建生产环境包
RUN pnpm run build-prod

# 第二阶段：用 nginx 运行构建好的前端
FROM nginx:1.21

# 容器监听端口
EXPOSE 80

# 设置工作目录
WORKDIR /study-java-web

# 替换 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 清理默认 html 文件夹
RUN rm -rf /usr/share/nginx/html && mkdir -p /usr/share/nginx/html

# 拷贝构建结果
COPY --from=builder /study-java-web/dist /usr/share/nginx/html

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

# 常规构建指令
# docker build -t xcy960815/study-java-web:1.x .