# iconsize 3.0.0 Docker构建指南

本文档介绍如何使用Docker容器来构建iconsize应用的Windows和Linux版本。使用Docker构建可以避免跨平台构建时的环境问题和依赖冲突。

## 前提条件

- 已安装Docker（[Docker安装指南](https://docs.docker.com/get-docker/)）
- Docker守护进程正在运行
- 良好的网络连接（或使用配置的镜像源）

## 快速开始

最简单的方法是使用提供的构建脚本：

```bash
# 确保脚本有执行权限
chmod +x docker-build.sh

# 运行构建脚本
./docker-build.sh
```

这个脚本会提示你选择要构建的平台（Linux、Windows或两者都构建），然后自动完成构建过程。

## 手动构建步骤

如果你想手动控制构建过程，可以按照以下步骤操作：

### 构建Linux版本

1. 构建Docker镜像：

```bash
docker build -t iconsize-linux-builder -f Dockerfile.linux .
```

2. 运行构建容器：

```bash
docker run --rm -v $(pwd)/dist:/app/dist iconsize-linux-builder
```

### 构建Windows版本

1. 构建Docker镜像：

```bash
docker build -t iconsize-windows-builder -f Dockerfile.windows .
```

2. 运行构建容器：

```bash
docker run --rm -v $(pwd)/dist:/app/dist iconsize-windows-builder
```

## 构建输出

成功构建后，你可以在`dist`目录中找到以下文件：

### Linux构建产物

- `.AppImage`文件 - 适用于大多数Linux发行版的便携式执行文件
- `.deb`文件 - Debian/Ubuntu安装包
- `.rpm`文件 - RedHat/Fedora安装包

### Windows构建产物

- `.exe`安装程序 - 包含安装向导的安装程序
- `win-unpacked`目录 - 便携版应用
- `.msi`文件 - Windows Installer包

## 故障排除

### 网络问题

如果在Docker构建过程中遇到网络问题，我们已经在以下文件中配置了国内镜像源：

- `package.json`中的`config`部分
- `.npmrc`文件

这些配置应该能够解决大部分网络连接问题。

### 权限问题

如果在Linux上运行时遇到权限问题，可能需要调整生成文件的所有权：

```bash
sudo chown -R $(whoami):$(whoami) dist/
```

### 清理Docker资源

如果需要清理Docker资源，可以运行：

```bash
# 删除构建镜像
docker rmi iconsize-linux-builder iconsize-windows-builder

# 清理未使用的构建缓存
docker builder prune
```

## 进一步定制

如果需要进一步定制构建过程，可以修改：

- `Dockerfile.linux`和`Dockerfile.windows`文件调整构建环境
- `package.json`中的`build`部分调整构建配置
- `electron-builder.yml`文件提供更详细的构建选项

## 支持和反馈

如有问题，请访问 https://i2kai.com 获取支持。 