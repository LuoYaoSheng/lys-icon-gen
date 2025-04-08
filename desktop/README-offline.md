# iconsize 3.0.0 离线Docker构建指南

本文档介绍如何使用离线模式通过Docker容器构建iconsize应用的Windows、Linux和macOS版本。离线构建方式可以有效解决网络限制和跨平台构建时的连接问题。

## 前提条件

- 已安装Docker（[Docker安装指南](https://docs.docker.com/get-docker/)）
- Docker守护进程正在运行
- Node.js环境（用于运行下载脚本）

## 构建步骤

### 1. 准备Electron二进制文件

首先，需要下载所需的Electron二进制文件：

```bash
# 确保下载脚本有执行权限
chmod +x electron-download.js

# 运行下载脚本
node electron-download.js
```

这个脚本会创建一个`electron-cache`目录，并下载Linux、Windows和macOS平台的Electron二进制文件。这一步通常需要良好的网络连接，但只需执行一次。如果您有代理服务器，可以通过环境变量设置：

```bash
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
node electron-download.js
```

### 2. 使用离线构建脚本

准备好Electron缓存后，运行离线构建脚本：

```bash
# 确保脚本有执行权限
chmod +x docker-build-offline.sh

# 运行离线构建脚本
./docker-build-offline.sh
```

此脚本会提示您选择要构建的平台（Linux、Windows、macOS或全部），然后使用预先下载的二进制文件进行构建。

### 手动离线构建

如果您想手动控制构建过程，可以按照以下步骤操作：

#### Linux版本

```bash
# 构建Docker镜像
docker build -t iconsize-linux-builder-offline -f Dockerfile.linux.offline .

# 运行构建容器
docker run --rm -v $(pwd)/dist:/app/dist iconsize-linux-builder-offline
```

#### Windows版本

```bash
# 构建Docker镜像
docker build -t iconsize-windows-builder-offline -f Dockerfile.windows.offline .

# 运行构建容器
docker run --rm -v $(pwd)/dist:/app/dist iconsize-windows-builder-offline
```

#### macOS版本

```bash
# 构建Docker镜像
docker build -t iconsize-mac-builder-offline -f Dockerfile.mac.offline .

# 运行构建容器
docker run --rm -v $(pwd)/dist:/app/dist iconsize-mac-builder-offline
```

## 离线构建文件解释

以下是离线构建使用的主要文件：

- `electron-download.js` - 下载Electron二进制文件的脚本
- `Dockerfile.linux.offline` - Linux平台的离线构建Dockerfile
- `Dockerfile.windows.offline` - Windows平台的离线构建Dockerfile
- `Dockerfile.mac.offline` - macOS平台的离线构建Dockerfile
- `docker-build-offline.sh` - 自动化离线构建脚本

## 平台特定说明

### Linux构建

Linux构建默认只生成AppImage格式，这是一种自包含格式，可以在多数Linux发行版上运行。如果需要deb或rpm格式，需要修改`electron-builder.yml`文件中的配置。

### Windows构建

Windows构建支持生成NSIS安装程序、便携版和ZIP压缩包。ICO格式图标已经正确配置。

### macOS构建

macOS构建支持生成DMG安装镜像和ZIP压缩包。注意在非macOS环境中构建macOS应用会有一些限制：
- 无法签名应用程序
- 无法创建带有自定义背景的DMG文件（需手动在macOS上运行`make:dmg`脚本）

## 故障排除

### 找不到Electron缓存

如果脚本无法找到Electron缓存文件，请确保已正确运行`electron-download.js`，并且`electron-cache`目录中包含所需的二进制文件。

### Docker构建失败

如果Docker构建失败，可以尝试以下方法：

1. 检查Docker是否有足够的资源（内存、磁盘空间）
2. 使用`docker logs <container-id>`查看详细错误信息
3. 手动修改Dockerfile，调整构建参数

### 构建结果不完整

如果构建结果不完整或缺少某些文件，可能是因为：

1. 二进制文件下载不完整 - 重新运行`electron-download.js`
2. 卷挂载问题 - 检查Docker卷权限
3. 构建参数不正确 - 查看`package.json`中的构建配置

## 进一步自定义

如果需要进一步定制离线构建过程，可以：

1. 修改`electron-download.js`中的版本号以下载不同版本的Electron
2. 调整Dockerfile中的环境变量和构建参数
3. 添加其他预下载的依赖到缓存目录

## 支持和反馈

如有问题，请访问 https://i2kai.com 获取支持。 