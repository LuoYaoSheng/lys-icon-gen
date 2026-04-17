# Icon Gen

> lys Open Source 体系中的多平台图标生成工具

- 项目站：<https://icon.open.i2kai.com>
- 在线工具：<https://icon.open.i2kai.com/tool/>
- Gitee：<https://gitee.com/luoyaosheng/lys-icon-gen>
- GitHub：<https://github.com/LuoYaoSheng/lys-icon-gen>

快速生成多平台所需的各种尺寸图标，支持iOS、Android、MacOS和Windows平台。

## 项目结构

本项目包含两个版本的图标生成器：

- **web/**：基于网页的图标生成器，参考蒲公英平台实现
- **desktop/**：基于Electron的桌面应用，参考Icon Resize实现

## Web版本

Web版本完全在浏览器中运行，使用HTML5 Canvas API处理图像缩放和转换。所有处理都在客户端完成，不会上传图片到服务器。

### 特点

- 无需安装，直接在浏览器中使用
- 支持拖放或文件选择方式上传图片
- 支持一键生成所有平台图标
- 支持批量zip下载所有图标
- 支持生成符合平台标准的文件结构和资源文件
  - 为iOS/macOS/watchOS创建Contents.json文件
  - 为Android创建自适应图标及相关XML文件
  - 支持配置子文件夹和文件命名规则

### 使用方法

```bash
cd web
npm install
npm start
```

然后访问 http://localhost:3000

## 桌面版本

桌面版本基于Electron框架，提供原生桌面体验，支持Windows、macOS和Linux平台。

### 特点

- 原生桌面应用体验
- 使用系统原生API处理图像，效率更高
- 直接导出到本地文件系统
- 跨平台支持
- 支持生成符合平台标准的资源文件
  - 为苹果系平台创建标准的AppIcon.appiconset结构
  - 为Android创建自适应图标结构

### 使用方法

```bash
cd desktop
npm install
npm start
```

## 支持的图标尺寸

### iOS
20×20, 29×29, 40×40, 58×58, 60×60, 76×76, 80×80, 87×87, 120×120, 152×152, 167×167, 180×180, 1024×1024

### Android
36×36, 48×48, 72×72, 96×96, 144×144, 192×192

### MacOS
16×16, 32×32, 64×64, 128×128, 256×256, 512×512, 1024×1024

### Windows
16×16, 24×24, 32×32, 48×48, 64×64, 96×96, 128×128, 256×256

## 文件结构生成

本项目支持为不同平台生成标准的文件结构：

- **iOS/macOS/watchOS**：生成 `Assets.xcassets/AppIcon.appiconset` 目录结构，包含符合规范的 Contents.json 文件
- **Android**：生成 `res/mipmap-*` 和 `res/values` 目录结构，支持自适应图标(Adaptive Icons)相关文件
- **Windows**：生成 `Assets` 目录结构，包含各尺寸图标

用户可以根据需要配置以下选项：
- 是否为每个平台创建子文件夹
- 是否在文件名前添加平台前缀
- 是否创建Contents.json文件(iOS/macOS)
- 是否创建自适应图标相关文件(Android)

## 许可证

Apache-2.0 License 
