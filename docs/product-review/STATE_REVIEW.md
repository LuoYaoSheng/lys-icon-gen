# IconGen 状态评审（ST）

> 评审依据：《AI 产品重构逻辑评审规范 v1.0》· 2026-09-03
> 输入文档清单：`docs/01_reverse/REVERSE_ANALYSIS.md`、`docs/02_product/PRD.md`、`docs/02_product/PAGE_SPEC.md`、`docs/06_review/PRODUCT_REVIEW.md`；源码抽查：`web/public/js/main.js`（全文）、`web/public/js/imageProcessor.js`、`desktop/src/renderer/renderer.js`（全文）、`desktop/src/main/main.js`。
> 只评审、不修改；「当前设计」均注明依据，无法证实标【未知】。

---

## 一、状态清单（现状，按载体）

### 1. web PAGE002 全局变量态（`web/public/js/main.js:9-40`）

| 状态 | 类型/取值 | 必要性 | 备注 |
|---|---|---|---|
| selectedFile | File \| null | 必要 | 源图引用 |
| imageProcessor.image / imageWidth / imageHeight | Image / number | 必要 | 解码态（`imageProcessor.js:13-18`） |
| selectedPlatforms | string[]（默认 ['iOS','Android']） | 必要 | 与 DOM checked **双份持有**（`main.js:174-185` 重建同步） |
| config（四开关） | boolean ×4 | 必要 | 与 DOM checked 双份持有（`main.js:107-110`） |
| （无）fileStructure | — | **死状态**：handleGenerate 计算后从未使用（`main.js:263-270`） | ST-03 |
| （无）任务态 | — | **缺失**：生成中无标志，防重入靠无（对照 desktop `renderer.js:415` 有禁用） | ST-01 |
| （无）结果过期态 | — | **缺失**：生成后改平台/选项/换图，结果区不失效 | P4 FL-04 + UF-01 |
| notification 单例 | DOM class + 定时器 | 必要但表达力不足：单条后发覆盖先发 | P4 FL-01 已列（V1 队列化） |

### 2. DOM 直挂态（隐式状态）

| 状态 | 载体 | 说明 |
|---|---|---|
| 上传区两态 | uploadContent/previewContent display 互斥 | `main.js:215-216,414-415` |
| 拖拽悬停 | dropArea .active | 局部态，合理 |
| 生成按钮 disabled | attribute | **两处赋值表达式不一致**（`main.js:168` vs `main.js:231`）——ST-02 |
| 结果区显隐 | resultSection display | `main.js:324,421` |
| 平台卡选中样式 | .platform-item.selected | 与 checkbox 联动，合理 |

### 3. desktop 态（`desktop/src/renderer/renderer.js:5-28`）

| 状态 | 必要性 | 备注 |
|---|---|---|
| currentImage | 必要 | |
| selectedPlatforms | 必要 | 与 electron-store 同步（saveConfig `387-400`） |
| generatedIcons | 必要 | 导出后不清空（DS-02） |
| configLoaded | 必要 | 防止配置回填触发写回 |
| isWindowExpanded | 冗余风险 | 与主进程窗口实际状态是**两份真相** |
| windowSizes（renderer:19-28） | **重复定义** | 与 `desktop/src/main/main.js:14-23` 完全重复，且 renderer `adjustWindowForImage`（`renderer.js:353-377`）会单方改写 `windowSizes.expanded.height` 后经 IPC 传回主进程——两端真相漂移路径成立 |
| platformSizes（renderer:7-13） | 重复定义 | 与主进程 ICON_SIZES（`iconGenerator.js:6-82`）第三份尺寸清单（renderer 仅用于显示），三处模板漂移已有实据（P1 ⑨-3） |

### 4. 页面局部 UI 态（不入全局，合理）

PAGE003：header.scrolled、FAQ 互斥 active、animated 入场、菜单 open（`landing-page/assets/js/main.js:17-74`）；PAGE002 通知定时器。均局部合理。

## 二、关键对象状态机文本图（现状 = 旧版实现）

```
【PAGE002 会话状态机（现状）】
[*] ──初始化──> S1_空态(上传态/生成禁用/结果隐藏)
S1 ──上传成功──> S2_已载入(预览态/生成按钮=平台数>0)
S1 ──上传失败──> S1（error 通知）
S2 ──更换图像──> S2（旧结果不清 → UF-01）
S2 ──点击生成──> [无任务态！按钮仍可点 → ST-01]
     ├─成功──> S5_已生成(平台列表+下载可用)
     └─失败──> S2（error 通知）
S5 ──改平台/选项/换图──> S5（无 stale 标记 → FL-04/UF-01）
S5 ──点击下载──> [无任务态] ──重算+组包──> S5（success「下载已开始」）
S1/S2/S5 ──重置──> S1（平台/选项勾选保留，照旧 page-spec §2）

【缺失态标注】
- S4_生成中：不存在（无 generating 标志，无进度承载 —— FL-03 进度 V1 已定）
- S5_Stale 过期态：不存在（FN-09/FL-04/UF-01 三问题共同根源）
- S6_组包中：不存在（下载期间按钮可再点，同 ST-01 风险面）

【desktop 生成任务态（对照，较 web 完整）】
[*] → idle → generating（按钮禁用+文案「生成中...」，renderer.js:415-417）
    → done（exportButton 启用）｜error（error 通知）
导出：idle → exporting（按钮禁用，「导出中...」renderer.js:471-472）→ done/error
```

P7 `STATE_MACHINE.md` §2 已给出 V1 目标状态机（S1/S2/S3/S4/S5_Stale/S6），本评审确认其与旧版缺口一一对应，方案成立。

## 三、必要性 / 重复 / 冲突 / 缺失分析

1. **必要且充分**：核心会话态（文件/平台/选项/结果）无多余全局状态；PAGE001 纯静态无状态（`page-spec §1`）。
2. **重复**：① selectedPlatforms、config 四开关 JS 与 DOM 双份持有（旧版无 Store 的结构性代价，V1 Store 化自然消除）；② desktop windowSizes 双端重复定义且存在单方改写漂移路径（ST-04）；③ 尺寸模板三份拷贝（iconSizes.js / iconGenerator.js / renderer platformSizes，P1 ⑨-3 已证漂移）。
3. **冲突**：① 生成按钮 disabled 两处表达式不一致——`main.js:168` `!(platforms>0 && selectedFile)` vs `main.js:231` `platforms.length===0`（后者在 processFile 成功路径调用，此时 selectedFile 恒非空，故行为无 bug，但同一状态两个判定源，维护冲突隐患）（ST-02）；② 通知单条覆盖 vs「warning+success 先后发出」的语义冲突（P4 FL-01 已列）。
4. **缺失**：任务态（generating/packing）、结果过期态（stale）、JSZip 可用性态（CDN 加载成败仅到下载时才发现，P4 FL-02）。
5. **死状态/死计算**：fileStructure（ST-03）；孤儿结果网格逻辑与样式（P4 FN-02 已列，V1 启用）。

## 四、问题清单（ST-01 起；格式：当前设计/问题/影响/建议方向）

### ST-01 无任务态：生成/下载过程无互斥与进度承载【新发现 · B；与 UF-02 同源，P4 未列、P7 已有方案】
- **当前设计**：web 无 generating/packing 标志，handleGenerate/downloadAllIcons 执行期间相关按钮不禁用（`web/public/js/main.js:244-287,350-403`）。
- **问题**：可并发触发两轮全平台生成；进度信息只能挤在单条通知里。
- **影响**：行为不可预期 + 性能浪费；与 desktop（有禁用）不一致。
- **建议方向**：落地 P7 state-management §2 的 S4_Generating/S6_Packing 与 §4 的 generating 拦截。

### ST-02 生成按钮 disabled 判定两处表达式不一致【新发现 · B】
- **当前设计**：`main.js:168`（handlePlatformChange）用 `!(selectedPlatforms.length > 0 && selectedFile)`；`main.js:231`（processFile 成功）用 `selectedPlatforms.length === 0`。
- **问题**：同一状态两个判定表达式，依赖调用时序巧合才不出错。
- **影响**：当前无显性 bug，但任何一处改动都可能引入不一致（例：若 processFile 提前启用按钮而文件加载失败的时序调整）。
- **建议方向**：V1 收敛为单一派生态 `canGenerate`（P7 state-management §3 已定义），删除散点赋值。

### ST-03 fileStructure 死计算【新发现 · B】
- **当前设计**：handleGenerate 调用 `fileUtils.createFileStructure(...)` 计算结构元数据（`main.js:263-270`），返回值从未被任何后续代码使用（showDownloadSection 仅消费 platforms 参数）。
- **问题**：无效计算+误导性代码（暗示结果区基于 fileStructure 渲染，实则不然）。
- **影响**：维护误导；微量性能浪费。
- **建议方向**：V1 删除；组包模型统一走 ZipService.buildModel（P7 api-design §4），供结果区预览与下载共用。

### ST-04 desktop 窗口尺寸状态双端重复定义且可单方漂移【新发现 · B，随 P4 C-4 生效】
- **当前设计**：windowSizes 在主进程（`desktop/src/main/main.js:14-23`）与渲染进程（`desktop/src/renderer/renderer.js:19-28`）各定义一份；渲染侧 adjustWindowForImage 按图片高度改写本地 expanded.height 后经 IPC set-expanded-size 传回主进程（`renderer.js:353-377`），主进程 setExpandedWindowSize 接受 customSize（`main.js:78-86`）——尺寸真相两端漂移路径成立。
- **问题**：状态双源；同构数据（尺寸模板 platformSizes）也是三份。
- **影响**：桌面端窗口行为回归困难；模板三份漂移已有实据（P1 ⑨-3）。
- **建议方向**：尺寸状态唯一归属主进程，渲染侧只读查询；模板单一来源（若 C-4 保留桌面壳则落地）。

### 同源交叉引用（P4/P7 已覆盖，不重复立项）
- FL-01 通知单条覆盖（B，V1 队列 ≤3）；FN-09/FL-04 结果不缓存不失效（B，V1 stale+缓存）；FL-03 无进度（B，V1 平台级进度）；FN-02 孤儿网格逻辑（B，V1 启用）；FN-01 重置双绑定（B，已修复并经 T7 验收）；resetApp 不重置平台/选项（D 照旧，page-spec §2）。

## 五、统计

- 新发现问题 4 项：ST-01（B）、ST-02（B）、ST-03（B）、ST-04（B，随 C-4）。
- 同源交叉引用 6 项（FL-01、FL-03、FL-04、FN-01、FN-02、FN-09）。
- 状态机结论：现状缺 S4（生成中）与 S5_Stale（过期）两个关键态；P7 目标状态机覆盖全部缺口，本评审确认其必要性成立。
