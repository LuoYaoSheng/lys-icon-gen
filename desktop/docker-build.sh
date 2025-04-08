#!/bin/bash

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}========== iconsize 3.0.0 Docker 构建脚本 ==========${NC}"
echo "此脚本使用Docker构建Linux和Windows版本的应用"
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

# 创建输出目录
mkdir -p dist

echo -e "${BLUE}选择要构建的平台:${NC}"
echo "1) Linux"
echo "2) Windows"
echo "3) 两者都构建"
read -p "请选择 [1-3]: " CHOICE

build_linux() {
    echo -e "${GREEN}开始构建Linux版本...${NC}"
    echo "构建Docker镜像..."
    
    # 清理可能存在的旧镜像
    docker rmi iconsize-linux-builder 2>/dev/null || true
    
    # 构建docker镜像，使用--no-cache强制重新构建
    docker build --no-cache -t iconsize-linux-builder -f Dockerfile.linux . || {
        echo -e "${RED}构建Linux镜像失败！请检查Dockerfile.linux和网络连接。${NC}"
        return 1
    }
    
    echo "运行构建容器..."
    docker run --rm -v ${PWD}/dist:/app/dist iconsize-linux-builder || {
        echo -e "${RED}运行Linux构建容器失败！${NC}"
        return 1
    }
    
    echo -e "${GREEN}Linux版本构建完成! 输出文件在 dist/ 目录${NC}"
    ls -la dist/ | grep -E "\.AppImage$|\.deb$|linux"
    return 0
}

build_windows() {
    echo -e "${GREEN}开始构建Windows版本...${NC}"
    echo "构建Docker镜像..."
    
    # 清理可能存在的旧镜像
    docker rmi iconsize-windows-builder 2>/dev/null || true
    
    # 构建docker镜像，使用--no-cache强制重新构建
    docker build --no-cache -t iconsize-windows-builder -f Dockerfile.windows . || {
        echo -e "${RED}构建Windows镜像失败！请检查Dockerfile.windows和网络连接。${NC}"
        return 1
    }
    
    echo "运行构建容器..."
    docker run --rm -v ${PWD}/dist:/app/dist iconsize-windows-builder || {
        echo -e "${RED}运行Windows构建容器失败！${NC}"
        return 1
    }
    
    echo -e "${GREEN}Windows版本构建完成! 输出文件在 dist/ 目录${NC}"
    ls -la dist/ | grep -E "\.exe$|win-unpacked|\.msi$"
    return 0
}

case $CHOICE in
    1)
        build_linux || echo -e "${RED}Linux构建过程失败${NC}"
        ;;
    2)
        build_windows || echo -e "${RED}Windows构建过程失败${NC}"
        ;;
    3)
        build_linux || echo -e "${RED}Linux构建过程失败${NC}"
        echo ""
        build_windows || echo -e "${RED}Windows构建过程失败${NC}"
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