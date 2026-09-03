# IconGen 直接依赖清单（DEPENDENCY_LIST）

> 依据 `web/package.json` 与 `desktop/package.json`（dependencies/devDependencies 逐项核实）+ 逆向报告 ⑧ 整理。每项标注用途与实际使用状态；「死依赖」指已声明但运行路径未使用者。编写日期：2026-09-03。

---

## 1. web/package.json（`icon-generator-web` 1.0.0）

### dependencies（2 项）

| 依赖 | 版本 | 用途 | 实际使用状态 |
|---|---|---|---|
| express | ^4.18.2 | 本地开发静态服务器（`web/server.js`：express.static + 根路由） | **在用**（仅本地开发；线上 GitHub Pages 为纯静态，不需要）（来源：`web/server.js` 全文；REVERSE_ANALYSIS ⑧） |
| jszip | ^3.10.1 | ZIP 组包 | **死依赖（声明未用）**：工具页实际通过 CDN script 标签加载 JSZip（`web/public/tool/index.html:13`），页面未走 npm 打包流程，package.json 内声明未被消费（来源：REVERSE_ANALYSIS ⑧「线上依赖 CDN；package.json 亦声明 jszip 依赖但页面未走打包，仅 CDN」） |

### devDependencies（1 项）

| 依赖 | 版本 | 用途 | 实际使用状态 |
|---|---|---|---|
| nodemon | ^2.0.22 | dev 脚本热重启动（`npm run dev` → nodemon server.js） | 在用（仅开发脚本路径）（来源：`web/package.json` scripts） |

## 2. desktop/package.json（`iconsize` 3.0.0）

### dependencies（1 项）

| 依赖 | 版本 | 用途 | 实际使用状态 |
|---|---|---|---|
| electron-store | ^8.1.0 | 配置持久化（lastOutputPath/selectedPlatforms/四开关，明文 JSON 于 userData） | **在用**（`desktop/src/main/main.js:8` 初始化；get-config/save-config IPC 读写）（来源：REVERSE_ANALYSIS ⑦ 实体 3；`docs/product-review/DATA_STORAGE_REVIEW.md` 表 #8） |

### devDependencies（3 项）

| 依赖 | 版本 | 用途 | 实际使用状态 |
|---|---|---|---|
| electron | ^25.2.0 | 桌面运行时（`npm start` = `electron .`） | **在用**（Electron 25 已老，升级属 C-4 决策项）（来源：REVERSE_ANALYSIS ⑧；PRODUCT_REVIEW FN-12） |
| electron-builder | ^24.6.3 | 打包（build/build:mac/build:win/build:linux/build:deb/build:appimage/dist:mac 脚本；dmg/zip/nsis/portable/AppImage/deb target） | 在用（`desktop/package.json` scripts + build 配置） |
| electron-packager | ^17.1.2 | 打包（pack:mac/pack:linux 脚本） | 在用（与 electron-builder 并存两套打包链，历史并存【未知】是否有意保留） |

### build 内配置的镜像（非依赖，运行时下载源）

| 项 | 值 | 用途 |
|---|---|---|
| electron mirror/cache | `github.com/electron/electron/releases/download/` + `$HOME/.cache/electron` | Electron 二进制国内下载加速 |
| electron_builder mirror/cache | `github.com/electron-userland/electron-builder-binaries/releases/download/` + `$HOME/.cache/electron-builder` | builder 二进制下载加速 |

来源：`desktop/package.json` config 区（第 79-88 行）。

## 3. 运行时 CDN 依赖（未声明于 package.json）

| 依赖 | 版本 | 引用位置 | 状态 |
|---|---|---|---|
| JSZip | 3.10.1（cdnjs） | `web/public/tool/index.html:13` | 在用（无 SRI/integrity，供应链风险已列 PM-05；V1 改 npm 内置，ADR-2）（来源：`docs/product-review/PERMISSION_REVIEW.md` PM-05；`docs/04_architecture/SYSTEM_ARCH.md` ADR-2） |
| Google Fonts（Montserrat/Roboto/Source Code Pro） | — | `landing-page/index.html:13-15` | 在用（仅落地页） |
| Font Awesome | 6.4.0（cdnjs） | `landing-page/index.html:18` | 在用（仅落地页） |

## 4. 平台/工具链依赖（非 npm）

| 项 | 用途 | 来源 |
|---|---|---|
| GitHub Pages + Actions（upload-pages-artifact@v3 / deploy-pages@v4，OIDC `id-token: write`） | 站点部署（非产品密钥） | `.github/workflows/pages.yml`；`docs/product-review/PERMISSION_REVIEW.md` §一 D |
| Docker（多 Dockerfile + docker-build*.sh，含 .npmrc 国内镜像） | Windows/mac/Linux 离线交叉构建 | `desktop/Dockerfile*`、`desktop/README-docker.md`、`desktop/README-offline.md` |
| create-dmg（外部命令，make:dmg 脚本调用） | macOS DMG 制作 | `desktop/package.json` scripts；`desktop/src/assets/create-dmg.sh` |
| Gitee Releases（iconsize 3.0.0） | 落地页桌面安装包分发（外链） | `landing-page/index.html:252-280`；可用性【未知】 |

## 5. 死依赖/冗余汇总

| 项 | 类型 | 说明 |
|---|---|---|
| web jszip ^3.10.1 | 死依赖 | 声明未消费，实际走 CDN；V1 按 ADR-2 转为构建期内置 npm 依赖后「转正」（来源：SYSTEM_ARCH ADR-2） |
| desktop electron-packager 与 electron-builder 并存 | 冗余双链 | 两套打包脚本并存；是否收敛【未知】，属 C-4 桌面壳决策范围 |
| 后端 API 依赖 | 无 | 全部客户端/本地处理，无任何后端调用（来源：REVERSE_ANALYSIS ⑧） |

> V1 选型决策（JSZip 内置化、Vite、Vitest 等）见 `docs/04_architecture/SYSTEM_ARCH.md` §3；本清单仅记录现状。
