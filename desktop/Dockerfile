FROM electronuserland/builder:14-wine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 设置缓存目录权限
RUN mkdir -p /root/.cache/electron && \
    mkdir -p /root/.cache/electron-builder && \
    chmod -R 777 /root/.cache

# 设置npm配置，使用淘宝镜像加速下载
RUN npm config set electron_mirror https://npmmirror.com/mirrors/electron/ && \
    npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/

# 暴露Electron应用端口
EXPOSE 9000

# 卷挂载点用于输出构建结果
VOLUME /app/dist

# 默认命令
CMD ["npm", "run", "build"] 