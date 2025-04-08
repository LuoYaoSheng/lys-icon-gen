#!/bin/bash

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}========== iconsize 3.0.0 离线Docker构建脚本 ==========${NC}"
echo "此脚本使用离线模式构建Linux和Windows版本的应用"
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker未安装或不在PATH中.${NC}"
    echo "请访问 https://docs.docker.com/get-docker/ 安装Docker"
    exit 1
fi

# 确保Docker守护程序正在运行
if ! docker info &> /dev/null; then
    echo -e "${RED}错误: Docker守护程序未运行.${NC}"
    echo "请启动Docker服务然后重试"
    exit 1
fi

# 检查electron-cache目录是否存在
if [ ! -d "electron-cache" ] || [ -z "$(ls -A electron-cache 2>/dev/null)" ]; then
    echo -e "${YELLOW}警告: electron-cache目录不存在或为空${NC}"
    echo "建议先运行 node electron-download.js 下载Electron二进制文件"
    echo "或者确保网络连接正常以便在构建过程中下载"
    
    read -p "是否继续？[y/N]: " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        echo "已取消构建。请先准备好Electron缓存文件。"
        exit 0
    fi
fi

# 创建输出目录
mkdir -p dist

echo -e "${BLUE}选择要构建的平台:${NC}"
echo "1) Linux"
echo "2) Windows"
echo "3) macOS"
echo "4) 全部平台"
read -p "请选择 [1-4]: " CHOICE

build_linux_offline() {
    echo -e "${GREEN}开始离线构建Linux版本...${NC}"
    echo "构建Docker镜像..."
    
    # 清理可能存在的旧镜像
    docker rmi iconsize-linux-builder-offline 2>/dev/null || true
    
    # 构建docker镜像，使用--no-cache强制重新构建
    docker build --no-cache -t iconsize-linux-builder-offline -f Dockerfile.linux.offline . || {
        echo -e "${RED}构建Linux离线镜像失败！请检查Dockerfile.linux.offline和缓存文件。${NC}"
        return 1
    }
    
    echo "运行构建容器..."
    docker run --rm -v ${PWD}/dist:/app/dist iconsize-linux-builder-offline || {
        echo -e "${RED}运行Linux离线构建容器失败！${NC}"
        return 1
    }
    
    echo -e "${GREEN}Linux版本构建完成! 输出文件在 dist/ 目录${NC}"
    ls -la dist/ | grep -E "\.AppImage$|\.deb$|linux"
    return 0
}

build_windows_offline() {
    echo -e "${GREEN}开始离线构建Windows版本...${NC}"
    echo "构建Docker镜像..."
    
    # 清理可能存在的旧镜像
    docker rmi iconsize-windows-builder-offline 2>/dev/null || true
    
    # 构建docker镜像，使用--no-cache强制重新构建
    docker build --no-cache -t iconsize-windows-builder-offline -f Dockerfile.windows.offline . || {
        echo -e "${RED}构建Windows离线镜像失败！请检查Dockerfile.windows.offline和缓存文件。${NC}"
        return 1
    }
    
    echo "运行构建容器..."
    docker run --rm -v ${PWD}/dist:/app/dist iconsize-windows-builder-offline || {
        echo -e "${RED}运行Windows离线构建容器失败！${NC}"
        return 1
    }
    
    echo -e "${GREEN}Windows版本构建完成! 输出文件在 dist/ 目录${NC}"
    ls -la dist/ | grep -E "\.exe$|win-unpacked|\.msi$"
    return 0
}

build_mac_offline() {
    echo -e "${GREEN}开始离线构建macOS版本...${NC}"
    echo "构建Docker镜像..."
    
    # 清理可能存在的旧镜像
    docker rmi iconsize-mac-builder-offline 2>/dev/null || true
    
    # 构建docker镜像，使用--no-cache强制重新构建
    docker build --no-cache -t iconsize-mac-builder-offline -f Dockerfile.mac.offline . || {
        echo -e "${RED}构建macOS离线镜像失败！请检查Dockerfile.mac.offline和缓存文件。${NC}"
        return 1
    }
    
    echo "运行构建容器..."
    docker run --rm -v ${PWD}/dist:/app/dist iconsize-mac-builder-offline || {
        echo -e "${RED}运行macOS离线构建容器失败！${NC}"
        return 1
    }
    
    echo -e "${GREEN}macOS版本构建完成! 输出文件在 dist/ 目录${NC}"
    ls -la dist/ | grep -E "\.dmg$|\.zip$|mac|darwin"
    return 0
}

case $CHOICE in
    1)
        build_linux_offline || echo -e "${RED}Linux离线构建过程失败${NC}"
        ;;
    2)
        build_windows_offline || echo -e "${RED}Windows离线构建过程失败${NC}"
        ;;
    3)
        build_mac_offline || echo -e "${RED}macOS离线构建过程失败${NC}"
        ;;
    4)
        build_linux_offline || echo -e "${RED}Linux离线构建过程失败${NC}"
        echo ""
        build_windows_offline || echo -e "${RED}Windows离线构建过程失败${NC}"
        echo ""
        build_mac_offline || echo -e "${RED}macOS离线构建过程失败${NC}"
        ;;
    *)
        echo -e "${RED}无效选择. 退出脚本.${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}所有请求的构建任务完成!${NC}"
echo "构建输出文件位于 dist/ 目录"
ls -la dist/
exit 0 