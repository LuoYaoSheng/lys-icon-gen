# 图标生成器 - 桌面版

这是一个基于Electron的跨平台桌面应用，参考Icon Resize实现，可以快速为iOS、Android、macOS和Windows平台生成所需的各种尺寸图标。

## 功能特点

- 友好的图形用户界面
- 支持拖放或文件选择方式上传原始图片
- 支持选择目标平台（iOS、Android、macOS、Windows等）
- 自动生成平台所需的所有尺寸图标
- 一键导出到指定目录
- 支持保存自定义配置
- 跨平台支持（Windows、macOS、Linux）

## 开发环境设置

1. 安装依赖：

```bash
cd desktop
npm install
```

2. 启动应用进行开发：

```bash
npm start
```

或使用调试模式：

```bash
npm run dev
```

## 构建应用

构建适用于当前平台的应用：

```bash
npm run build
```

构建特定平台的应用：

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

构建后的应用将位于`dist`目录中。

## 目录结构

```
desktop/
├── src/                # 源代码目录
│   ├── main/           # 主进程代码
│   ├── renderer/       # 渲染进程代码
│   └── assets/         # 资源文件（图像、样式等）
├── package.json        # 项目配置
└── README.md           # 说明文档
```

## 支持的平台及图标尺寸

### iOS
20×20, 29×29, 40×40, 58×58, 60×60, 76×76, 80×80, 87×87, 120×120, 152×152, 167×167, 180×180, 1024×1024

### Android
36×36, 48×48, 72×72, 96×96, 144×144, 192×192

### macOS
16×16, 32×32, 64×64, 128×128, 256×256, 512×512, 1024×1024

### Windows
16×16, 24×24, 32×32, 48×48, 64×64, 96×96, 128×128, 256×256

## 技术实现

- 基于Electron框架
- 使用Node.js的原生模块处理图像
- 使用HTML/CSS/JavaScript构建界面 