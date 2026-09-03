# IconGen 资产清单（ASSET_INVENTORY）

> 二进制图片/图标资产与关键静态资源盘点，全部经仓库文件系统核实（find 逐项列出）；来源路径即文件真实路径。编写日期：2026-09-03。用途【未知】表示无法从代码/文档确认消费方。

---

## 1. web/ 资产

| 资产 | 路径 | 用途 | 备注 |
|---|---|---|---|
| favicon.ico | `web/public/favicon.ico`（280K） | 站点图标 | 来源：REVERSE_ANALYSIS ② |
| 空目录占位 | `web/public/images/.gitkeep` | 占位 | 目录内无实际图片（来源：find 核实） |
| 构建产物 | `web/iconsize-web.zip` | `web/build.sh` 生成物 | 已提交入库，P4 D 类代码卫生项，建议不入库（来源：REVERSE_ANALYSIS ⑨；PRODUCT_REVIEW §5.1 D） |
| 内联 SVG | `web/public/tool/index.html:32-34`（云上传）、`:129-131`（结果占位） | 工具页两个图标 | 逐字提取见 `docs/07_design_system/ASSETS.md` §1 |

## 2. desktop/ 资产

| 资产 | 路径 | 用途 |
|---|---|---|
| 应用图标（macOS） | `desktop/src/assets/app.icns` | electron-builder mac.icon（desktop/package.json build.mac.icon） |
| 应用图标（Windows） | `desktop/src/assets/icon.ico` | electron-builder win.icon |
| 应用图标（Linux） | `desktop/src/assets/iconsize.png` | electron-builder linux.icon |
| 其余图标素材 | `desktop/src/assets/{icon.icns, icon.png, iconsize.jpg}` | 打包备用素材（具体消费方【未知】） |
| iconset 全套 | `desktop/icons.iconset/`（icon_16x16～512x512@2x 共 10 项） | icns 源素材（iconset 为 macOS 图标集标准目录结构） |
| tmp iconset | `desktop/tmp.iconset/`（16x16～1024x1024 共 12 项） | 临时图标集（命名表明临时性，消费方【未知】） |
| DMG 制作 | `desktop/src/assets/dmg/{create-dmg.sh, background.png, VolumeIcon.icns, create-background.html}` 与 `desktop/src/assets/create-dmg.sh` | DMG 安装包背景/卷图标/脚本（对应 npm script make:dmg） |
| Linux 桌面集成 | `desktop/src/assets/linux/{iconsize.desktop, after-install.sh}` | Linux 打包 desktop 文件与安装后脚本（.deb） |

来源：`desktop/package.json`（build 配置 + scripts）；目录 find 清单；`desktop/src/assets/` 目录结构。

## 3. landing-page/ 资产

| 资产 | 路径 | 用途 | 备注 |
|---|---|---|---|
| favicon | `landing-page/assets/img/favicon.ico`（280K） | 落地页站点图标 | |
| 品牌图 | `landing-page/assets/img/iconsize.jpg`（572K） | 头部 logo 图 | 与 `doc/iconsize.jpg`、`desktop/src/assets/iconsize.jpg` 同名三处分布 |
| 演示 GIF | `landing-page/assets/img/screenshots/iconsize.gif` | 英雄区演示动图 | |
| 应用截图 | `landing-page/assets/img/screenshots/1.jpg` | 下载区截图 | screenshots 目录合计约 2.0M |
| 样式/脚本 | `landing-page/assets/css/{styles.css, animations.css}`、`landing-page/assets/js/main.js` | 落地页样式与动效 | 另有根目录遗留 `landing-page/styles.css`（629 行，未被引用，P4 D 类）（来源：REVERSE_ANALYSIS ②⑨） |

V1 原型对上述二进制资产的处理（占位块策略）见 `docs/07_design_system/ASSETS.md` §3。

## 4. doc/ 目录（项目自有）

| 资产 | 路径 | 用途 |
|---|---|---|
| iconsize.jpg / iconsize.ico | `doc/iconsize.jpg`（572K）/ `doc/iconsize.ico`（4K） | 品牌素材存档（目录仅含这两个文件，消费方【未知】） |

来源：REVERSE_ANALYSIS ②「doc/ 仅含图标素材 iconsize.jpg/.ico」。

## 5. 原型资产

| 资产 | 路径 | 说明 |
|---|---|---|
| v0 旧版原型 | `prototype/v0-old/app-prototype.html`（约 86K） | 单文件、零外部资源（P6 归位物） |
| V1 新版原型 | `prototype/v1-new/app-prototype.html`（约 111K） | 单文件、零外部资源；V1 原型 CSS 变量全部出自 `docs/07_design_system/TOKEN.md` |

来源：prototype 目录 ls 核实；`docs/07_design_system/TOKEN.md` 首行注记。

## 6. 外部 CDN 资产（运行时引用，不在仓库内）

| 资源 | 引用位置 | 说明 |
|---|---|---|
| JSZip 3.10.1（cdnjs） | `web/public/tool/index.html:13` | 唯一业务外部脚本，无 SRI（P4 FL-02 / PM-05 已列） |
| Google Fonts（Montserrat/Roboto/Source Code Pro） | `landing-page/index.html:13-15` | 落地页字体 |
| Font Awesome 6.4.0（cdnjs） | `landing-page/index.html:18` | 落地页图标 |

来源：`docs/01_reverse/REVERSE_ANALYSIS.md` ⑧ 外部依赖表。

## 7. 资产卫生备注（引自既有评审，不在本清单内处置）

- 未引用遗留文件：`web/public/css/styles.css`、`landing-page/styles.css`（P4 D 类代码卫生，V1 重构时自然消除）（来源：PRODUCT_REVIEW §5.1 D）。
- V1 重开发时二进制资产归位策略见 `docs/04_architecture/MODULE_ARCH.md` §2（assets/ 目录）与 `docs/07_design_system/ASSETS.md` §3。
