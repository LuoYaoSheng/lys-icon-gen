# IconGen Design System — 使用准则与公共参数（P5）

> 本文件是 DS 的「宪法」：使用原则、文案规范、公共参数（五平台尺寸模板全集 / ZIP 组包规则 / 枚举与默认值）。公共参数全部来自真实源码，是 V1 原型与 P7 架构的唯一事实源。

---

## 1. 使用原则

1. **Token 唯一来源**：所有颜色/字体/间距/圆角/阴影/动效必须引用 docs/07_design_system/TOKEN.md 的 V1 token（CSS 变量），禁止散落硬编码（旧版三套变量并存的教训，product-review PG-04）。
2. **组件优先复用**：先查 COMPONENT.md 组件记录表（20 项），再考虑新组件；新组件需先入表（含来源与状态）。
3. **模式优先复用**：上传/校验/空态/加载/错误/成功/权限/联动八类模式见 PATTERN.md，不得为同类场景发明第二套解法。
4. **零外链**：原型与 V1 重开发产物运行时零外链（JSZip 构建期内置，product-review FL-02）；字体走系统栈。
5. **五态齐全**：每个数据区域必须定义 Loading / Empty / Error / Success / Permission（或「不适用」的显式声明）。
6. **禁止私加商业功能**：DS 变更不得引入旧项目 32 项功能之外的任何商业特性（登录/付费/云存储等）。
7. **可溯源**：任何参数值变更需注明来源文件:行号；与旧版行为不一致处必须有 P4 分级编号（A/B/C/D）支撑。

## 2. 文案规范

- 全部沿用旧版中文文案（PRD §6）；错误文案逐字使用（见 §4.3 通知文案枚举），不得意译改写。
- 文案与行为一致原则：按钮/热区文案承诺的行为必须真实可用（PG-02 教训：拖放区「点击上传」必须整区可点）。
- 营销文案不得超出真实能力（FN-10 教训：FAQ 不再声称 favicon/PWA 支持）。
- 旧版原貌保留项标注「照旧还原」（如页脚 © 2023，D 类 PG-10）。

## 3. 可访问性与响应式基线

- 响应式断点（沿用 responsive.css）：≥1200 / 768-1199 / <767（通知通栏、按钮纵排）/ <480（平台两列）/ 横屏矮屏（<600px 高压缩）。落地页菜单断点 <768。
- 交互目标最小 44px 高（主页按钮 min-height:44px，web index.html:132）。
- 通知自动消失默认 3000ms；常驻任务型通知必须有终态清除（成功/失败后清除再发结果）。

---

## 4. 公共参数（唯一事实源）

### 4.1 五平台尺寸模板全集（57 项）

> 来源：`web/public/js/iconSizes.js:5-83`（SOP 所述 fileUtils.js 为组包方，模板真源是 iconSizes.js，已核实）。表列 = size(px) / 输出文件名 / 平台内目录 / 附加字段。

**iOS（15 项，iconSizes.js:7-23）** —— 目录 `AppIcon.appiconset`

| size | 文件名 | idiom | scale | 说明 |
|---|---|---|---|---|
| 20 | icon-20.png | iphone | 1x | 通知图标@1x |
| 40 | icon-20@2x.png | iphone | 2x | 通知图标@2x |
| 60 | icon-20@3x.png | iphone | 3x | 通知图标@3x |
| 29 | icon-29.png | iphone | 1x | 设置图标@1x |
| 58 | icon-29@2x.png | iphone | 2x | 设置图标@2x |
| 87 | icon-29@3x.png | iphone | 3x | 设置图标@3x |
| 40 | icon-40.png | iphone | 1x | Spotlight图标@1x |
| 80 | icon-40@2x.png | iphone | 2x | Spotlight图标@2x |
| 120 | icon-40@3x.png | iphone | 3x | Spotlight图标@3x |
| 76 | icon-76.png | ipad | 1x | iPad应用图标@1x |
| 152 | icon-76@2x.png | ipad | 2x | iPad应用图标@2x |
| 167 | icon-83.5@2x.png | ipad | 2x | iPad Pro应用图标@2x |
| 120 | icon-60@2x.png | iphone | 2x | iPhone应用图标@2x |
| 180 | icon-60@3x.png | iphone | 3x | iPhone应用图标@3x |
| 1024 | icon-1024.png | ios-marketing | 1x | App Store图标 |

**Android（11 项，iconSizes.js:26-39）** —— launcher 6 密度 + adaptive 前景 5 密度

| size | 文件名 | 目录 | type | 说明 |
|---|---|---|---|---|
| 36 | ic_launcher.png | mipmap-ldpi | launcher | ldpi |
| 48 | ic_launcher.png | mipmap-mdpi | launcher | mdpi |
| 72 | ic_launcher.png | mipmap-hdpi | launcher | hdpi |
| 96 | ic_launcher.png | mipmap-xhdpi | launcher | xhdpi |
| 144 | ic_launcher.png | mipmap-xxhdpi | launcher | xxhdpi |
| 192 | ic_launcher.png | mipmap-xxxhdpi | launcher | xxxhdpi |
| 108 | ic_launcher_foreground.png | mipmap-mdpi | adaptive | 自适应图标 mdpi |
| 162 | ic_launcher_foreground.png | mipmap-hdpi | adaptive | 自适应图标 hdpi |
| 216 | ic_launcher_foreground.png | mipmap-xhdpi | adaptive | 自适应图标 xhdpi |
| 324 | ic_launcher_foreground.png | mipmap-xxhdpi | adaptive | 自适应图标 xxhdpi |
| 432 | ic_launcher_foreground.png | mipmap-xxxhdpi | adaptive | 自适应图标 xxxhdpi |

**macOS（10 项，iconSizes.js:42-53）** —— 目录 `AppIcon.appiconset`

| size | 文件名 | scale | 说明 |
|---|---|---|---|
| 16 | icon_16x16.png | 1x | 16x16@1x |
| 32 | icon_16x16@2x.png | 2x | 16x16@2x |
| 32 | icon_32x32.png | 1x | 32x32@1x |
| 64 | icon_32x32@2x.png | 2x | 32x32@2x |
| 128 | icon_128x128.png | 1x | 128x128@1x |
| 256 | icon_128x128@2x.png | 2x | 128x128@2x |
| 256 | icon_256x256.png | 1x | 256x256@1x |
| 512 | icon_256x256@2x.png | 2x | 256x256@2x |
| 512 | icon_512x512.png | 1x | 512x512@1x |
| 1024 | icon_512x512@2x.png | 2x | 512x512@2x |

**Windows（10 项，iconSizes.js:56-67）** —— 目录 `Assets`，scale 均 '100'

| size | 文件名 | 说明 |
|---|---|---|
| 16 | Square16Logo.png | Square16x16Logo |
| 24 | Square24Logo.png | Square24x24Logo |
| 32 | Square32Logo.png | Square32x32Logo |
| 44 | Square44Logo.png | Square44x44Logo |
| 48 | Square48Logo.png | Square48x48Logo |
| 64 | Square64Logo.png | Square64x64Logo |
| 96 | Square96Logo.png | Square96x96Logo |
| 128 | Square128Logo.png | Square128x128Logo |
| 256 | Square256Logo.png | Square256x256Logo |
| 200 | StoreLogo.png | 应用商店图标 |

**watchOS（11 项，iconSizes.js:70-82）** —— 目录 `AppIcon.appiconset`

| size | 文件名 | idiom | role | subtype | scale | 说明 |
|---|---|---|---|---|---|---|
| 48 | icon-24@2x.png | watch | notificationCenter | 38mm | 2x | 通知中心38mm |
| 55 | icon-27-5@2x.png | watch | notificationCenter | 42mm | 2x | 通知中心42mm |
| 58 | icon-29@2x.png | watch | companionSettings | — | 2x | 设置 |
| 87 | icon-29@3x.png | watch | companionSettings | — | 3x | 设置 |
| 80 | icon-40@2x.png | watch | appLauncher | 38mm | 2x | 主屏幕38mm |
| 88 | icon-44@2x.png | watch | longLook | 42mm | 2x | 长按42mm |
| 100 | icon-50@2x.png | watch | appLauncher | 44mm | 2x | 主屏幕44mm |
| 172 | icon-86@2x.png | watch | quickLook | 38mm | 2x | 短视图38mm |
| 196 | icon-98@2x.png | watch | quickLook | 42mm | 2x | 短视图42mm |
| 216 | icon-108@2x.png | watch | quickLook | 44mm | 2x | 短视图44mm |
| 1024 | icon-1024.png | watch-marketing | — | — | 1x | App Store |

> 注：iOS 与 watchOS 共用文件名 icon-1024.png / icon-29@3x.png 等，但分属不同平台目录，ZIP 内不冲突（见 4.2）。

### 4.2 ZIP 组包规则（来源 `web/public/js/fileUtils.js:111-324`）

**子文件夹模式（createSubFolders=true，默认）** —— 每平台一个根目录，目录名 = 平台键名（PLATFORM_FOLDERS，iconSizes.js:95-101）：

| 平台 | ZIP 内路径 | 附加资源文件 |
|---|---|---|
| iOS | `iOS/Assets.xcassets/AppIcon.appiconset/icon-*.png` | `Contents.json`（15 条 images + info{version:1,author:"Icon Generator"}，fileUtils.js:23-56） |
| Android | `Android/res/mipmap-{ldpi…xxxhdpi}/ic_launcher.png`、`…/ic_launcher_foreground.png` | `Android/res/values/ic_launcher_background.xml`（#FFFFFF）+ 每密度 `mipmap-*/ic_launcher.xml`（fileUtils.js:63-88） |
| macOS | `macOS/Assets.xcassets/AppIcon.appiconset/icon_*.png` | `Contents.json`（同 iOS 结构） |
| Windows | `Windows/Assets/Square*Logo.png`、`StoreLogo.png` | 无（needsManifest=false 空实现，fileUtils.js:95-100） |
| watchOS | `watchOS/Assets.xcassets/AppIcon.appiconset/icon-*.png` | `Contents.json`（含 role/subtype） |

**扁平模式（createSubFolders=false）**：全部 PNG 平铺于 ZIP 根（basePath=''）；同名文件仅存在于「iOS 与 watchOS 共用名」场景（如 icon-1024.png），旧版行为即互相覆盖——V1 照旧并已知风险标注（观察项）。

**前缀规则（prefixFilename=true 且仅扁平模式生效，fileUtils.js:135-137）**：文件名前加小写平台前缀 `{platform.toLowerCase()}-`，如 `ios-icon-20.png`、`android-ic_launcher.png`；子文件夹模式下该选项无效（V1 加行内说明，B/PG-06）。

**资源文件生成条件**：Contents.json 仅当 createContentsJson=true 且平台 ∈ {iOS, macOS, watchOS}；自适应 XML 仅当 createAdaptiveIcons=true 且平台=Android；两者均只在子文件夹模式下生成（fileUtils.js:312-320）。

**下载名**：`app-icons.zip`（main.js:385）。

**文件数对账表**（选项全开、子文件夹模式，v0 原型实测一致）：

| 平台组合 | PNG | 资源文件 | 合计 |
|---|---|---|---|
| iOS+Android（默认） | 26 | 8（1 json + 7 xml） | 34 |
| 五平台全选 | 57 | 10（3 json + 7 xml） | 67 |
| iOS 单独 | 15 | 1 | 16 |
| Android 单独 | 11 | 7 | 18 |
| macOS 单独 | 10 | 1 | 11 |
| Windows 单独 | 10 | 0 | 10 |
| watchOS 单独 | 11 | 1 | 12 |

### 4.3 枚举与默认值

**平台枚举**：`['iOS','Android','macOS','Windows','watchOS']`（iconSizes.js 五键）；默认选中 `['iOS','Android']`（main.js:11）。

**输出选项 Config（main.js:35-40）**：

| 键 | 默认 | 作用 |
|---|---|---|
| createSubFolders | true | 平台子文件夹目录结构 |
| prefixFilename | false | 文件名平台前缀（仅扁平模式生效） |
| createContentsJson | true | Apple 系 Contents.json |
| createAdaptiveIcons | true | Android 自适应图标 XML |

**校验阈值**：accept=`image/*`；大小 ≤ 5×1024×1024 字节（main.js:192-202）；非正方形仅警告不阻断（5000ms）。

**通知枚举**：type ∈ {info, success, error, warning}；duration 默认 3000ms，0=常驻（main.js:445-469）。文案全集：
- error×7：「请选择有效的图像文件」「文件大小不能超过5MB」「处理图像时出错: {msg}」「生成图标时出错: {msg}」「创建ZIP文件时出错: {msg}」「请选择图像并至少选择一个平台」「没有可供下载的图标」
- warning：「警告：图像不是正方形，可能会导致图标变形」（5s）
- info：「正在生成图标，请稍候...」（常驻）「正在准备下载...」（常驻）「应用已重置」
- success：「图像已成功加载」「图标已成功生成，可以下载」「下载已开始」

**格式化规则**：文件大小 B/KB/MB 两位小数（main.js:476-484）；文件信息格式「文件名: {name} | 大小: {size} | 尺寸: {W}×{H}px」；输出格式五平台均 PNG（PLATFORM_FORMATS，iconSizes.js:86-92）。

**V1 架构需知**：Contents.json 的 images[].size 字段按 `size/scale` 取整计算（fileUtils.js:30）；Android 自适应 XML foreground 引用为 `@{mipmapDir}/ic_launcher_foreground`（fileUtils.js:83，与 desktop 版 `@mipmap/...` 不一致，C 类 FN-C6 默认沿用 web 现状）。
