# 第一阶段：node镜像打包
FROM node:18 AS frontend-builder
WORKDIR /study-java-web
COPY . .
RUN npm install
RUN npm run build-prod

# 第二阶段：nginx打包
FROM nginx:1.21
EXPOSE 80
WORKDIR /app
# 替换nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将第一阶段的静态文件复制到nginx中
RUN rm -rf /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html
COPY --from=frontend-builder /study-java-web/dist /usr/share/nginx/html

# 运行
CMD ["nginx", "-g", "daemon off;"]
# 构建镜像
# docker build -t xcy960815/study-java-web:1.0 .
# 构建容器
# docker run --name study-java-web-container -dp 1234:80 xcy960815/study-java-web:1.0