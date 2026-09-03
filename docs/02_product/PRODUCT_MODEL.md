# IconGen 产品模型（PRODUCT_MODEL）

> 产品定位 / 用户角色 / 使用场景 / 核心价值四要素。内容汇总自 `docs/01_reverse/REVERSE_ANALYSIS.md`（①概述、⑤功能）与 `docs/02_product/PRD.md`（§1-§3），来源逐条标注。编写日期：2026-09-03。

---

## 1. 产品定位

- **一句话定位**：多平台图标生成工具——用户上传一张高质量图标源图，浏览器本地（不上传服务器）即可生成 iOS、Android、macOS、Windows、watchOS 五平台全部所需尺寸图标，并按平台规范输出目录结构与资源文件（Contents.json、Android 自适应图标 XML），一键 ZIP 下载（来源：PRD §1；根 `README.md` 第 10、21、26-32 行）。
- **产品形态**（来源：PRD §1）：
  1. 浏览器在线工具（主产品，PAGE002 `web/public/tool/index.html`）
  2. 项目主页（导流，PAGE001 `web/public/index.html`）
  3. 落地页（营销，PAGE003 `landing-page/index.html`，独立部署域名【未知】）
  4. Electron 桌面壳（本地文件系统导出，`desktop/`，品牌 iconsize）
- **核心原则**：客户端处理、零上传、零登录、零收费（Apache-2.0 开源）（来源：PRD §1）。
- **商业模型**：无付费、无账号、无埋点遥测（来源：`docs/product-review/DATA_STORAGE_REVIEW.md` 表 #10「埋点/遥测：无」）。

## 2. 用户角色

| 画像 | 特征 | 核心诉求 | 来源 |
|---|---|---|---|
| App 开发者（主力） | 使用 Xcode/Android Studio | 一次上传得到可直接拖入工程的 AppIcon.appiconset 与 mipmap 全密度资源 | REVERSE_ANALYSIS ①用户类型 1（`web/public/js/iconSizes.js` 全部模板佐证）；PRD §2 |
| 桌面应用开发者 | 打包 Windows/macOS 应用 | Square*Logo 系列、icon_16~512@2x 系列 | REVERSE_ANALYSIS ①用户类型 2；PRD §2（F017/F018） |
| UI 设计师 / 独立开发者 | 交付多端图标资产 | 快速、免费、结构化输出 | REVERSE_ANALYSIS ①用户类型 3（`landing-page/index.html:303-321` testimonials 佐证）；PRD §2 |

无登录/角色/配额体系（来源：`docs/product-review/PERMISSION_REVIEW.md` §一 D「工具类产品无需应用内权限体系」）。

## 3. 使用场景

| # | 场景 | 描述 | 主战场 | 来源 |
|---|---|---|---|---|
| 1 | 上架前补齐图标（主场景） | 开发者只有一张 1024×1024 设计稿，5 分钟内拿到全部平台图标包 | PAGE002 | PRD §3 场景 1 |
| 2 | 临时替换图标 | 改版后快速重新生成全套（重置→换图→生成→下载） | PAGE002 | PRD §3 场景 2 |
| 3 | 了解工具与获取桌面版 | 从项目主页/落地页进入下载或在线工具 | PAGE001 / PAGE003 | PRD §3 场景 3 |
| 4 | 隐私敏感场景 | 图片不出本机（web 端浏览器内处理；桌面端完全离线） | PAGE002 / desktop | PRD §3 场景 4；根 `README.md` 第 21 行 |
| 5 | desktop 本地导出 | 选择输出目录导出到本地文件系统、打开输出文件夹、配置跨会话记忆 | desktop 渲染窗口 | REVERSE_ANALYSIS ②双端关系；F032 |

## 4. 核心价值

| 价值点 | 内涵 | 依据 |
|---|---|---|
| 隐私 | 图片全程不出本机：web 端浏览器内处理零上传；desktop 端完全离线 | 根 `README.md` 第 21 行；`web/README.md` 第 10 行；`docs/product-review/DATA_STORAGE_REVIEW.md` §二 |
| 规范 | 输出符合平台规范的目录结构与资源文件：iOS/macOS/watchOS 的 Assets.xcassets/AppIcon.appiconset + Contents.json；Android 的 res/mipmap-*/values + 自适应图标 XML；Windows 的 Assets 目录 | 根 `README.md` 第 80-92 行；`web/public/js/iconSizes.js:104-130`；`fileUtils.js:23-88` |
| 一次到位 | 五平台 57 项尺寸模板（iOS 15 / Android 11 / macOS 10 / Windows 10 / watchOS 11），一次生成全尺寸 | `iconSizes.js:5-83`；REVERSE_ANALYSIS ⑦实体 1 |
| 免安装 / 免费 | web 端免安装直接用；Apache-2.0 开源零收费 | 根 `README.md` 第 25、94-96 行；PRD §1 |
| 快速 | 最短路径 3 次有效交互（上传 1 + 生成 1 击 + 下载 1 击，默认配置零调整） | `docs/product-review/USER_FLOW_REVIEW.md` §一流程 1；`tool/index.html:66-87` 默认勾选 |

**已知价值缺口**（引自评审，如实登记）：
- 规范输出承诺与 web 实现不符：Android 自适应 XML 前景引用 `@${mipmapDir}/ic_launcher_foreground` 非标准写法（PL-02，B 类待修复）（来源：`web/public/js/fileUtils.js:83`；`docs/product-review/PRODUCT_LOGIC_REVIEW.md` §一）。
- FAQ 文档超承诺：落地页声称支持 favicon/PWA 图标，代码无对应能力（FN-10）（来源：`landing-page/index.html:344`；PRODUCT_REVIEW FN-10）。

## 5. 相关文档

- 产品需求基线：`docs/02_product/PRD.md`；页面规格：`docs/02_product/PAGE_SPEC.md`；能力树：`docs/02_product/FEATURE_MAP.md`
- 用户旅程：`docs/03_flow/USER_FLOW.md`；业务流程（正常/异常/边界）：`docs/03_flow/BUSINESS_FLOW.md`
