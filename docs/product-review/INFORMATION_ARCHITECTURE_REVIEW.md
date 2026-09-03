# IconGen 信息架构评审（IA）

> 评审依据：《AI 产品重构逻辑评审规范 v1.0》· 2026-09-03
> 输入文档清单：`docs/01_reverse/REVERSE_ANALYSIS.md`、`docs/02_product/PRD.md`、`docs/02_product/PAGE_SPEC.md`、`docs/06_review/PRODUCT_REVIEW.md`；源码抽查：`web/public/index.html`、`web/public/tool/index.html`、`landing-page/index.html`、`desktop/src/renderer/index.html`、`.github/workflows/pages.yml`。
> 只评审、不修改；「当前设计」均注明依据，无法证实标【未知】。

---

## 一、站点与导航层级图（文本树，含外部出口标注）

```
icon.open.i2kai.com（GitHub Pages，CNAME）
├── / ............................ PAGE001 项目主页（web/public/index.html）
│   ├── 导航锚点 #features / #usage ............ 站内页内
│   ├── 「在线工具」/「打开在线工具」→ /tool/ ... 站内跳转（同窗）
│   ├── 「Open」→ open.i2kai.com/projects#icon-gen 【外部，同窗跳出】
│   ├── 「GitHub」→ github.com/LuoYaoSheng/lys-icon-gen 【外部，同窗跳出】
│   └── 「Gitee」→ gitee.com/luoyaosheng/lys-icon-gen 【外部，同窗跳出】
├── /tool/ ....................... PAGE002 在线工具（web/public/tool/index.html）
│   ├── 页内三段卡片（上传/设置/结果）........ 页内滚动，无子路由
│   └── 【无任何站内回链 / 站内出口】（grep href 仅命中 css/favicon 相对资源）
└── 其他路径 → GitHub Pages 默认 404（仓库 web/public 无 404.html）

PAGE003 iconsize 落地页（landing-page/index.html，独立静态站，部署域名【未知】）
├── 页内锚点 ×5（#features/#how-it-works/#download/#faq/#contact，平滑滚动 -80px）
├── 「网页版」→ https://icon.open.i2kai.com/tool/ 【跨站，新窗口】
├── 下载卡 ×3 → Gitee releases tag/3.0.0 【外部，新窗口，版本固化】
└── 页脚法律/社交 ×7 → '#' 死链（P4 PG-07 已列）

desktop 窗口（desktop/src/renderer/index.html，Electron 本地应用）
└── 帮助菜单 → github.com/yourusername/icon-generator 【占位死链，P4 FL-08 已列】
    （与上述站点无任何互链：站点侧仅 PAGE003 提供桌面版下载入口）
```

依据：`web/public/CNAME`；`web/public/index.html:302-315`（导航）、`332-350`（英雄区按钮）；`web/public/tool/index.html` 全文 grep（无站内回链）；`landing-page/index.html:252-296`、`482-516`；`desktop/src/main/main.js:165`；`web/public` 目录清单（仅 index.html 与 tool/index.html，无 404.html）。

## 二、逐页分类归属表

| 页面/容器 | 层级归属 | 内容分类 | 归属判断 | 依据 |
|---|---|---|---|---|
| PAGE001 主页 | 站点根 | 品牌介绍 + 导流（工具/源码/体系） | 合理（单一职责静态页） | `PRD.md §6 PAGE001` |
| PAGE001 #features 能力区 | 主页锚点 | 产品能力说明 | 合理（3 卡不越界） | `web/public/index.html:353-370` |
| PAGE001 #usage 入口表 | 主页锚点 | 入口聚合（工具/仓库/体系/本地运行命令） | 合理 | `web/public/index.html:372-397` |
| PAGE002 上传卡片 | 工具页第一段 | 输入 | 合理 | `tool/index.html:23-56` |
| PAGE002 设置卡片 | 工具页第二段 | 配置（平台+选项）+ 动作按钮 | 轻微混杂（生成/重置按钮寄居配置卡，`tool/index.html:112-115`）；V1 已按分区还原 | `page-spec §2` |
| PAGE002 结果卡片 | 工具页第三段 | 结果+下载 | 合理（信息量弱已列 P4 PG-01） | `tool/index.html:120-141` |
| PAGE003 英雄/特性/效果/步骤 | 落地页 | 营销内容 | 合理 | `PRD.md §6 PAGE003` |
| PAGE003 下载区 | 落地页 | 分发入口（3 桌面 + 1 网页版） | 归属合理，链接策略见 IA-03 | `landing-page/index.html:240-297` |
| PAGE003 联系区+表单 | 落地页 | 反馈收集 | 归属合理，功能失效已列 P4 FN-03 | `landing-page/index.html:380-467` |
| desktop 窗口 | 独立应用 | 工具桌面版 | 功能与 PAGE002 对等但无导航承接（IA-07） | `desktop/src/renderer/index.html` |

可删可并可拆结论：
- **可并**：PAGE001 与 PAGE003 职责重叠（介绍+引流双主页、双品牌）——P4 PG-08/C-5 已列 C 类，维持，不重复立项。
- **可拆**：无需拆分。PAGE002 单页承载三段式流程，深度为 1，无拆分必要。
- **可删**：PAGE003 死链区（PG-07）、desktop 帮助菜单死链（FL-08）随各自 C 类决策处置。

## 三、信息架构层级与分类结论

1. **层级深度**：站内最长路径 2 级（/ → /tool/），工具页内无子路由，全站信息检索成本极低——达标。
2. **分类体系**：工具页三段卡片（输入→配置→结果）与用户心智顺序一致；无分类错置内容。
3. **命名一致性**（最大短板）：同一产品三重命名——PAGE001「Icon Gen」、PAGE002 页头「图标生成器」/页脚「2023 图标生成器」、PAGE003 与 desktop「iconsize」。P4 PG-04/PG-08 已列（B/C 类），IA 视角同源确认，不重复立项。
4. **内容可预测性**：见 §四抽查。

## 四、可预测性抽查（7 例，≥5 要求）

| # | 抽查点 | 用户预期 | 实际行为 | 结论 | 依据 |
|---|---|---|---|---|---|
| 1 | 直访 `/tool/` 是否可用 | 常用工具应可直达 | 可直达，核心流程完整 | 通过 | `web/public/tool/index.html`（README 第 6 行公开该地址） |
| 2 | 主页点「在线工具」 | 跳到工具 | 跳转 /tool/（同窗） | 通过 | `web/public/index.html:302-315` |
| 3 | 工具页点品牌/页脚回主页 | 站点惯例：logo 回主页 | 无任何回链，只能浏览器后退 | **不通过**（P4 PG-03 已列 B） | `tool/index.html:17-20,144-146` grep 无回链 |
| 4 | 访问不存在路径 `/xyz` | 得到站内引导页 | GitHub Pages 默认 404，无回站入口 | **不通过**（IA-01，新） | `web/public` 无 404.html；`.github/workflows/pages.yml` 整目录发布 |
| 5 | 落地页点「立即下载」 | 拿到最新安装包 | 滚动到 #download，下载卡链向 Gitee **tag/3.0.0 固化版本**；发新版后预期落空，且失败无提示 | **不通过**（IA-03，新） | `landing-page/index.html:252-280` |
| 6 | 主页导航六项 | 同级导航行为一致 | 2 项站内锚点、1 项站内页、3 项外部站点，均无外链标识且同窗跳走（离开本站无提示） | 部分不通过（IA-02，新） | `web/public/index.html:302-315` |
| 7 | 工具页下载后的文件名 | 与产品相关的可识别名称 | `app-icons.zip`，可接受但与品牌无关 | 通过（观察） | `main.js:385` |

## 五、问题清单（IA-01 起；格式：当前设计/问题/影响/建议方向）

### IA-01 无自定义 404 页【新发现 · C】
- **当前设计**：`web/public` 仅含 index.html 与 tool/index.html，全目录发布 GitHub Pages；不存在路径返回平台默认 404（依据：`web/public` 文件清单 + `.github/workflows/pages.yml`）。
- **问题**：404 页与站点零关联，用户（尤其从失效外链/输错地址进入者）无回到主页或工具的入口。
- **影响**：流量损失；对「工具直达」类产品，404 是常见落地场景。
- **建议方向**：新增 404.html（回主页/工具两链接），随 V1 重构一并部署；是否值得做由用户决策（成本低、收益中等）。

### IA-02 主页导航外链混杂且同窗跳出【新发现 · C】
- **当前设计**：PAGE001 导航同级混排 2 个页内锚点、1 个站内页链接、3 个外部链接（Open 体系/GitHub/Gitee），全部同窗跳转、无外链标识（依据：`web/public/index.html:302-315`）。
- **问题**：同级导航心智模型不一致；点击「GitHub」后整页离开本站。
- **影响**：用户丢失当前站上下文；外链与站内行为不可区分，可预测性下降。
- **建议方向**：外链加新窗口打开与图标标识，或把纯仓库/体系外链收进页脚；V1 原型已有外链拦截提示机制（`V1_ACCEPTANCE.md` §1），可延续该口径。

### IA-03 下载分发链接绑死 releases tag/3.0.0【新发现 · C】
- **当前设计**：PAGE003 三张桌面下载卡全部指向 `gitee.com/.../releases/tag/3.0.0` 固化版本（依据：`landing-page/index.html:252-280`）。
- **问题**：版本号写死在链接里，下一次发版全部旧链接失效；且仅 Gitee 单一分发源（GitHub releases 未使用）。
- **影响**：落地页转化链路随版本迭代静默断裂；单一来源可用性风险。
- **建议方向**：改用 latest 动态发布页链接或多源并列；与 C-5（落地页去留）绑定决策——若落地页保留则必修。

### IA-04 desktop 游离于站点导航体系【新发现 · C，随 P4 C-4/C-5 合并决策】
- **当前设计**：站点侧（PAGE001/PAGE002）无任何桌面版下载入口，唯一入口在品牌不同的 PAGE003；desktop 应用帮助菜单 GitHub 链接为占位死链（依据：`web/public/tool/index.html` 无下载引导；`desktop/src/main/main.js:165`）。
- **问题**：桌面版作为产品形态之一在导航体系中「有出无进」：站点可达落地页→桌面版，桌面版回不到任何真实项目页。
- **影响**：用户在两个品牌三套入口间断链；桌面版获取路径依赖一个【部署域名未知】的营销站。
- **建议方向**：随 C-4（桌面壳去留）与 C-5（落地页去留）一并决策；若两者均保留，需建立「主页→下载区→桌面版→项目仓库」的闭环链接关系。

### IA-05 三重品牌命名并存【同源交叉引用，不重复立项】
- PAGE001「Icon Gen」/ PAGE002「图标生成器」/ PAGE003+desktop「iconsize」。P4 PG-04（B，视觉统一）与 PG-08（C，双主页品牌）已覆盖；IA 视角补充：命名不一致直接损害「同一产品」的可预测性（用户无法确认三处是同一工具）。处置随 P4 既有编号走。

### IA-06 页脚死链与版权年份【同源交叉引用】
- `landing-page/index.html:482-516` 死链（P4 PG-07，B）；`tool/index.html:145` 与落地页 2023 版权（P4 PG-10，D）。维持 P4 处置。

## 六、统计

- 新发现问题 4 项：IA-01（C）、IA-02（C）、IA-03（C）、IA-04（C，并入 P4 C-4/C-5 决策组）。
- 同源交叉引用 2 项：IA-05（→PG-04/PG-08）、IA-06（→PG-07/PG-10）。
- 可预测性抽查 7 例：通过 3、部分不通过 1、不通过 3（其中 1 例 P4 已列）。
