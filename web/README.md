# 图标生成器 - Web版本

这是一个基于网页的图标生成器，参考蒲公英(pgyer.com)平台实现，可以快速为iOS、Android、macOS和Windows平台生成所需的各种尺寸图标。

## 功能特点

- 上传1024×1024的图标，自动生成各平台所需的所有尺寸图标
- 支持多种平台：iOS、iPadOS、MacOS、Android、Windows、watchOS
- 简洁的用户界面，一键操作，轻松生成
- 所有处理在浏览器中完成，不会上传图片到服务器
- 支持ZIP包下载所有生成的图标
- 支持生成符合平台标准的文件结构和资源文件
  - 为iOS/macOS/watchOS创建标准的Contents.json文件
  - 为Android创建自适应图标及相关XML文件
  - 支持灵活配置输出结构和文件命名

## 开发环境设置

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 在浏览器中访问：http://localhost:3000

## 目录结构

```
web/
├── public/          # 静态资源目录
│   ├── css/         # 样式文件
│   │   ├── style.css        # 主样式文件
│   │   └── responsive.css   # 响应式布局样式
│   ├── js/          # JavaScript文件
│   │   ├── iconSizes.js     # 图标尺寸定义
│   │   ├── imageProcessor.js # 图像处理类
│   │   ├── fileUtils.js     # 文件结构生成工具
│   │   └── main.js          # 主逻辑文件
│   ├── images/      # 图像资源
│   └── index.html   # 主页面
├── server.js        # 服务器文件
└── package.json     # 项目配置
```

## 使用方法

1. 上传您的图标图片（推荐尺寸1024×1024）
2. 选择需要生成的平台
3. 配置输出选项
   - 是否为每个平台创建子文件夹
   - 是否在文件名前添加平台前缀
   - 是否创建Contents.json文件(iOS/macOS/watchOS)
   - 是否创建自适应图标相关文件(Android)
4. 点击"生成"按钮
5. 下载生成的图标（单个下载或打包下载）

## 输出选项详解

### 1. 子文件夹结构

启用后，将为每个平台创建单独的文件夹，并在其中组织标准的资源目录结构。例如：

```
iOS/
├── Assets.xcassets/
│   └── AppIcon.appiconset/
│       ├── Contents.json
│       ├── icon-20.png
│       ├── icon-20@2x.png
│       └── ...其他图标

Android/
├── res/
│   ├── mipmap-mdpi/
│   │   ├── ic_launcher.png
│   │   ├── ic_launcher.xml (自适应图标配置)
│   │   └── ic_launcher_foreground.png (自适应图标前景)
│   ├── mipmap-hdpi/
│   │   └── ...同上
│   └── values/
│       └── ic_launcher_background.xml (自适应图标背景配置)
```

### 2. 文件名前缀

当不使用子文件夹结构时，可以启用此选项，为文件名添加平台前缀，例如：`ios-icon-20.png`, `android-ic_launcher.png`等。

### 3. Contents.json 文件

为iOS/macOS/watchOS平台生成标准的Contents.json配置文件，包含图标元数据。这是Xcode项目所需的资源索引文件，包含每个图标的大小、比例和用途等信息。

### 4. 自适应图标

为Android平台生成自适应图标(Adaptive Icons)相关资源，包括:
- 前景图像(foreground)：用于显示APP图标的主体内容
- 背景配置：定义图标背景颜色
- XML配置文件：组合前景和背景的配置文件

## 支持的图标尺寸

### iOS/iPadOS
- 20×20、29×29、40×40、58×58、60×60、76×76、80×80、87×87、120×120、152×152、167×167、180×180、1024×1024

### Android
- 36×36、48×48、72×72、96×96、144×144、192×192
- 自适应图标: 108×108、162×162、216×216、324×324、432×432

### macOS
- 16×16、32×32、64×64、128×128、256×256、512×512、1024×1024

### Windows
- 16×16、24×24、32×32、44×44、48×48、64×64、96×96、128×128、256×256

### watchOS
- 48×48、55×55、58×58、80×80、87×87、88×88、100×100、172×172、196×196、216×216、1024×1024

## 技术实现

- 使用HTML5 Canvas进行图像处理
- 使用JSZip库进行ZIP文件打包
- 纯前端实现，无需后端支持
- 使用CSS自定义属性实现主题统一
- 响应式设计，适配各种设备 