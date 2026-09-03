# IconGen 信息架构综合评审（IA_REVIEW）

> 综合 `docs/product-review/INFORMATION_ARCHITECTURE_REVIEW.md`（IA 评审全文）与 `docs/06_review/PRODUCT_REVIEW.md` 相关条目（PG-03/PG-04/PG-07/PG-08/FL-07/FL-08），只汇总既有结论、编号沿用原文。编写日期：2026-09-03。

---

## 1. 站点与导航层级（现状）

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
│   └── 【无任何站内回链 / 站内出口】
└── 其他路径 → GitHub Pages 默认 404（仓库 web/public 无 404.html）

PAGE003 iconsize 落地页（landing-page/index.html，独立静态站，部署域名【未知】）
├── 页内锚点 ×5（#features/#how-it-works/#download/#faq/#contact，平滑滚动 -80px）
├── 「网页版」→ https://icon.open.i2kai.com/tool/ 【跨站，新窗口】
├── 下载卡 ×3 → Gitee releases tag/3.0.0 【外部，新窗口，版本固化】
└── 页脚法律/社交 ×7 → '#' 死链（P4 PG-07 已列）

desktop 窗口（desktop/src/renderer/index.html，Electron 本地应用）
└── 帮助菜单 → github.com/yourusername/icon-generator 【占位死链，P4 FL-08 已列】
    （与上述站点无任何互链）
```

来源：IA_REVIEW 原文 §一（依据行号：`web/public/index.html:302-315`、`web/public/tool/index.html` 全文 grep、`landing-page/index.html:252-296,482-516`、`desktop/src/main/main.js:165`）。

## 2. 层级与分类结论（IA_REVIEW §三）

1. **层级深度**：站内最长路径 2 级（/ → /tool/），工具页内无子路由，全站检索成本极低——达标。
2. **分类体系**：工具页三段卡片（输入→配置→结果）与用户心智顺序一致；无分类错置。可并：PAGE001 与 PAGE003 职责重叠（C-5）；可拆：无需拆分；可删：PAGE003 死链区、desktop 帮助菜单死链随各自 C 类决策处置。
3. **命名一致性（最大短板）**：三重命名——PAGE001「Icon Gen」、PAGE002「图标生成器」、PAGE003+desktop「iconsize」（同源 PG-04 B / PG-08 C，IA 视角确认不重复立项）。
4. **内容可预测性**：抽查 7 例——通过 3、部分不通过 1、不通过 3（见 §3）。

## 3. 可预测性抽查结果（IA_REVIEW §四，7 例）

| # | 抽查点 | 结论 | 依据 |
|---|---|---|---|
| 1 | 直访 /tool/ 可用 | 通过 | `web/public/tool/index.html` |
| 2 | 主页点「在线工具」跳工具 | 通过 | `web/public/index.html:302-315` |
| 3 | 工具页点品牌/页脚回主页 | **不通过**（无回链，PG-03 已列 B） | `tool/index.html:17-20,144-146` |
| 4 | 访问不存在路径得站内引导页 | **不通过**（Pages 默认 404，IA-01 新） | `web/public` 无 404.html |
| 5 | 落地页「立即下载」拿最新安装包 | **不通过**（Gitee tag/3.0.0 固化版本，IA-03 新） | `landing-page/index.html:252-280` |
| 6 | 主页导航六项行为一致 | 部分不通过（外链混杂无标识，IA-02 新） | `web/public/index.html:302-315` |
| 7 | 下载文件名可识别 | 通过（app-icons.zip，观察） | `main.js:385` |

## 4. 问题清单（IA_REVIEW §五）

| 编号 | 问题 | 分级 | 建议方向 |
|---|---|---|---|
| IA-01/PL-15 | 无自定义 404 页：错误路径落平台默认 404，无回站入口 | C | 新增 404.html（回主页/工具两链接），随 V1 一并部署 |
| IA-02/PL-17 | 主页导航同级混排页内锚点/站内页/外部长链，外链无标识且同窗跳走 | C | 外链加新窗口+图标标识，或收进页脚；V1 原型已有外链拦截提示机制可延续 |
| IA-03/PL-16 | 下载分发链接绑死 Gitee releases tag/3.0.0，发新版即全失效，且单一来源 | C | 改 latest 动态链或多源；随 C-5 落地页去留一并决策（保留则必修） |
| IA-04/PL-18 | desktop 游离于站点导航体系：站点无桌面版入口（仅 PAGE003），desktop 帮助菜单占位死链 | C | 随 C-4/C-5 一并决策；若均保留需建立「主页→下载区→桌面版→项目仓库」闭环 |
| IA-05 | 三重品牌命名并存 | 同源→PG-04(B)/PG-08(C) | 处置随 P4 既有编号 |
| IA-06 | 页脚死链（PG-07 B）与版权年份 2023（PG-10 D） | 同源 | 维持 P4 处置 |

## 5. 逐页归属表结论（IA_REVIEW §二摘要）

| 页面/容器 | 归属判断 |
|---|---|
| PAGE001 主页 / #features / #usage | 合理（单一职责静态页） |
| PAGE002 上传卡 / 设置卡 / 结果卡 | 合理（设置卡「配置+动作按钮」轻微混杂，V1 已按分区还原，观察不立项） |
| PAGE003 英雄/特性/下载/联系 | 归属合理；链接策略见 IA-03；表单失效见 FN-03 |
| desktop 窗口 | 功能对等但无导航承接（IA-07/IA-04） |

## 6. 统计与衔接

- 新发现 4 项：IA-01（C）、IA-02（C）、IA-03（C）、IA-04（C，并入 C-4/C-5 决策组）；同源交叉引用 2 项（IA-05/IA-06）。
- 跳转关系图与出入口表见 `docs/03_flow/PAGE_FLOW.md`；操作路径/信息层级/页面职责维度见 `docs/06_review/UX_REVIEW.md`。
