# 第一阶段：node 镜像打包前端
FROM node:18 AS frontend-builder

# 设置工作目录
WORKDIR /study-java-web

# 拷贝项目文件
COPY . .

# 安装pnpm
RUN npm install pnpm -g

RUN rm -rf node_modules package-lock.json dist

# 安装依赖
RUN pnpm install

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
COPY --from=frontend-builder /study-java-web/dist /usr/share/nginx/html

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

# 常规构建指令
# docker build -t xcy960815/study-java-web:1.x .