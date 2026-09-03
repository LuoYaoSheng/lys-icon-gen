# IconGen HTML 原型质量验收报告（QA 版）

> 依据标准：《AI 生成 HTML 原型质量验收标准 v1.0》（§2 文档一致性 / §3-4 页面与入口 / §5 功能 / §6 按钮 / §7-9 状态与异常 / §10-15 数据·架构·组件·DS·代码 / §16 七项结论 / §17 验收等级）
> 角色：产品测试负责人 · **本轮未修改任何原型/文档**（纯验收，唯一产出本文件）
> 主验对象：`prototype/v1-new/app-prototype.html`（单文件 1863 行，按 **Level 3** 验收）
> 快检对象：`prototype/v0-old/app-prototype.html`（对照 [HTML_V0_ACCEPTANCE.md](HTML_V0_ACCEPTANCE.md) 口径）
> 输入基线：[PRD.md](../02_product/PRD.md) · [PAGE_SPEC.md](../02_product/PAGE_SPEC.md) · [USER_FLOW.md](../03_flow/USER_FLOW.md) · [FEATURE_MAP.md](../02_product/FEATURE_MAP.md) · [TOKEN.md](../07_design_system/TOKEN.md) · [COMPONENT.md](../07_design_system/COMPONENT.md) · [REVERSE_ANALYSIS.md](../01_reverse/REVERSE_ANALYSIS.md) §⑦数据模型 · [STATE_MACHINE.md](../04_architecture/STATE_MACHINE.md) · [GUIDELINES.md](../07_design_system/GUIDELINES.md) §4
> 验收日期：2026-09-03 · 验证方式：`python3 -m http.server 8303` + **隔离 headless Chromium（Playwright 驱动）** 4 轮 ~77 项断言 + 脚本化静态检查（node --check / 正则扫描 / id·data-* 交叉核对）

---

## 一、结论摘要

### 验收等级：**Level 3 —— 开发依据** ✅

- ✅ Level 1：3/3 页面存在，入口/返回完整（PAGE001↔PAGE002 双向实测；PAGE003 四下载卡+导航）
- ✅ Level 2：流程完整（旅程 1/2/4 实测走通、旅程 3 以 F032 差异卡说明覆盖——PRD §6 限定浏览器侧）；状态五态全（含权限演示态）；异常 6/7 类文案可触发（缺口 Q2，P3）
- ✅ Level 3：PRD 32 项功能一一对应；数据结构与真实模型 57 项 size/name 逐项一致（字段命名 3 处 P4 偏差）；20/20 组件落地且跨页复用；54 个 CSS token 与 TOKEN.md 一致（2 字重 token 未用+1 处残留硬编码，P4）；`state` 单源 + 派生渲染与 STATE_MACHINE §1-2 设计一致

### 开发准入 8 项勾选

| # | 检查项 | 结果 | 证据要点 |
|---|--------|------|----------|
| 1 | 页面覆盖 100% | ✅ 3/3 | T1/T2/C1：三页逐一渲染，区块计数全中（导航6/瓦片8/能力3/FAQ6/步骤5/下载4/证言3/联系5/页脚4栏） |
| 2 | 功能覆盖 100% | ✅ 32/32 | 实测 F001-F014/F015-F023（数值对账 26/34/57/67）+F024/F026/F027/F028/F029；F025/F032 说明级、F030/F031 留档级（P4 决策口径，页面 C-note+弹层留档） |
| 3 | 用户流程完整 | ✅ 4/4 | 旅程1（T2-T5）、旅程2 换图重生成（J2-1~J2-4）、旅程4 落地页转化（C2-C7）实测；旅程3 desktop 以 F032 弹层差异说明覆盖（范围外） |
| 4 | 核心状态完整 | ✅ 5/5+权限 | Loading（常驻 info+平台级进度 T4a/T14）/Empty（T13）/Success（T3/T4/T5）/Error（T9/T10/T12/T15）/Permission（T15c V1 演示态标注） |
| 5 | 异常流程完成 | ⚠️ 6/7 | 七类 error 文案 6 类逐字实测命中；「创建ZIP文件时出错」无模拟触发入口（Q2，P3，不阻断） |
| 6 | 数据模型一致 | ⚠️ 基本一致 | ICON_TEMPLATES 57 项与 iconSizes.js **逐项比对 size/name 全等**；Config 四键+默认值、Notification 实体一致；`desc`/Windows `scale:'100'`/watchOS `idiom` 3 处字段偏差（Q6，P4） |
| 7 | 组件规则明确 | ✅ 20/20 | COMPONENT.md 全部 33 个类族在 CSS 有定义且 HTML 有使用；Card×3、FeatureCard 跨页复用（PAGE001×3+PAGE003×6） |
| 8 | Design Token 统一 | ⚠️ 54/57 | 值与 TOKEN.md 全等（零色值冲突）；--font-weight-medium/bold 未定义（16 处字面量）、--color-primary-deep 按 TOKEN.md 明示不另设；`.stale-banner` 1 处残留硬编码（值=token 值，Q4，P4） |

**最终结论：通过（Level 3，开发准入放行）。** 无 P0/P1/P2 缺失；3 项 P3 + 4 项 P4 记录在案（§三），建议随 V1 真实开发一并处置，不回改原型。

---

## 二、五项覆盖率矩阵

| # | 维度 | 覆盖率 | 证据 |
|---|------|--------|------|
| 1 | **页面覆盖** | **3/3 = 100%** | PAGE001（T1：顶栏/英雄/8 瓦片/能力 3 卡/入口表 4 行/页脚）、PAGE002（T3-T5：上传两态/设置/结果四件套/页脚）、PAGE003（C1：9 区块计数全中）；三页左上角 page-badge 标注来源，地址栏随页切换（/、/tool/、【未知域名】如实） |
| 2 | **功能覆盖** | **32/32 = 100%**（27 实测 + 5 说明/留档级） | F001-F013 逐项实测（B1/B2/B3/B4/T3/T9/T10/T12/T11/T4/T5/T7/T15e）；F014 四态+队列 ≤3（T15e）；F015-F019 模板计数 15/11/10/10/11（B7a 模板表+Tab 双通道）；F020-F023（T4g/B6c/B7c：3 json+7 xml、前缀、目录树）；F024/F026/F027（T1/C1-C7）；F028/F029 修复规格生效（C3/C4）；F030/F031 C-note 留档+弹层；F032 差异卡（B8d）；F025 CI 以覆盖表说明行覆盖（原型外） |
| 3 | **流程覆盖** | **4/4 = 100%**（3 实测 + 1 说明级） | 旅程1 主线 3 击闭环（T2→T3→T4→T5）；旅程2 换图重生成全分支（J2 系列，含换图不失效边界——见 §六）；旅程4 落地页转化（C6 网页版卡跳转/Gitee 拦截/FAQ/表单/汉堡）；旅程3 desktop 范围外以 F032 弹层覆盖（独有能力 4+差异 4+C-4 处置） |
| 4 | **状态覆盖** | **五态 ×核心页 = 100%** | S1 空态（T13）、S2 预览态（T3）、S3 拖拽悬停（B3 drag-active 实测）、S4 生成中（T4a 防重入 D3）、S5 已生成/已过期（T4e/T17a readout 双态）、S6 组包中（T5 常驻 info）；场景库 7 场景逐一触发正常（T13-T15d）；权限为 V1 演示态（旧版无此分支，通知内自带标注） |
| 5 | **异常覆盖** | **6/7 类 = 85.7%** | 非图片（T10「请选择有效的图像文件」逐字）、>5MB（T9「文件大小不能超过5MB」逐字）、损坏文件（T12「处理图像时出错: 图像加载失败」逐字）、无平台强造生成（T11b）、无文件点下载（D1「没有可供下载的图标」）、生成失败（T15a「生成图标时出错: 模拟生成失败」）+ 非正方形警告 5s（T8/J2-2d/D2）；**缺**：ZIP 组包失败「创建ZIP文件时出错」无触发路径（Q2） |

---

## 三、缺失/问题列表（P0-P3）

> 无 P0/P1/P2。延续既有编号风格（Q=本轮新发现，P=优先级）。

| 编号 | 级别 | 描述 | 证据 | 建议 |
|------|------|------|------|------|
| **Q1** | **P3** | **换图失效边界**：换图后旧结果不失效被照旧模拟（结果区保留、下载可用、无过期提示，readout 仍「已生成」）——行为与 USER_FLOW 旅程 2 记载的旧版 UF-01/PL-04 完全一致，**模拟本身正确**；但 (a) 原型内无行内标注说明这是已知缺陷照旧（其他照旧项如页脚 ©2023、重置不重置平台均有标注），(b) stale 黄条文案与 configKey 过期判定仅覆盖「平台/输出选项」，STATE_MACHINE §2 亦无 S5_Done 后换图的状态转移定义 | J2-2b/J2-2c/J2-3 实测：换 logo-800x600 后 `result=block`、`stale=false`、下载仍组包 26+8 | 开发阶段决策 configKey 是否纳入文件标识或换图时提示；文档补 S5 换图转移（或明确照旧+标注） |
| **Q2** | **P3** | ZIP 组包失败文案「创建ZIP文件时出错: {msg}」（PAGE_SPEC §2 异常处理行、PRD §6）在 V1 无任何触发路径：模拟打包层不抛错，场景库 fail 场景只注入「生成图标时出错」 | 源码 `downloadAllIcons` 无 fail 分支；场景库 7 场景枚举核对 | 场景库补「打包失败」注入或在 C/留档注明（七类文案 6/7 可实测） |
| **Q3** | **P3** | F026 子项「入场动画」（PRD §6 PAGE003 响应行：元素进入视口播放入场动画）未模拟且无留档标注——页面 C-note 仅列 F030/F031；hero「浮动装饰」亦未呈现（仅演示占位块说明）。F026 其余 3 子项（FAQ 手风琴/锚点平滑滚动/头部滚动态 C5）已落地 | C5 PASS + 源码无 IntersectionObserver/animation 入场逻辑 | 入场动画随 V1 开发实现（或并入 C 类留档注明），补 hero 浮动装饰 |
| Q4 | P4 | Token 残留硬编码 1 处产品 UI：`.stale-banner` 使用字面量 #fff7e0/#e0b94f/#7a5b12（对应 --color-warning-surface/border/text 已在 :root 定义但未引用）；另 `.preview-figure` 文字色 #5b7a9a 非 token 色。与 V1_ACCEPTANCE §8 D1「样式全部改用 var()」记录不符（残留 1 条规则）。评审面板/画框/pill 等工具层硬编码按 TOKEN.md 注记豁免 | CSS 规则级扫描：`.stale-banner{background:#fff7e0;border:1px solid #e0b94f;color:#7a5b12}` | 开发时改 var()；视觉不受影响（值与 token 相等） |
| Q5 | P4 | 字重 token（--font-weight-medium/bold，TOKEN.md §2）未定义未使用，CSS 16 处字面量（500×2/600×6/700×4/800×4）；:root 实际 **54** 个变量（V1_ACCEPTANCE 记 48，计数过时——勘误级，非缺陷） | :root 提取比对 TOKEN.md | 开发时收敛为 2 个字重 token |
| Q6 | P4 | 模拟数据字段命名与真源偏差：`desc` vs iconSizes.js `description`；Windows 条目缺 `scale:'100'`（模板表显示回退 '1x'，GUIDELINES §4.1 注明 Windows scale 均 '100'）；watchOS 条目缺 `idiom`（信息由 role 承载）；非 Android 平台 `folder` 归一到 PLATFORM_DIR（信息无损）。**57 项 size/name 与 iconSizes.js 逐项全等（脚本化比对）** | node 沙箱双源比对输出 | 开发时字段名对齐 REVERSE §⑦实体 1 |
| Q7 | P4 | 代码级备注：`handleGenerate` 内 1 行 no-op IIFE（对栈内元素补空 dataset.notifyId 的无效语句）；`notify()` 不自标 notifyId、依赖调用方补标（脆弱模式，现有 2 条常驻路径均正确补标，实测无泄漏——loading 均被定向清除）；PAGE003 锚点滚动未实现 -80px 偏移（scrollIntoView block:start，画框内无固定头遮挡，不可见差异） | 源码 1318/1105-1130/1712 行 | 开发时清理；偏移按 PAGE_SPEC 实现 |

---

## 四、按钮与交互抽查（标准 §6）

**静态全量**：43 个 `<button>` + 28 个 `<a>` 逐一核对——0 个无行为按钮（生成按钮初始 disabled 为业务态）；0 个孤儿 `data-*`（data-goto/data-anchor/data-scene/data-file/data-close/data-url 全部有对应处理器与目标）；0 个 `href` 死链（外链统一 data-url 拦截+toast；3 处旧版死链以非交互 `<span class="dead-link">` 删除线+title 标注，PG-07 口径）；JS 引用的 45 个 DOM id 与 HTML 交叉核对无缺失。

**动态抽查（14 组，≥10 达标）**：

| # | 按钮/控件 | 行为证据 |
|---|-----------|----------|
| 1 | 选择图像 #uploadBtn | filechooser 事件触发（B1） |
| 2 | 拖放区整区点击（空态） | 非按钮区域 (40,40) 点击同样唤起 filechooser（B2，PG-02） |
| 3 | 真实拖放通道 | canvas 构造 File → dragover 高亮 → drop 进预览态「512×512px」（B3） |
| 4 | 更换图像 #changeImageBtn | filechooser 触发 + 换图后 fileInfo 更新（B4/J2-2a） |
| 5 | 平台卡 ×5 | 点击切换 selected、联动禁用/启用/模板表（T11a-c、B7a 全选） |
| 6 | 输出选项 ×4 | 变更即改 state、触发 stale 黄条与结果即时重绘（T17a/B6） |
| 7 | 生成图标 #generateBtn | 进度通知→结果四件套→success；防重入仅 1 条 loading（T4/D3） |
| 8 | 重置 #resetBtn | 回初始态 +「应用已重置」**仅 1 次**（T7a-c，FN-01） |
| 9 | 下载所有图标 #downloadZipBtn | 清单弹层 26+8=34/57+10=67 +「下载已开始」（T5/B7c） |
| 10 | 结果 Tab 过滤 | iOS→15 项、Android→11 项（D4/D4b） |
| 11 | 折叠面板 ×2 | 模板表 26 行/ZIP 树开合（B5/T4g） |
| 12 | FAQ ×6 + 汉堡 | 互斥（开第 4 项后仍 1 个）+再点收起；<768px 汉堡开合+点项收起（C2/C4） |
| 13 | 表单提交 | 空提交 3 必填标红；填写后成功提示 5s 自动消失+重置（C3a-c） |
| 14 | 外链 ×14 | PAGE001 GitHub/下载卡 Gitee 3.0.0 → 拦截 toast 含目标 URL（B9/C7）；站内 goto（网页版卡→PAGE002 C6） |

---

## 五、状态与异常触发记录

| 类别 | 触发方式 | 结果 |
|------|----------|------|
| Loading | 生成（常驻 info + 「iOS ✓ · Android 3/11」平台级进度）/ 场景库-加载 | T4a「iOS 6/15」、T14「iOS 8/15」实测可见；完成后定向清除，无永久 loading |
| Empty | 初始态 / 场景库-空数据 | fileInfo「未选择文件」、结果隐藏、按钮禁用（T13） |
| Success | 上传/生成/下载三段 | 「图像已成功加载」「图标已成功生成，可以下载」「下载已开始」全命中（T3b/T4f/T5） |
| Error | 见 §二矩阵 6 类 | 文案逐字命中（T9/T10/T12/T11b/D1/T15a） |
| Warning | 800×600 非正方形 | 与 success 并存可见（FL-01 队列），5s 后消失（J2-2d + D2 early=true/late=false） |
| Permission | 场景库-权限 | 「文件读取权限被拒…（V1 演示态：旧版无此分支）」自带标注（T15c） |
| 队列上限 | 连发 4 条 info | 栈内仅存 3 条（T15e，FL-01） |
| Stale 过期 | 生成后改选项 | 黄条出现 + readout「已过期」+ 展示层即时重绘 26/0（T17a/T17b）；**换图不触发过期（Q1）** |

---

## 六、专项核对：换图失效边界（USER_FLOW 旅程 2 ⚠ 项）

逻辑评审（USER_FLOW §旅程 2 / UF-01/PL-04）指出旧版「换图后结果不失效」。本轮实测 V1 原型：

| 步骤 | 实测结果 | 判定 |
|------|----------|------|
| 生成后换图（logo-800x600） | 预览与 fileInfo 更新为新文件；**旧结果区仍显示、下载按钮仍可用** | ✅ 旧版行为照旧模拟（与 USER_FLOW 记载一致） |
| 换图后过期判定 | stale=false、readout 仍「已生成」（configKey 只含平台+选项，不含文件） | ✅ 照旧模拟正确；⚠ 但无行内标注、STATE_MACHINE 无该转移（→Q1） |
| 换图后直接下载 | 弹层仍按当前配置组包 26+8（模拟层无真实文件语义，与旧版「用新图组包」等价呈现） | ✅ 可用 |
| 换图后自觉重新生成 | 结果刷新、无黄条、readout「已生成」 | ✅ |

**结论：原型的确模拟了「换图后结果不失效」这一旧版行为**（模拟正确），缺口仅在标注与规格层面（Q1，P3）。

---

## 七、数据与 DS 一致性（Level 3 附加）

**§10 数据真实性**：ICON_TEMPLATES 与 `web/public/js/iconSizes.js` 脚本化双源比对——五平台条目数 15/11/10/10/11、**57 项 size/name 逐项全等**；Config 四键（createSubFolders/prefixFilename/createContentsJson/createAdaptiveIcons）+ 默认值（true/false/true/true）与 REVERSE §⑦实体 3 一致；selectedPlatforms 默认 ['iOS','Android']；Notification {message,type,duration=0 常驻} 与实体 5 一致；FileMeta {name,type,size,width,height} 与 STATE_MACHINE §3 一致。字段命名 3 处偏差见 Q6。ZIP 数值对账全中：iOS+Android 26+8=34、五平台 57+10=67（3 json+7 xml）、扁平+前缀 26+0 且文件名 `ios-`/`android-` 前缀（B6c/B7c），与 GUIDELINES §4.2 对账表逐格一致。

**§13 组件统一**：COMPONENT.md 20 组件的 33 个类族全部「CSS 有定义 + HTML 有使用」（脚本核对，0 缺失）；Card 结构（card/card-header/card-body ×3）、Button 三变体（primary×10/secondary×6/success×6 次引用）、FeatureCard 跨页复用（PAGE001×3+PAGE003×6，PG-04 统一基线下同构）。无第二套同类解法。

**§14 Token**：:root **54 变量**与 TOKEN.md 值逐一全等（含 §1.2 补充色 7 项；rgba 书写空格差异等价）；--color-primary-deep 按 TOKEN.md 明示「不另设」未定义；缺字重 2 token（Q5）；残留硬编码 1 条产品 UI 规则（Q4）+ 工具层豁免项（TOKEN.md 注记）。旧页色板（#0f6bff/#4361ee）已按映射收敛至 #4a7bff 基线（静态扫描未见旧色值）。

**§12 架构一致性**：`state` 单一会话态源 + `configKey()/buildZipModel()` 派生态 + init() 统一事件绑定（resetBtn 仅绑定一次）——与 STATE_MACHINE §1 分层（会话态/派生态/局部 UI 态/静态常量）和 §2 S1-S6 状态机一一对应（readout 可观测 S4/S5/S5_Stale）；无页面内直接改业务状态的旁路。原型口径明示「JSZip 为模拟打包层」（FL-02 架构项移交 P7）。

**§15 代码质量**：内嵌 JS 提取 36,709 字符 `node --check` **通过**（v0 同法 29,245 字符通过）；零外链（src/href 正则 0 命中、无 `<link>`/`<img>`）；http 服务 200、file 直开不受影响；4 轮隔离动态走查 **console 0 error / 0 pageerror**；`window.state/notify/showPage` 可观测钩子在位。

---

## 八、v0-old 快检

| 检查 | 结果 | 证据 |
|------|------|------|
| HTTP 可打开 | ✅ 200 | `curl http://127.0.0.1:8303/v0-old/app-prototype.html` |
| 页面数 | ✅ 3（page001/002/003） | 与 HTML_V0_ACCEPTANCE §2.1「3/3」口径一致 |
| console | ✅ 0 error（headless） | 上传→生成→下载主线全程 0 报错 |
| 主线 smoke | ✅ | PAGE002 切换（地址栏 /tool/）→ dropArea 打开模拟文件库 **6 项**（V0 验收 §2.3 口径 ×6）→ 上传 fileInfo 三段格式 → 生成结果显示 → ZIP 弹层（.show）含 34 文件清单 |
| 静态 | ✅ | node --check 通过；零外链 |
| 归位 | ✅ | prototype/v0-old/app-prototype.html（86,271 字节），报告口径未受 v1 迁移影响 |

**v0-old 快检结论：PASS——可打开、行为与 HTML_V0_ACCEPTANCE 记载口径一致，无需复验全量。**

---

## 九、环境说明与干扰记录

1. **测试服务**：`python3 -m http.server 8303`（服务 prototype/ 根，v1-new 与 v0-old 均 200）。验收完成后已关闭。
2. **共享浏览器干扰**：本机 Playwright MCP 浏览器同时被其他会话占用（并存 TermForge/Steering-BLE/RedisPilot/BatchImageStudio 标签页），首轮 2 次调用出现上下文漂移（evaluate null / 页句柄指向 8301 标签）。**处置**：改用隔离 headless Chromium（本地 Playwright 驱动）重跑全部用例——本报告全部动态证据均出自隔离运行，与原型本身无关（同类干扰在 V1_ACCEPTANCE D3 亦有记载）。
3. **favicon 404**：共享浏览器会话中 `GET /favicon.ico` 404（服务器目录无该文件）——临时服务环境噪音，headless 隔离运行不请求 favicon 故 console 为 0；与历次验收口径一致，维持不修。
4. **测试脚本自误 2 处**（非原型缺陷，如实记录）：Round A 通知类型正则误匹配 "notification-item"（详情字符串已证明 success 通知在位）；Round C 首跑汉堡用例未先缩窄视口（按钮 <768px 才显示，属规格正确行为），改 500px 视口后通过。另 v0 弹层树无 "(Npx)" 后缀导致首轮正则未命中（改按 .show+34 计数核验）。

---

*报告日期：2026-09-03 · 验收人：产品测试负责人（隔离 Playwright 4 轮 ~77 项断言 + 脚本化静态扫描；本轮零文件修改，唯一产出本报告）*
