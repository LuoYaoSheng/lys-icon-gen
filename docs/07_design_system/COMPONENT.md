# IconGen Design System — 组件库（P5）

> 业务组件优先：先收录 IconGen 特有业务组件（平台选择卡/尺寸模板表/拖放上传区/结果网格/ZIP 目录树等），后收录通用基础组件。每条组件记录均注明来源（旧项目真实代码）与 V1 处置（对齐 docs/06_review/PRODUCT_REVIEW.md §4 公共能力清单 C-01~C-12 与 B 类优化）。
> 样式全部消费 docs/07_design_system/TOKEN.md 的 V1 token。

---

## 0. 组件记录表（总览）

| # | 组件 | 类别 | 来源 | V1 处置 | 状态 |
|---|---|---|---|---|---|
| 1 | DropZone 拖放上传区 | 业务 | tool/index.html:29-53 + style.css:163-237 | 沿用 + B(PG-02)：上传态整区可点击 | 增强 |
| 2 | PlatformCard 平台选择卡 | 业务 | tool/index.html:67-86 + style.css:256-284 | 沿用 + B(PG-05)：平台图标 + 图标数徽标 | 增强 |
| 3 | SizeTemplateTable 尺寸模板表 | 业务 | 数据源 iconSizes.js:5-83（旧版无 UI，仅数据） | V1 新增 UI 呈现（设置卡内可展开查看所选平台将生成的全部尺寸） | 新增（数据旧有） |
| 4 | OptionSwitch 输出选项行 | 业务 | tool/index.html:93-108 + style.css:287-306 | 沿用 + B(PG-06)：前缀选项行内生效条件说明 | 增强 |
| 5 | FileInfo 文件信息条 | 业务 | tool/index.html:46-48 + main.js:222-223 | 沿用（格式不变：「文件名/大小/尺寸」） | 沿用 |
| 6 | ResultTabs 结果平台 Tab | 业务 | style.css:317-341 + main.js:331-345（孤儿代码） | B(FN-02)：V1 启用 | 启用 |
| 7 | IconGrid 结果图标网格 | 业务 | style.css:343-401 + main.js:489-531（孤儿代码） | B(FN-02/PG-01)：V1 启用（缩略图+文件名+尺寸） | 启用 |
| 8 | ZipTree ZIP 目录树 | 业务 | 规则源 fileUtils.js:236-324（旧版无预览 UI） | B(PG-01)：V1 结果区新增目录树预览（下载前核对结构） | 新增（规则旧有） |
| 9 | ResultSummary 文件计数 | 业务 | 数值可由 fileUtils 规则推导（旧版无） | B(PG-01)：V1 结果区显示「N 个图标 + M 个资源文件」 | 新增 |
| 10 | Notification 通知条 | 业务 | style.css:432-473 + main.js:445-469 | B(FL-01)：改为堆叠队列，多条并存独立计时 | 增强 |
| 11 | Card 卡片容器 | 基础 | style.css:131-156 | 沿用（card-header + card-body） | 沿用 |
| 12 | Button 按钮 | 基础 | style.css:43-100 | 沿用（primary/secondary/success + disabled） | 沿用 |
| 13 | FeatureCard 能力/特性卡 | 业务 | web index.html:225-242 + landing styles.css | 沿用（两页同构：标题 + 描述） | 沿用 |
| 14 | PreviewTiles 尺寸瓦片预览卡 | 业务 | web index.html:157-199 | 沿用（D 类 PG-09：数字瓦片照旧） | 沿用 |
| 15 | MetaTable 入口信息表 | 业务 | web index.html:244-272 | 沿用 | 沿用 |
| 16 | DownloadCard 下载卡 | 业务 | landing index.html:246-296 | 沿用；F030 推荐徽标不实现（C 类留档） | 沿用 |
| 17 | FaqItem FAQ 手风琴 | 业务 | landing main.js:257-277 | 沿用（互斥展开）+ B(FN-10)：文案按真实能力改写 | 增强 |
| 18 | Steps 步骤条 | 业务 | landing index.html:188-237 | 沿用（5 步） | 沿用 |
| 19 | FormField 表单字段 | 业务 | landing index.html:441-466 + main.js:285-320 | B(FN-03/F028)：V1 按「修复后规格」启用校验（行内标红 + 成功提示） | 启用 |
| 20 | MobileMenu 移动端菜单 | 业务 | landing index.html:33 + main.js:143,164 | B(FN-04/F029)：V1 按「修复后规格」启用开合 | 启用 |

> 组件总数 20（业务组件 16 + 基础组件 2 + 数据呈现新增 2，其中「沿用旧版」9、「增强/修复」8、「启用旧版孤儿/失效代码」3——无一是旧项目不存在的新商业功能）。

---

## 1. 业务组件详述

### 1.1 DropZone 拖放上传区（C-01）
- 结构：`drop-area > (upload-content | preview-content)` 两态互斥。
- 状态：① 空态（云上传 SVG + 「拖放图像到这里或点击上传」+ hint「建议上传1024×1024像素的PNG图像」+ 「选择图像」按钮）② 预览态（预览图 ≤200×200 contain + FileInfo + 「更换图像」）③ 拖拽悬停 `.active`（边框主色 + 5% 主色底）。
- 样式：2px 虚线边框（`--color-border`）、`--radius-md`、min-height 300px。
- V1 变更（B/PG-02）：空态整区 cursor:pointer 且点击即触发文件选择（文案与行为一致）；预览态整区不可点击（cursor:default），仅「更换图像」按钮可点。
- 来源：tool/index.html:29-53、style.css:163-237、main.js:66-72（旧版仅按钮绑定）。

### 1.2 PlatformCard 平台选择卡（C-02）
- 结构：`platform-item > input[checkbox] + label`，grid `repeat(auto-fill, minmax(150px,1fr))` gap `--space-3`。
- 状态：默认 / hover（主色 5% 底）/ `.selected`（主色边框 + 10% 底）。默认选中 iOS、Android。
- V1 变更（B/PG-05）：卡内增加平台内联 SVG 图标与图标数徽标（iOS 15 / Android 11 / macOS 10 / Windows 10 / watchOS 11，来源 iconSizes.js 条目数）。
- 来源：tool/index.html:67-86、style.css:250-284。

### 1.3 SizeTemplateTable 尺寸模板表（V1 新增 UI，数据旧有）
- 用途：所选平台的全部尺寸模板明细（尺寸/文件名/目录/倍率/说明），让「将生成什么」在生成前可见。
- 数据源：`iconSizes.js`（57 项，见 GUIDELINES.md 公共参数）；表列：尺寸(px)、文件名、输出目录、idiom/scale、中文说明。
- V1 形态：设置卡片内按平台折叠面板（复用 FaqItem 手风琴交互模式），默认收起。
- 约束：纯展示，不提供自定义尺寸编辑（旧版无此功能，禁止私加）。

### 1.4 ResultTabs + IconGrid + ZipTree + ResultSummary（结果区四件套，C-08/09 + V1）
- ResultTabs：平台过滤 Tab（全部 + 各所选平台），激活态主色底白字。
- IconGrid：`repeat(auto-fill, minmax(120px,1fr))` gap `--gap-grid-lg`；每项 = 缩略图 80×80 contain + 文件名（ellipsis 截断）+ 尺寸；hover 上浮 5px。
- ZipTree：按 fileUtils.js 组包规则渲染的目录树（iOS/Assets.xcassets/AppIcon.appiconset/…、Android/res/mipmap-*/…），含 Contents.json、自适应 XML、平台前缀与扁平模式的实时反映。
- ResultSummary：一行计数「共 N 个平台 · X 个图标 PNG · Y 个资源文件（Contents.json/自适应 XML）」。
- 来源：样式与交互意图 style.css:317-401 + main.js:331-531（旧版孤儿代码，V1 启用，B/FN-02、PG-01）。

### 1.5 Notification 通知条（C-05）
- 旧版：固定右下角（bottom:20px right:20px，<767px 通栏）、单条、后发覆盖先发、默认 3000ms、duration=0 常驻、四态配色（info `--color-info` / success `--color-success` / error `--color-danger` / warning `--color-warning` 深色文字）。
- V1 变更（B/FL-01）：堆叠队列——最多同时 3 条，自下而上排列、独立计时逐条退出；入场 translateY+opacity（沿用旧动效 token `--speed-base`）。
- 来源：tool/index.html:149-153、style.css:432-473、main.js:445-469。

### 1.6 DownloadCard 下载卡（C-11）
- 结构：平台图标 + 名称 + 适用说明 + 下载按钮（外链 Gitee releases）或「立即使用」（/tool/）。
- V1：沿用 4 卡；F030 系统推荐徽标不实现（C 类留档标注）。
- 来源：landing index.html:246-296。

### 1.7 FormField 表单字段（C-19）
- 结构：label + input/textarea + 行内错误文本（`.error-{field}`）。
- 行为（修复后规格，B/FN-03）：必填缺失 → 对应字段标红 + 行内错误文案；全部通过 → 成功提示 5s + 表单重置。无后端（纯前端反馈，如实标注）。
- 来源：landing index.html:441-466、main.js:285-320（旧版校验逻辑存在但绑定失效）。

### 1.8 MobileMenu 移动端菜单（C-20）
- 行为（修复后规格，B/FN-04）：<768px 显示汉堡按钮，点击开合导航；点击菜单项后自动收起。
- 来源：landing index.html:33、main.js:143-184（旧版选择器不匹配失效）。

## 2. 基础组件

### 2.1 Card（C-06）
- `card`（白底 + `--radius-lg` + `--shadow-card` + 纵向 `--space-5` 间距）> `card-header`（`--color-secondary` 底 + 底边框 + H2）+ `card-body`（padding `--space-4`）。来源 style.css:131-156。

### 2.2 Button（C-07）
- 基类 `.btn`：padding 0.5rem 1rem、`--radius-md`、过渡 `--speed-base`。
- 变体：primary（主色底白字，hover `--color-primary-dark`）/ secondary（`--color-secondary` 底 + #dae0e5 边）/ success（成功绿，hover 深化）；disabled：opacity .65 + not-allowed。
- 来源 style.css:43-100。

### 2.3 FeatureCard（C-10）
- 标题（strong，18px）+ 描述（`--color-gray`）；主页 3 卡 grid 三列（<860px 单列）。来源 web index.html:218-242。

---

## 3. 组件与功能映射（可溯源）

| 组件 | 支撑功能（PRD F 编号） |
|---|---|
| DropZone + FileInfo | F001-F007 |
| PlatformCard + SizeTemplateTable + OptionSwitch | F008/F009、F015-F019（模板数据展示） |
| Button(生成/重置) | F010、F013 |
| ResultTabs + IconGrid + ResultSummary + ZipTree | F011、F012、F020-F023（结构与资源文件预览） |
| Notification | F014 |
| FeatureCard/PreviewTiles/MetaTable | F024 |
| DownloadCard/FaqItem/Steps/MobileMenu | F026、F027、F029 |
| FormField | F028 |
