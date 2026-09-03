# IconGen Design System — 内联 SVG 图标资产（P5）

> 原则：单文件原型零外链 → 全部图标内联 SVG；旧项目已有 SVG 的逐字沿用（注明出处），旧版缺失的（平台图标等）以「V1 新绘」标注。图标统一 24×24 viewBox、`fill: currentColor`，尺寸由使用处控制。

---

## 1. 旧项目原有内联 SVG（逐字提取）

### 1.1 云上传图标（DropZone 空态）
- 来源：`web/public/tool/index.html:32-34`（唯一真实内联 SVG 图标）。
- 尺寸用法：width=64 height=64，fill 用 `--color-primary`（style.css:196-198）。

```html
<svg width="64" height="64" viewBox="0 0 24 24">
  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
</svg>
```

### 1.2 结果占位图标（结果区空态，整卡隐藏时不可见）
- 来源：`web/public/tool/index.html:129-131`；fill `--color-border`（style.css:398-400）。

```html
<svg width="64" height="64" viewBox="0 0 24 24">
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
</svg>
```

> 说明：PAGE003 落地页图标在旧版走 Font Awesome 6.4.0 CDN（landing index.html:18），非内联资产——V1 去外链后以 §2 的自绘等价图标替代，落地页原 FA class（fa-apple/fa-android/fa-windows/fa-linux）在 V1 原型中留注释标注。

## 2. V1 新绘内联 SVG（旧版无内联资产，V1 原型补齐；非旧版内容，仅作图形占位不承载新功能）

| 图标 | 用途 | viewBox | 备注 |
|---|---|---|---|
| 平台-iOS | PlatformCard / 结果 Tab（Apple 设备轮廓） | 0 0 24 24 | 简化圆角矩形+底部圆条隐喻 |
| 平台-Android | 同上（机器人头轮廓） | 0 0 24 24 | 半圆+双眼+双天线 |
| 平台-macOS | 同上（显示器轮廓） | 0 0 24 24 | 矩形+支架 |
| 平台-Windows | 同上（四格窗） | 0 0 24 24 | 四等分方块 |
| 平台-watchOS | 同上（手表轮廓） | 0 0 24 24 | 圆角方形表体+表带 |
| 下载 | 下载按钮/下载卡 | 0 0 24 24 | 竖箭头+托盘 |
| 关闭 | ZIP 树弹窗/菜单收起 | 0 0 24 24 | × |
| 展开/收起 | FAQ/模板表折叠箭头 | 0 0 24 24 | chevron |
| 警告/信息/成功/失败 | 通知条左侧状态图标 | 0 0 24 24 | 圆底叹号/i/勾/叉 |
| 品牌标 IG | PAGE001/PAGE002 品牌位 | 文本 | 旧版即文字标（index.html:304-306），V1 沿用文字标不新造 logo |

绘制规范：`fill="currentColor"`；stroke 图标统一 stroke-width 1.8、`stroke-linecap="round"`；不使用渐变；色彩一律继承文字色或显式 token 色。

## 3. 二进制图片资产清单（旧版存在、单文件原型以占位呈现）

| 资产 | 来源 | V1 原型处理 |
|---|---|---|
| favicon.ico | web/public/favicon.ico | 原型不含 |
| iconsize.jpg（品牌图） | landing-page/assets/img/iconsize.jpg | 占位块 + 标注「旧资产：iconsize.jpg」 |
| 演示 GIF | landing-page/assets/img/screenshots/iconsize.gif | 占位块 |
| 应用截图 1.jpg | landing-page/assets/img/screenshots/1.jpg | 占位块 |
| 桌面壳图标 icns/ico/png | desktop/src/assets/* | 不在浏览器范围 |

> V1 真实重开发（P7 之后）时，上表二进制资产按 MODULE_ARCH.md 的资产目录归位，不必内联。
