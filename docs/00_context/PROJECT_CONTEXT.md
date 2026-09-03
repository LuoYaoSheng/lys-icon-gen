# IconGen 项目上下文（PROJECT_CONTEXT）

> 编号体系：00_context/01_reverse/02_product/03_flow/04_architecture/05_sequence/06_review/07_design_system/08_development/09_test + prototype/{v0-old,v1-new}。
> 本文件内容全部来自仓库现有文档与源码，来源逐条标注；未证实内容标【未知】。编写日期：2026-09-03。

---

## 1. 项目定位

- **一句话定位**：多平台图标生成工具，快速生成 iOS、Android、macOS、Windows 平台所需各种尺寸图标（来源：根 `README.md` 第 10 行）。
- lys Open Source 体系中的项目资产生成工具（来源：根 `README.md` 第 3 行；`web/public/index.html` 第 323 行）。
- 品牌名：在线品牌「Icon Gen」（PAGE001），桌面与落地页历史品牌「iconsize」（`desktop/package.json` name 字段为 `iconsize` 3.0.0；`landing-page/index.html` title「iconsize | 多平台图标生成工具」）——三重命名并存，见 `docs/06_review/PRODUCT_REVIEW.md` PG-04/PG-08（来源：`docs/01_reverse/REVERSE_ANALYSIS.md` ①）。
- 线上入口：
  - 项目站 `https://icon.open.i2kai.com`（来源：`web/public/CNAME`）
  - 在线工具 `https://icon.open.i2kai.com/tool/`（来源：根 `README.md` 第 6 行）
  - 源码仓库 GitHub `LuoYaoSheng/lys-icon-gen` / Gitee `luoyaosheng/lys-icon-gen`（来源：根 `README.md` 第 7-8 行）
- 核心价值：上传 1 张图（建议 1024×1024 PNG）→ 一键生成 5 平台（iOS/Android/macOS/Windows/watchOS）全尺寸图标 + 符合平台规范的目录结构与资源文件（Contents.json / Android 自适应图标 XML），ZIP 一键下载（来源：根 `README.md` 第 26-32 行）。
- 核心原则：客户端处理、零上传、零登录、零收费（Apache-2.0 开源）（来源：`docs/02_product/PRD.md` §1）。

## 2. 仓库布局（web 与 desktop 双端 + 附属）

```
IconGen/
├── README.md                    # 总说明（两版本结构、尺寸清单、文件结构说明）
├── .github/workflows/pages.yml  # GitHub Pages 自动部署 web/public
├── doc/                         # 仅含图标素材 iconsize.jpg/.ico（项目自有，不动）
├── web/                         # ★ 主产品：在线工具（纯前端）
│   ├── server.js                # Express 静态服务器（本地开发，PORT 3000）
│   ├── package.json             # express / jszip / nodemon
│   ├── build.sh                 # 生成 dist + nginx.conf.example + iconsize-web.zip
│   ├── iconsize-web.zip         # 构建产物（已提交进仓库，P4 D 类代码卫生项）
│   └── public/                  # 部署目录（GitHub Pages 源）
│       ├── CNAME                # icon.open.i2kai.com
│       ├── index.html           # PAGE001 项目主页（内联 CSS 单文件）
│       ├── favicon.ico
│       ├── css/{style.css, responsive.css, styles.css}   # styles.css 未被引用（遗留）
│       ├── js/{iconSizes.js, imageProcessor.js, fileUtils.js, main.js}
│       ├── images/.gitkeep      # 空目录占位
│       └── tool/index.html      # PAGE002 在线工具主页面 ★核心
├── desktop/                     # 桌面壳（Electron，品牌 iconsize）
│   ├── src/main/{main.js, preload.js, iconGenerator.js}
│   ├── src/renderer/{index.html, renderer.js, styles.css}
│   ├── src/assets/（icns/ico/png/dmg 脚本/linux desktop）
│   ├── electron-builder.yml、Dockerfile*、docker-build*.sh
│   └── README.md / README-docker.md / README-offline.md
├── landing-page/                # 旧品牌 iconsize 产品落地页（静态营销站，部署域名【未知】）
├── prototype/                   # 本 SOP 原型产物
│   ├── v0-old/app-prototype.html   # v0 旧版原型（P6 归位）
│   └── v1-new/app-prototype.html   # V1 新版原型
└── docs/                        # 编号文档体系（见 docs/DOCUMENT_INDEX.md）
```

来源：`docs/01_reverse/REVERSE_ANALYSIS.md` ② 项目结构分析（逐文件核对得出）。

### 双端关系

- `web/` 是当前主产品与唯一线上部署物（CI 只部署 `web/public`）：`web/public/index.html` 承担项目站（PAGE001），`web/public/tool/index.html` 承担工具本身（PAGE002）（来源：REVERSE_ANALYSIS ②）。
- `desktop/` 是功能对等的 Electron 壳：主进程 `iconGenerator.js` 用 `nativeImage` 实现与 web Canvas 等价的生成/导出，并增加「输出目录选择、导出到文件夹、打开输出文件夹、配置持久化（electron-store）」等桌面专属能力（来源：`desktop/src/main/main.js` IPC handlers；`desktop/src/renderer/renderer.js`；REVERSE_ANALYSIS ②）。
- 双端已知漂移：尺寸模板差异（desktop Windows 无 24×24；watchOS 集合不同）、Contents.json 选项 bug、品牌不一致、Android 自适应 XML 引用写法不一致（来源：REVERSE_ANALYSIS ⑨；`docs/product-review/PRODUCT_LOGIC_REVIEW.md` §九）。桌面壳去留为 C-4 待用户决策项（来源：`docs/06_review/PRODUCT_REVIEW.md` §5.2）。
- `landing-page/` 是独立营销站，与 `web/` 无构建依赖，去留为 C-5 待决策（来源：REVERSE_ANALYSIS ②；PRODUCT_REVIEW C-5）。

## 3. 构建与运行方式

### web 版（本地开发）

```bash
cd web
npm install
npm start        # node server.js → http://localhost:3000
# 亦可用 npm run dev（nodemon server.js）
```

来源：根 `README.md` 第 36-42 行；`web/package.json` scripts（start=node server.js、dev=nodemon server.js）。`web/server.js` 仅静态文件服务（express.static + 根路由 sendFile），无任何业务接口（来源：`web/server.js` 全文 19 行）。

- 线上部署：push 到 master → GitHub Actions 将 `./web/public` 发布到 GitHub Pages（来源：`.github/workflows/pages.yml`；REVERSE_ANALYSIS ①「部署链路」）。
- 另有 `web/build.sh`：生成 dist + nginx.conf.example + iconsize-web.zip（来源：REVERSE_ANALYSIS ②）。

### desktop 版（Electron）

```bash
cd desktop
npm install
npm start        # electron .
# 打包：npm run build（electron-builder）/ build:mac / build:win / build:linux / pack:mac 等
```

来源：根 `README.md` 第 60-64 行；`desktop/package.json` scripts 区（start=electron .、build=electron-builder 及 mac/win/linux/deb/appimage/dist:mac/make:dmg 等完整脚本）。Docker 交叉构建见 `desktop/Dockerfile*` 与 `desktop/README-docker.md`（来源：`desktop/package.json`；REVERSE_ANALYSIS ⑧）。

## 4. 关键入口

| 端 | 入口 | 文件 | 说明 |
|---|---|---|---|
| web 项目站 | `/` | `web/public/index.html` | PAGE001，纯静态导流页，无脚本（来源：REVERSE_ANALYSIS ④ PAGE001） |
| web 工具 | `/tool/` | `web/public/tool/index.html` + `js/main.js` | PAGE002 核心主流程（上传→配置→生成→下载），JS 模块：iconSizes.js（模板）/ imageProcessor.js（Canvas 生成）/ fileUtils.js（组包）/ main.js（编排）（来源：REVERSE_ANALYSIS ②④） |
| desktop 主进程 | `desktop/package.json` main | `desktop/src/main/main.js` | 窗口/菜单/IPC 编排；生成核心在 `desktop/src/main/iconGenerator.js`（nativeImage）（来源：`desktop/package.json` 第 5 行；REVERSE_ANALYSIS ②） |
| desktop 渲染层 | — | `desktop/src/renderer/index.html` + `renderer.js` | 单窗口 UI，逻辑同 PAGE002 主流程 + 本地导出（来源：REVERSE_ANALYSIS ③附注） |
| landing-page | — | `landing-page/index.html` | PAGE003 营销页（独立部署，域名【未知】）（来源：REVERSE_ANALYSIS ③ PAGE003） |
| 原型 | — | `prototype/v0-old/app-prototype.html`、`prototype/v1-new/app-prototype.html` | 本 SOP P6 产物（v0 旧版复刻 / V1 新版） |

## 5. 相关文档

- 项目全量文档索引：`docs/DOCUMENT_INDEX.md`
- 逆向事实基线：`docs/01_reverse/REVERSE_ANALYSIS.md`
- 产品需求：`docs/02_product/PRD.md`；技术栈明细：`docs/00_context/TECH_STACK.md`；依赖清单：`docs/00_context/DEPENDENCY_LIST.md`；资产清单：`docs/00_context/ASSET_INVENTORY.md`
