# IconGen Design System — Design Tokens（P5）

> 提取原则：全部 token 注明真实来源文件与行号；旧项目三页三套变量并存，本文件如实分列并给出 **V1 统一基线**（统一决策依据见 docs/06_review/PRODUCT_REVIEW.md PG-04：以主产品工具页体系为基线）。V1 原型（prototype/v1-new/）CSS 变量定义全部出自本文件。

---

## 1. Color 色彩

### 1.1 V1 统一基线（以 web 工具页 `web/public/css/style.css:2-19` 为基线）

| Token | 值 | 语义 | 来源 |
|---|---|---|---|
| `--color-primary` | #4a7bff | 主色（按钮/选中/高亮） | style.css:3 `--primary-color` |
| `--color-primary-light` | #6691ff | 主色浅（预留 hover 亮化） | style.css:4 |
| `--color-primary-dark` | #3a6be9 | 主色深（primary hover/focus） | style.css:5 |
| `--color-primary-alpha-05` | rgba(74,123,255,.05) | 主色 5% 透明（hover 背景） | style.css:181,268 |
| `--color-primary-alpha-10` | rgba(74,123,255,.1) | 主色 10% 透明（选中背景/Tab hover） | style.css:273,335,426 |
| `--color-secondary` | #f8f9fa | 次级背景（card-header/拖放区底/secondary 按钮底） | style.css:6 |
| `--color-success` | #28a745 | 成功（success 按钮/success 通知） | style.css:7 |
| `--color-success-dark` | #218838 | success hover | style.css:93 |
| `--color-danger` | #dc3545 | 错误（error 通知） | style.css:8 `--danger-color` |
| `--color-warning` | #ffc107 | 警告（warning 通知底） | style.css:9 |
| `--color-info` | #17a2b8 | 信息（info 通知） | style.css:10 |
| `--color-dark` | #343a40 | 深文字（标题/正文强调） | style.css:11 |
| `--color-text` | #333333 | 正文 | style.css:31 body color |
| `--color-gray` | #6c757d | 次要文字（hint/页脚/副标题） | style.css:13 |
| `--color-border` | #dee2e6 | 边框/分隔线 | style.css:14 |
| `--color-bg` | #f5f7fa | 页面背景 | style.css:32 |
| `--color-surface` | #ffffff | 卡片表面 | style.css:132 card background |
| `--color-chip` | #4285f4 | 结果平台 chip 底色（蓝） | style.css:504 `.platform-list li` |

### 1.2 V1 补充色（V1 原型新增组件引入；定义于 prototype/v1-new/app-prototype.html :root 并同步本表）

| Token | 值 | 语义 | 引入原因 |
|---|---|---|---|
| `--color-warning-surface` | #fff7e0 | 警告类信息面底色（结果过期黄条 / C 类留档注记） | V1 新增结果过期提示（B/FL-04） |
| `--color-warning-border` | #e0b94f | 警告信息面边框 | 同上 |
| `--color-warning-text` | #7a5b12 | 警告信息面文字 | 同上 |
| `--color-success-surface` | rgba(40,167,69,.1) | 成功类信息面底色（表单成功提示） | F028 修复规格（B/FN-03） |
| `--color-success-deep` | #1c743a | 成功信息面深文字 / 资源文件树文字 | 同上 + ZIP 树资源文件配色 |
| `--color-primary-deep` | #3a6be9 | 树目录文字（= 主色深复用 `--color-primary-dark`，不另设） | — |
| `--color-placeholder-2` | #7a5cff | 预览/缩略图渐变辅色（占位专用，主色 #4a7bff 为另一端） | 单文件原型占位块（ASSETS.md §3 约束） |

> 组件级常量注记：按钮 secondary 边框/悬停色 #dae0e5/#e2e6ea/#212529 与纯白 #fff 为旧版 style.css:64-95 原值沿用（Button 组件常量，不单设 token）；评审面板/浏览器画框配色为原型工具层（非产品 UI），不纳入 DS。

### 1.3 旧项目其他页面色板（分列存档，V1 不并行使用）

| 来源 | 关键 token | 值 |
|---|---|---|
| PAGE001 主页 `web/public/index.html:9-20` | `--accent` / `--ink` / `--muted` / `--line` / `--accent-soft` | #0f6bff / #162033 / #637083 / #dce3ec / #e7f0ff |
| PAGE003 落地页 `landing-page/assets/css/styles.css:3-20` | `--primary-color` / `--secondary-color` / `--accent-color` / `--success-color` / `--error-color` | #4361ee / #f72585 / #7209b7 / #38b000 / #e5383b |
| 桌面壳 `desktop/src/renderer/styles.css:14-16,42` | body bg / 标题色 | #f7f9fc / #2c3e50 |

> V1 统一决策：三页全部使用 §1.1 基线 token；主页 #0f6bff 与落地页 #4361ee 在 V1 中映射到 `--color-primary`(#4a7bff)，ink/muted/line 分别映射 `--color-dark`/`--color-gray`/`--color-border`。

## 2. Typography 字体

| Token | 值 | 来源 |
|---|---|---|
| `--font-family-base` | -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif | style.css:28（并入主页 index.html:30 的 PingFang SC/YaHei 中文回退） |
| `--font-family-code` | 'SF Mono', 'Menlo', 'Consolas', monospace | 依据主页 `code` 用法（index.html:274-279）整理；落地页 `--font-code` 为 'Source Code Pro'（Google Fonts 外链，V1 去外链改系统等宽栈，来源 landing styles.css:25） |
| `--font-size-base` | 16px（1rem） | style.css:29 |
| `--font-size-h1` | 2.5rem（40px，工具页 H1） | style.css:110；中屏 2.2rem（responsive.css:19）、小屏 1.8rem（responsive.css:35） |
| `--font-size-h2` | 1.3rem（card 标题） | style.css:151 |
| `--font-size-h3` | 1.1rem（组标题） | style.css:246 |
| `--font-size-lead` | 1.1rem（副标题） | style.css:116 |
| `--font-size-sm` | 0.9rem（hint/页脚/信息条） | style.css:127,209,231 |
| `--font-size-xs` | 0.8rem / 0.75rem（图标名/图标尺寸） | style.css:375,386 |
| `--line-height-base` | 1.5（工具页）/ 1.7（主页正文）→ V1 统一 1.5，长文区 1.7 | style.css:30、index.html:31 |
| `--font-weight-medium` | 500（按钮/label） | style.css:44,283 |
| `--font-weight-bold` | 700-800（H1/品牌/chip） | 主页 index.html:57 brand 800、style.css:508 chip 500 |

## 3. Spacing 间距

> 旧工具页用 rem 系（0.5/1/1.5/2rem），落地页用 px 系（landing styles.css:30-35 `--spacing-xs..xxl`）。V1 统一为 4px 基数刻度，两套来源并列注明。

| Token | 值 | 换算来源 |
|---|---|---|
| `--space-1` | 4px | landing `--spacing-xs:4px`（styles.css:30） |
| `--space-2` | 8px | landing `--spacing-sm:8px`（:31） |
| `--space-3` | 16px（1rem） | 工具页按钮 padding `0.5rem 1rem`（style.css:51）、landing `--spacing-md:16px`（:32） |
| `--space-4` | 24px（1.5rem） | card-body padding 1.5rem（style.css:155）、landing `--spacing-lg:24px`（:33） |
| `--space-5` | 32px（2rem） | 卡片纵向 margin-bottom 2rem（style.css:135,160）、header padding 2rem（:104）、landing `--spacing-xl:32px`（:34） |
| `--space-6` | 48px（3rem） | landing `--spacing-xxl:48px`（:35）；工具页 result-placeholder padding 3rem（style.css:394） |
| `--gap-grid` | 16px（1rem） | platforms-container gap 1rem（style.css:253）、preview-actions gap（:237） |
| `--gap-grid-lg` | 24px（1.5rem） | result-grid gap（style.css:346） |
| `--container-max` | 1200px | style.css:37 `.container`、landing `--container-width:1200px`（:29） |
| `--container-pad` | 20px（中屏 30px/小屏 15px） | style.css:39、responsive.css:4,13,25 |

## 4. Radius 圆角

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--radius-sm` | 4px | 小徽标（结果平台 chip） | style.css:507（li border-radius:4px） |
| `--radius-md` | 8px | 按钮/输入/拖放区/通知 | style.css:17 `--border-radius:8px`；landing `--border-radius-md:8px`（:39） |
| `--radius-lg` | 12px | 卡片 | style.css:18 `--card-border-radius:12px` |
| `--radius-xl` | 16px | 大区块（落地页卡） | landing `--border-radius-lg:16px`（:40） |
| `--radius-full` | 9999px | 圆点/胶囊 | landing `--border-radius-full`（:42）、主页 .dot 50%（index.html:178） |

## 5. Shadow 阴影 / Motion 动效 / Z-Index

| Token | 值 | 来源 |
|---|---|---|
| `--shadow-card` | 0 4px 6px rgba(0,0,0,.1) | style.css:15 `--box-shadow` |
| `--shadow-notify` | 0 4px 12px rgba(0,0,0,.15) | style.css:440 |
| `--shadow-icon` | 0 2px 4px rgba(0,0,0,.1) | style.css:367 |
| `--speed-base` | 0.3s ease（全部过渡） | style.css:16 `--transition-speed` |
| `--z-notify` | 9999 | style.css:441 |
| 禁用态 | opacity .65 + cursor not-allowed | style.css:97-100 |

---

## 附：Token 命名映射表（旧变量名 → V1 token）

| 旧变量（来源文件） | V1 Token |
|---|---|
| `--primary-color`（style.css:3） | `--color-primary` |
| `--primary-color-dark`（style.css:5） | `--color-primary-dark` |
| `--secondary-color`（style.css:6） | `--color-secondary` |
| `--success-color` / `--danger-color` / `--warning-color` / `--info-color`（style.css:7-10） | `--color-success` / `--color-danger` / `--color-warning` / `--color-info` |
| `--dark-color` / `--gray-color` / `--border-color`（style.css:11-14） | `--color-dark` / `--color-gray` / `--color-border` |
| `--border-radius` / `--card-border-radius`（style.css:17-18） | `--radius-md` / `--radius-lg` |
| `--transition-speed`（style.css:16） | `--speed-base` |
| `--box-shadow`（style.css:15） | `--shadow-card` |
| `--accent` / `--ink` / `--muted` / `--line` / `--accent-soft`（web index.html:9-20） | `--color-primary` / `--color-dark` / `--color-gray` / `--color-border` / `--color-primary-alpha-10`（近似） |
| `--spacing-xs..xxl`（landing styles.css:30-35） | `--space-1..6` |
| `--border-radius-sm/md/lg/xl/full`（landing styles.css:38-42） | `--radius-sm/md/xl/lg/full` |
