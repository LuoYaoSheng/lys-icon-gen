# IconGen 页面跳转关系（PAGE_FLOW）

> 页面对象：PAGE001 项目主页 / PAGE002 在线工具 / PAGE003 落地页 / desktop 渲染窗口（非浏览器页面）。内容改写自 `docs/product-review/INFORMATION_ARCHITECTURE_REVIEW.md` §一站点导航层级图与 `docs/02_product/PAGE_SPEC.md` 各页「跳转关系」行，来源行号见原文。编写日期：2026-09-03。

---

## 1. 站点与导航层级图（Mermaid）

```mermaid
flowchart TD
    subgraph SITE["icon.open.i2kai.com（GitHub Pages，CNAME）"]
        P1["PAGE001 项目主页 /<br/>web/public/index.html"]
        P2["PAGE002 在线工具 /tool/<br/>web/public/tool/index.html"]
        P1 -->|"导航「在线工具」/「打开在线工具」按钮（同窗）"| P2
        P1 -.->|"锚点 #features / #usage（页内）"| P1
        NF404["其他路径 → GitHub Pages 默认 404<br/>⚠ 无自定义 404 页 IA-01"]
        P2 -.->.|"⚠ 无任何站内回链 PG-03"| P1X["（仅浏览器后退可达 PAGE001）"]
    end
    subgraph LANDING["PAGE003 iconsize 落地页（独立静态站，域名【未知】）"]
        P3["landing-page/index.html"]
        P3 -.->|"页内锚点 ×5（平滑滚动 -80px）"| P3
    end
    subgraph DESKTOP["desktop 渲染窗口（Electron 本地应用）"]
        DK["desktop/src/renderer/index.html"]
    end
    P1 -->|"「Open」（外部，同窗跳出）"| EXT1["open.i2kai.com/projects#icon-gen"]
    P1 -->|"「GitHub」（外部，同窗跳出）⚠ 无外链标识 IA-02"| EXT2["github.com/LuoYaoSheng/lys-icon-gen"]
    P1 -->|"「Gitee」（外部，同窗跳出）"| EXT3["gitee.com/luoyaosheng/lys-icon-gen"]
    P3 -->|"网页版卡（新窗口）"| P2
    P3 -->|"下载卡 ×3（新窗口）⚠ 绑死 tag/3.0.0 IA-03"| EXT4["gitee.com/.../releases/tag/3.0.0"]
    P3 -.->|"页脚法律/社交 ×7 → '#' 死链 PG-07"| DEAD["死链"]
    DK -.->|"帮助菜单 GitHub 链接（占位死链 FL-08）⚠ 与站点无互链 IA-04"| DEAD2["github.com/yourusername/icon-generator（死链）"]
```

## 2. 逐页出入口表

### PAGE001 项目主页（`web/public/index.html`）

| 方向 | 目标 | 触发点 | 打开方式 | 来源 |
|---|---|---|---|---|
| 入 | — | 站点根路径 `/`（Express `res.sendFile(public/index.html)` / Pages 根路径） | 直访 | `web/server.js:11-13`；IA_REVIEW §一 |
| 出 | PAGE002 | 导航「在线工具」、英雄区「打开在线工具」 | 同窗跳转 | `web/public/index.html:302-315,332-350` |
| 出 | 本页锚点 | 导航「能力」(#features)、「使用」(#usage) | 页内定位 | 同上 |
| 出 | 外部 | Open 体系 / GitHub / Gitee | 同窗跳出（⚠ 无外链标识，IA-02） | 同上 |

### PAGE002 在线工具（`web/public/tool/index.html`）——单页完成核心流程，无页面级跳转

| 方向 | 目标 | 触发点 | 打开方式 | 来源 |
|---|---|---|---|---|
| 入 | 本页 | PAGE001 导航/按钮；直访 `/tool/` | 同窗 | PAGE_SPEC §2「跳转关系」 |
| 出 | （无） | — | — | grep 无站内回链（IA_REVIEW §一；PG-03 已列 B，V1 增品牌回链） |

### PAGE003 落地页（`landing-page/index.html`）

| 方向 | 目标 | 触发点 | 打开方式 | 来源 |
|---|---|---|---|---|
| 入 | 本页 | 独立域名直访（域名【未知】，仓库无部署配置指向） | 直访 | IA_REVIEW §一 |
| 出 | 本页锚点 ×5 | 导航/「立即下载」(#download)/「了解更多」(#how-it-works) | 平滑滚动（-80px 偏移） | `landing-page/assets/js/main.js:30-45` |
| 出 | PAGE002 | 下载区「网页版」卡 | 新窗口 | `landing-page/index.html:252-296` |
| 出 | Gitee releases tag/3.0.0 | macOS DMG / Windows 安装包 / Linux AppImage 三卡 | 新窗口（⚠ 版本固化 IA-03） | 同上 |
| 出 | 死链 `#` | 页脚法律 4 项 + Twitter/LinkedIn/微博 3 项 | 无跳转（PG-07 已列 B） | `landing-page/index.html:482-516` |

### desktop 渲染窗口（`desktop/src/renderer/index.html`）——游离于站点导航体系（IA-04）

| 方向 | 目标 | 触发点 | 打开方式 | 来源 |
|---|---|---|---|---|
| 入 | 本窗口 | 本地启动应用（站点侧唯一分发入口在 PAGE003 下载卡） | — | IA_REVIEW §五 IA-04 |
| 出 | 占位死链 | 帮助菜单 GitHub 链接 `github.com/yourusername/icon-generator` | shell.openExternal | `desktop/src/main/main.js:165`；FL-08 |

## 3. 层级与闭环结论（引自 IA 评审）

1. 站内层级深度 2 级（/ → /tool/），工具页内无子路由——检索成本极低，达标（IA_REVIEW §三）。
2. 跳转闭环缺口：工具页无回链（PG-03，B，V1 已加品牌回链）；无自定义 404（IA-01，C）；外链无标识同窗跳出（IA-02，C）；下载链绑死版本（IA-03，C）；desktop 有出无进（IA-04，随 C-4/C-5 决策）。
3. 命名一致性是最大短板：三重品牌并存（Icon Gen / 图标生成器 / iconsize），处置见 PG-04（B）/PG-08（C）。

> 页面内部结构（组件/按钮/状态/异常）见 `docs/02_product/PAGE_SPEC.md`；V1 新增导航契约（工具页品牌回链等）见 `docs/08_development/API_SPEC.md` §7。
