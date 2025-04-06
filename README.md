# IconSize - 批量图标生成工具 

![](https://img.shields.io/github/license/yueshutong/JustWrite) 
![](https://img.shields.io/static/v1?label=electron&message=6.0.12&color=)
![](https://img.shields.io/badge/platform-mac|window|linux-lightgrey.svg)

IconSize 是一款定位于快速批量制作指定大小的图片工具，帮助开发者轻松生成各平台所需的图标资源。

## 📋 功能特点

- ✅ **多平台支持**：批量生成 Android、iOS、Mac、Windows 平台所需的各种尺寸图片
- ✅ **自定义导出路径**：可设置自定义生成位置，提高工作效率
- ✅ **模板功能**：通过自定义模板文件批量指定图片规格
- ✅ **音效反馈**：操作过程中提供音效提示，增强用户体验
- ✅ **图片质量控制**：可调整 JPEG 图片的质量，平衡文件大小和图像质量
- ✅ **跨平台应用**：基于 Electron 开发，支持 macOS、Windows 和 Linux 系统

## 🖼️ 应用预览

![应用截图1](https://wx3.sinaimg.cn/mw690/c5dffb26gy1g9jyl7uae7j21400p077o.jpg)
![应用截图2](https://wx4.sinaimg.cn/mw690/c5dffb26gy1g9jyl7s8ktj21400p0tc3.jpg)
![应用截图3](https://wx4.sinaimg.cn/mw690/c5dffb26gy1g9jyl7vjugj21400p077x.jpg)
![应用截图4](https://wx1.sinaimg.cn/mw690/c5dffb26gy1g9jyl7shkfj21400p0n1g.jpg)
![应用截图5](https://wx4.sinaimg.cn/mw690/c5dffb26gy1g9jyl7sek3j21400p042a.jpg)

## 💻 使用方法

1. 打开应用后，将图片拖入应用窗口或点击选择图片
2. 在设置中选择需要生成的平台（Android、iOS、MacOS、Windows 等）
3. 点击"保存图片"按钮，选择输出位置
4. 应用将自动生成所选平台所需的各种尺寸图标

## ⬇️ 下载安装

### 预编译版本

| 平台 | 下载地址 |
|------|---------|
| macOS | [GitHub 下载](https://github.com/LuoYaoSheng/iconsize/releases) |
| Windows | [GitHub 下载](https://github.com/LuoYaoSheng/iconsize/releases) |
| Linux | [GitHub 下载](https://github.com/LuoYaoSheng/iconsize/releases) |

国内用户也可以从码云下载：<https://gitee.com/luoyaosheng/iconsize/releases>

### 从源码安装

1. 克隆项目仓库   
```bash
# 从 GitHub 克隆
$ git clone https://github.com/LuoYaoSheng/iconsize.git  

# 或从码云克隆
$ git clone https://gitee.com/luoyaosheng/iconsize.git
```

2. 进入项目目录
```bash
$ cd iconsize
```

3. 安装依赖并运行
```bash
$ npm install && npm start
```

## 🔧 进阶技巧

### 如何将图片转成 icns 格式

macOS 用户可以按照以下步骤将生成的图片转换为 icns 格式：

1. 安装 icoutils
```bash
$ brew install icoutils
```

2. 进入生成文件夹
```bash
$ cd objectDir
```

3. 文件夹重命名
```bash
$ mv MacOS MacOS.iconset
```

4. 通过 iconutil 生成
```bash
$ iconutil -c icns MacOS.iconset -o mac.icns
```

### 如何打包应用

如需自行打包应用，请按照以下步骤操作：

1. 安装 electron-builder
```bash
$ npm install electron-builder --save-dev
```

2. 执行打包命令
```bash
$ npm run dist
```

## 🐞 问题反馈

如发现 Bug 或有功能建议，欢迎在 GitHub 提交 issue：
<https://github.com/LuoYaoSheng/iconsize/issues>

## 📚 相关学习资源

想学习如何开发类似应用？推荐参考 《[实战：Electron开发仿 图标生成 工具类桌面应用](https://gitbook.cn/gitchat/activity/5de687898a4a7d7033bb51d0)》

## 👨‍💻 关于作者

- 微博：<https://weibo.com/u/3319790374>
- Email：[1034639560@qq.com](mailto:1034639560@qq.com)
- GitHub：<https://github.com/LuoYaoSheng>
- 码云：<https://gitee.com/luoyaosheng>
- 交流QQ群：445455356

## ❤️ 支持项目

如果这个项目对你有帮助，请考虑以下方式支持：

- 在 [GitHub](https://github.com/LuoYaoSheng/iconsize) 上给项目点亮小星星 ⭐
- 向朋友推荐这个项目
- 提交代码或功能改进
- 如果方便，可以进行打赏支持：

![微信打赏](https://wx2.sinaimg.cn/mw690/c5dffb26gy1g9jzufe6y9j20960b5dh1.jpg)
![支付宝打赏](https://wx2.sinaimg.cn/mw690/c5dffb26gy1g9jzumziehj20960b575y.jpg)

## 📄 许可证

本项目采用 Apache-2.0 许可证