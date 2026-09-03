# IconGen UX 综合评审（UX_REVIEW）

> 综合两份评审：`docs/06_review/PRODUCT_REVIEW.md`（P4 产品体验审查，FN/PG/FL 编号）与 `docs/product-review/USER_FLOW_REVIEW.md`（UF 用户流程评审），按「操作路径 / 信息层级 / 页面职责」三维度归并；只汇总既有结论、不新增判断，编号沿用原文可溯源。编写日期：2026-09-03。

---

## 0. 分级口径（沿用 PRODUCT_REVIEW §0）

A=文档勘误；B=V1 原型落地；C=需用户决策（默认不做留档）；D=观察不动。

## 1. 操作路径维度

### 1.1 路径长度：达标

- 核心目标「拿到全套图标」最短路径 = 上传 1 + 生成 1 击 + 下载 1 击（默认 iOS+Android 与三选项均已勾选，配置可零操作），现路径交互次数与理论最短一致（USER_FLOW_REVIEW §一流程 1；`tool/index.html:66-87`）。
- 路径成本不在点击数，在等待与信息：下载全量重算（FN-09）、无图标预览（FN-02）、生成无进度不可取消（FL-03）。

### 1.2 操作路径问题清单

| 编号 | 问题 | 分级 | 出处 |
|---|---|---|---|
| PG-02 | 拖放区文案「拖放图像到这里或点击上传」与行为不符：click 仅绑定按钮，拖放区空白处点击无响应 | B | PRODUCT_REVIEW §2 |
| PG-03 | 工具页无返回主页路径（只能浏览器后退） | B | PRODUCT_REVIEW §2；USER_FLOW_REVIEW §二流程 3 |
| FL-03 | 生成中不可取消、无进度（大图全平台期间仅常驻 info） | B | PRODUCT_REVIEW §3 |
| UF-02/PL-05 | web 生成过程无防重入：生成按钮全程可点，可并发两轮全平台生成（对照 desktop 有禁用） | B | USER_FLOW_REVIEW §四；STATE_REVIEW ST-01 |
| FN-01 | 重置按钮双重绑定，点击执行两次 resetApp | B | PRODUCT_REVIEW §1 |
| FN-09 | 下载即全量重算，生成结果未缓存；生成后改配置下载与所见不一致 | B | PRODUCT_REVIEW §1；FL-04 同源 |
| FL-04 + UF-01/PL-04 | 配置/平台变更后结果区不失效；换图后同样不失效（直接下载用新图组包，所见非所得——UF 评审对 FL-04 的范围扩展） | B | PRODUCT_REVIEW §3；USER_FLOW_REVIEW §四 |
| FL-05 | 拖放多文件仅取首个，无提示 | D（照旧） | PRODUCT_REVIEW §3 |
| FL-06 | 文件选择器取消无反馈 | D（照旧） | PRODUCT_REVIEW §3；PAGE_SPEC §4 |
| UF-03/PL-14 | 下载落盘无确认与兜底（仅「下载已开始」） | C | USER_FLOW_REVIEW §四 |
| UF-04/PL-13 | desktop 导出 fs.writeFileSync 直接覆盖同名文件，无确认 | C（随 C-4） | USER_FLOW_REVIEW §四 |
| FL-02 + PM-05 | JSZip CDN 依赖：可用性降级（下载时才报错）+ 供应链完整性（无 SRI/无 CSP） | B | PRODUCT_REVIEW §3；PERMISSION_REVIEW PM-05 |

### 1.3 异常路径覆盖：用户失败 7 类 error 齐备（文案具体、可重试）；系统失败有通知无下一步指引；环境失败无检测（UF-05/PL-21，D）（USER_FLOW_REVIEW §三）。

## 2. 信息层级维度

| 编号 | 问题 | 分级 | 出处 |
|---|---|---|---|
| FN-02 | 结果区图标网格为「孤儿功能」：样式与过滤逻辑齐备但从不渲染网格——用户看不到任何生成后的图标预览与按平台过滤 | B | PRODUCT_REVIEW §1 |
| PG-01 | 结果区信息层级弱：仅平台名 chip + 一句提示，无图标数/文件数/预览/目录结构，下载前无法核对所得（V1 落地方案：Tab+网格+计数+ZIP 树三层） | B | PRODUCT_REVIEW §2 |
| PG-05 | 平台选择卡无图标与规模提示（V1：平台 SVG 图标 + 图标数徽标 15/11/10/10/11） | B | PRODUCT_REVIEW §2 |
| PG-06 | 输出选项无后果说明：「文件名添加平台前缀」在子文件夹模式下静默不生效，无提示 | B | PRODUCT_REVIEW §2 |
| PL-03 | 对称缺口：扁平模式下 Contents.json/自适应图标两选项静默失效 | B | PRODUCT_LOGIC_REVIEW §八 |
| FL-01 | 非正方形 warning 被紧随的 success 单通知条覆盖，实际不可见（V1：堆叠队列 ≤3） | B | PRODUCT_REVIEW §3 |
| PL-09/UF-08 | 小图/非 PNG 静默通过并放大输出，无信息提示（建议复用 F007 warning 通道） | B | USER_FLOW_REVIEW §四；PRODUCT_LOGIC_REVIEW §八 |
| PG-09 | PAGE001 预览卡瓦片为纯数字占位 | D（照旧） | PRODUCT_REVIEW §2 |
| PG-10 | 版权年份 2023 未更新 | D（照旧） | PRODUCT_REVIEW §2 |

## 3. 页面职责维度

| 页面 | 职责评价 | 处置 | 出处 |
|---|---|---|---|
| PAGE001 项目主页 | 单一职责静态导流页，达标 | 保留 | USER_FLOW_REVIEW 未立项；IA_REVIEW §二 |
| PAGE002 在线工具 | 主职责清晰（单页三段式：上传→配置→结果）；轻微混杂：设置卡片内混排「平台选择（输入）+ 输出选项（配置）+ 生成/重置（动作）」三类控件 | 观察（V1 已按卡片分区还原） | PRODUCT_LOGIC_REVIEW §三；IA_REVIEW §二 |
| PAGE003 落地页 | 与 PAGE001 职责重叠（双主页双品牌 iconsize vs Icon Gen）、部署域名【未知】 | C-5 待决策 | PRODUCT_REVIEW PG-08/FL-07 |
| desktop 窗口 | 与 PAGE002 功能对等双份维护；游离于站点导航体系（站点无桌面版下载入口，帮助菜单死链） | C-4 待决策（建议决策范围扩展：+安全配置 PL-10、+覆盖确认 PL-13） | PRODUCT_REVIEW FN-12；USER_FLOW_REVIEW §一流程 5；PRODUCT_LOGIC_REVIEW §九 |
| 落地页死链区 | 页脚法律 4 项 + 社交 3 项均为 # 死链 | B（移除或标注） | PRODUCT_REVIEW PG-07 |

## 4. 汇总统计

- B 类落地项（P4 11 项 + UF 3 项 + PL 评审补立项，去重后核心集）：FN-01/02/03/04/09/10、PG-01/02/03/04/05/06/07、FL-01/02/03/04（含 UF-01 扩展）、UF-02、UF-08/PL-09、PL-02/03/05 等（完整清单见 PRODUCT_REVIEW §5.1 与 PRODUCT_LOGIC_REVIEW §八）。
- C 类待用户决策：C-1（F030）、C-2（F031）、C-3（单个下载）、C-4（桌面壳，建议补安全与覆盖确认为强制前置）、C-5（落地页去留）+ UF-03。
- D 类照旧：FN-11、PG-09/10、FL-05/06、UF-05/PL-21、PL-20/22/24 + 代码卫生 2 项。
- V1 原型已消化：FN-01/02/09、PG-01/02/03/05、FL-01/03/04 已在 `prototype/v1-new/app-prototype.html` 落地并通过 `docs/09_test/V1_ACCEPTANCE.md` 实测（PRODUCT_LOGIC_REVIEW §九 4）。

## 5. 衔接

- 信息架构维度（层级/导航/命名）详见 `docs/06_review/IA_REVIEW.md`。
- 状态与流程目标态（S4/S5_Stale 补齐）见 `docs/04_architecture/STATE_MACHINE.md`；组包规则对账见 `docs/07_design_system/GUIDELINES.md` §4。
