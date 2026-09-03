# IconGen 技术栈清单（TECH_STACK）

> 依据两份 package.json（`web/package.json`、`desktop/package.json`）与逆向报告核实编写；无构建配置的静态部分按源码实际情况列出。编写日期：2026-09-03。未证实内容标【未知】。

---

## 1. 总览

| 部分 | 技术栈 | 来源 |
|---|---|---|
| web 在线工具（主产品） | 原生 HTML/CSS/JS + HTML5 Canvas 图像缩放 + JSZip 3.10.1（CDN 引入）打包下载；Express 4 仅作本地开发静态服务器 | `web/public/tool/index.html`、`web/public/js/*.js`、`web/server.js`、`web/package.json` |
| 项目主页（web） | 单文件静态页（内联 CSS），GitHub Pages 部署 | `web/public/index.html`、`.github/workflows/pages.yml` |
| desktop 桌面壳 | Electron 25 + electron-store 8 持久化配置 + nativeImage 系统级图像处理；electron-builder/packager 多平台打包；Docker 交叉构建 | `desktop/package.json`、`desktop/src/main/*.js`、`desktop/Dockerfile*` |
| landing-page | 静态 HTML + Google Fonts + Font Awesome 6.4.0（CDN）+ 原生 JS 动效 | `landing-page/index.html`、`landing-page/assets/**` |

来源：`docs/01_reverse/REVERSE_ANALYSIS.md` ① 技术架构表。

## 2. web/ 技术栈（`web/package.json` 核实）

| 项 | 值 | 来源 |
|---|---|---|
| 包名/版本 | `icon-generator-web` 1.0.0 | web/package.json 第 2-3 行 |
| 形态 | 纯前端静态站（无前端框架、无构建工具） | `web/public/` 目录（原生 HTML/CSS/JS）；REVERSE_ANALYSIS ① |
| 运行时依赖 | express ^4.18.2（仅本地静态服务器）、jszip ^3.10.1（声明但页面实际走 CDN script 标签） | web/package.json dependencies；`web/public/tool/index.html:13`（CDN 引入） |
| 开发依赖 | nodemon ^2.0.22 | web/package.json devDependencies |
| 图像处理 | HTML5 Canvas API（drawImage 逐尺寸缩放 → toBlob/toDataURL） | `web/public/js/imageProcessor.js:231-273` |
| 打包 | JSZip 3.10.1（cdnjs CDN）浏览器端组 ZIP | `web/public/tool/index.html:13`；`fileUtils.js:266-324` |
| 下载 | Blob URL + `a[download]` 触发浏览器下载 | `main.js:377-393` |
| 部署 | GitHub Pages + Actions（upload-pages-artifact@v3 / deploy-pages@v4），CNAME=icon.open.i2kai.com | `.github/workflows/pages.yml` |
| 许可 | Apache-2.0 | web/package.json 第 18 行 |

## 3. desktop/ 技术栈（`desktop/package.json` 核实）

| 项 | 值 | 来源 |
|---|---|---|
| 包名/版本 | `iconsize` 3.0.0 | desktop/package.json 第 2-3 行 |
| 应用入口 | `src/main/main.js`（Electron 主进程） | desktop/package.json 第 5 行 |
| 框架 | Electron ^25.2.0（devDependencies，electron . 启动） | desktop/package.json 第 34 行、scripts |
| 运行时依赖 | electron-store ^8.1.0（唯一 runtime dependency，配置持久化） | desktop/package.json 第 30-32 行 |
| 打包 | electron-builder ^24.6.3（dmg/zip/nsis/portable/AppImage/deb）+ electron-packager ^17.1.2 + create-dmg | desktop/package.json scripts + build 配置 |
| 图像处理 | Electron `nativeImage`（createFromPath/resize/toPNG，系统级，不经 Canvas） | `desktop/src/main/iconGenerator.js`；REVERSE_ANALYSIS ② |
| 安全配置现状 | nodeIntegration:true + contextIsolation:false + 无 CSP（preload 为死代码）——详见 `docs/08_development/PERMISSION.md` | `desktop/src/main/main.js:34-38`；`docs/product-review/PERMISSION_REVIEW.md` §一 C |
| 跨平台构建 | Docker 多 Dockerfile（linux/windows/mac + offline 版）+ docker-build*.sh，含国内镜像 .npmrc | `desktop/Dockerfile*`、`desktop/README-docker.md` |
| 许可 | Apache-2.0 | desktop/package.json 第 28 行 |

## 4. 三处静态部分（无 package.json，按源码核实）

| 部分 | 技术 | 来源 |
|---|---|---|
| `web/public/index.html`（PAGE001） | 内联 CSS 单文件静态页，无 `<script>` | REVERSE_ANALYSIS ④ PAGE001「无表单、无脚本」 |
| `landing-page/`（PAGE003） | 静态 HTML + Google Fonts（Montserrat/Roboto/Source Code Pro）+ Font Awesome 6.4.0（cdnjs CDN）+ 原生 JS（`assets/js/main.js`） | `landing-page/index.html:13-18`；REVERSE_ANALYSIS ⑧ |
| 原型 `prototype/{v0-old,v1-new}` | 单文件 HTML 原型、零外部资源（JSZip 用模拟层） | `docs/02_product/PAGE_SPEC.md` §5；`docs/09_test/V1_ACCEPTANCE.md` |

## 5. 语言与后端

- 语言：JavaScript（web 端原生 ES；desktop 端 CommonJS，Node/Electron 运行时）——无 TypeScript、无框架（来源：REVERSE_ANALYSIS ①；两份 package.json 无相关依赖）。
- 后端 API：无。`web/server.js` 仅为静态文件服务，无任何业务接口；线上为纯静态（来源：REVERSE_ANALYSIS ⑧「后端 API：无」）。
- V1 重开发选型建议（延续原生栈 + Vite 构建 + JSZip npm 内置等）见 `docs/04_architecture/SYSTEM_ARCH.md` §3。
