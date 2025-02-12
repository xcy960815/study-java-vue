# 第一阶段：node镜像打包
FROM node:18 AS frontend-builder
# 像。工作目录被设置为 /study-java-web
WORKDIR /study-java-web
# 从本地复制文件到 Docker 容器
COPY . .
# 执行 npm install 安装依赖
RUN npm install
# 执行 npm run build 打包醒目
RUN npm run build-prod

# 第二阶段：nginx打包
FROM nginx:1.21
EXPOSE 80
WORKDIR /app
# 将本地的nginx配置 替换nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 删除 /usr/share/nginx/html 文件夹
RUN rm -rf /usr/share/nginx/html
# 创建 /usr/share/nginx/html 文件夹
RUN mkdir /usr/share/nginx/html
# 将打包好的构建产物复制 docker中
COPY --from=frontend-builder /study-java-web/dist /usr/share/nginx/html

# 运行
CMD ["nginx", "-g", "daemon off;"]
# 构建镜像
# docker build -t xcy960815/study-java-web:1.0 .
# 构建容器
# docker run --name study-java-web-container -dp 1234:80 xcy960815/study-java-web:1.0