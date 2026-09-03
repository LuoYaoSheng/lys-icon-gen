# IconGen 产品体验审查报告（P4）

> 审查对象：旧项目三页面（PAGE001 主页 / PAGE002 在线工具 / PAGE003 落地页）+ Electron 桌面壳（F032，范围外注记）。
> 事实基线：`docs/01_reverse/REVERSE_ANALYSIS.md`（逆向报告）、`docs/02_product/PRD.md`、`docs/02_product/PAGE_SPEC.md`、`prototype/v0-old/app-prototype.html`（昨晚 v0 原型，P6 已归位）与项目源码（web/ desktop/ landing-page/）。
> 审查日期：2026-09-02。所有发现均注明来源文件与行号，可溯源。

---

## 0. 分级处置定义（对齐 SOP）

| 级别 | 含义 | 落地方式 |
|---|---|---|
| A | 文档勘误 | 直接修改昨晚产物文档（仅限 docs/ 下 P1-P3 新建文件）并记录；源仓库文件（如 README.md）不改，只登记勘误建议 |
| B | 体验优化 | V1 新版原型落地（P6），并在 V1 验收报告核验 |
| C | 需用户决策 | 默认不做、留档待决策（V1 中以「C 类留档」标注呈现，不实现） |
| D | 观察不动 | 记录在案，V1 照旧还原 |

---

## 1. 功能问题（重复 / 缺失入口 / 不合理流程）

| ID | 问题 | 证据来源 | 分级 | 处置 |
|---|---|---|---|---|
| FN-01 | 重置按钮双重绑定：`resetApp` 在两个 DOMContentLoaded 中各绑定一次，点击「重置」实际执行两次（两次「应用已重置」通知） | `web/public/js/main.js:87` 与 `main.js:534-538` | B | V1 单次绑定（PRD §8 F013 已定修复项） |
| FN-02 | 结果区图标网格为「孤儿功能」：`.result-tabs/.result-grid/.icon-item` 样式与 `filterResults/showPlatformResult/initTabs` 逻辑齐备，但 `showDownloadSection` 只渲染平台名列表，从不生成网格 DOM——用户看不到任何生成后的图标预览与按平台过滤 | 样式 `web/public/css/style.css:317-401`；逻辑 `main.js:331-531`；渲染实际走 `main.js:293-325` | B | V1 启用图标网格 + 平台 Tab 过滤（复用旧版已有设计意图，补全 F011 的结果可视化，不新增功能边界） |
| FN-03 | 落地页联系表单失效：JS 绑定 `#contact-form`，HTML 实为 `#contactForm`（`landing-page/index.html:441` vs `landing-page/assets/js/main.js:281`），校验与提交从未生效；且无后端承接 | 逆向报告⑤F028 | B | 按 page-spec §3「修复后规格」落地（校验必填 name/email/message → 行内标红 / 成功提示 5s + 重置，无后端仅前端反馈） |
| FN-04 | 落地页移动端菜单失效：JS 绑定 `.menu-toggle`，HTML 实为 `.mobile-menu-toggle`（`index.html:33` vs `main.js:143,164`），汉堡按钮点击无响应 | 逆向报告⑤F029 | B | 按 PRD §8 F029 修复规格落地（开合切换 + 点击菜单项后收起） |
| FN-05 | 落地页系统检测推荐下载失效：JS 查 `.download-card[data-os]`，HTML 为 `.download-option` 且无 data-os 属性（`main.js:104` vs `index.html:246-282`） | 逆向报告⑤F030 | C | 默认不做留档：是否补实现（按 UA 推荐下载卡）或砍除待用户决策；V1 不实现，以 C 类标注呈现 |
| FN-06 | 落地页扩展动效全部无宿主元素：打字机/图片预览弹窗/主题切换/复制代码/版本号填充的 JS 均存在但页面无对应元素 | `main.js:331-413,424-439,447-465` | C | 默认不做留档：是否补元素启用动效或删除死代码待用户决策；V1 不实现 |
| FN-07 | 「单个下载」入口缺失但 README 声称存在：`web/README.md:62` 写「下载生成的图标（单个下载或打包下载）」，代码仅 `downloadAllIcons` 整包 ZIP，无单图标下载 | 逆向报告⑨-4 | C | 默认不做留档：补单个下载入口属新增功能（PRD 32 项之外），是否实现待用户决策；同时登记 README 勘误建议（见 A-03） |
| FN-08 | 桌面版 createContentsJson 选项不生效：渲染进程已传参（`desktop/src/renderer/renderer.js:476-483`），主进程未接收（`desktop/src/main/main.js:315-339`），`createContentJsonFile` 无条件执行（`iconGenerator.js:184-186`）——取消勾选仍生成 Contents.json | 逆向报告⑨-2 | C | 归入桌面壳整体决策（FN-12）：若桌面壳保留，V1 桌面版必须修复为选项真实生效（web 版行为为准）；PRD §8 F020 已注明「桌面版旧 bug 不沿用」 |
| FN-09 | 下载即全量重算：点击「下载所有图标」重新逐平台 Canvas 生成全部图标再组包（`main.js:359-365`），生成结果未缓存——重复劳动，且用户在生成后修改选项/平台会造成「所见结果」与「所下载内容」不一致 | `main.js:350-403` | B | V1：生成结果缓存复用，下载直接组包；选项变更后自动标记结果过期并提示重新生成（见 P7 state-management 的 result.dirty） |
| FN-10 | 落地页 FAQ 文档超承诺：声称支持「网页图标（favicon、PWA 图标）」与「集成方式」，web/desktop 代码均无对应模板或能力 | `landing-page/index.html:344`（FAQ），逆向报告⑨-7 | B | V1 落地页 FAQ 文案按真实能力改写（仅五平台应用图标），不新增 favicon/PWA 功能（禁止私加） |
| FN-11 | 批量处理自述缺失：FAQ 自称「桌面应用每次只能处理一个图标，计划未来版本」——单一文件能力如实，但工具页未说明「一次一张」约束；上传区仅提示建议 1024×1024 | `landing-page/index.html:355-359` | D | 观察不动：V1 照旧还原（单文件流程，PRD 未列批量需求） |
| FN-12 | 桌面壳 4 项差异待决：① 尺寸模板差异（desktop Windows 无 24×24；watchOS 多 66×66/40×40、少 87×87/80×80）② Contents.json 选项 bug（FN-08）③ 品牌不一致（desktop/landing 用旧品牌 iconsize，web 用 Icon Gen）④ 桌面壳是否继续维护（Electron 25 已老） | 逆向报告⑨-3、①品牌、`desktop/package.json` | C | 默认不做留档：桌面壳去留与模板对齐方向待用户决策；P7 tech-architecture 给出【建议，待用户确认】 |

## 2. 页面问题（信息层级 / 操作路径 / 页面职责）

| ID | 问题 | 证据来源 | 分级 | 处置 |
|---|---|---|---|---|
| PG-01 | PAGE002 结果区信息层级弱：仅平台名 chip + 一句提示，无图标数/文件数/预览/目录结构，用户下载前无法核对将得到什么 | `main.js:293-325`、`style.css:476-524` | B | V1 结果区三层信息：① 平台 Tab + 图标网格（FN-02）② 文件计数（PNG 数/资源文件数）③ ZIP 目录树预览（沿用 v0 原型已验证的清单模拟） |
| PG-02 | 拖放区文案与点击行为不符：文案「拖放图像到这里或点击上传」，但 click 仅绑定在按钮上，拖放区空白处点击无响应 | `main.js:66-67`（仅 uploadBtn/changeImageBtn 绑定）；`tool/index.html:36` | B | V1：上传态下整个拖放区可点击触发文件选择（文案与行为一致；预览态不可整区点击，避免误触） |
| PG-03 | 工具页无返回主页路径：PAGE002 header/页脚均无指向 `/`（PAGE001）的链接，从主页进入工具后只能靠浏览器后退 | `web/public/tool/index.html:17-20,144-146`（无任何站内回链） | B | V1：工具页 header 增加品牌链接「Icon Gen ↩ 返回主页」（站内跳转，非新增页面） |
| PG-04 | 双主页品牌与视觉割裂：PAGE001（Icon Gen，主色 #0f6bff、ink #162033）与 PAGE002（主色 #4a7bff、Bootstrap 系灰阶）、PAGE003（iconsize，主色 #4361ee + 紫粉辅色）三套视觉语言并存 | `web/public/index.html:9-20`、`web/public/css/style.css:2-19`、`landing-page/assets/css/styles.css:2-49` | B | V1 统一 Design System tokens（以主产品工具页 #4a7bff 体系为基线，见 docs/07_design_system/TOKEN.md）；三页共用同一 token 集 |
| PG-05 | 平台选择卡无图标与规模提示：5 个平台卡仅一行文字（如「iOS」），无平台图形标识、无「将生成几个尺寸」提示，信息量低于落地页效果展示区 | `tool/index.html:66-87` | B | V1 平台卡增加：平台图标（内联 SVG）+ 图标数徽标（iOS 15 / Android 11 / macOS 10 / Windows 10 / watchOS 11，值来源 iconSizes.js） |
| PG-06 | 输出选项无后果说明：「文件名添加平台前缀」仅在非子文件夹模式生效，勾选后无任何提示，用户在子文件夹模式下勾选会误以为生效 | `fileUtils.js:135-137`（仅 !createSubFolders 时加前缀）；`tool/index.html:98-99` | B | V1：子文件夹模式开启时，前缀选项行内标注「仅在不创建子文件夹时生效」（说明性文案，不改变行为） |
| PG-07 | 落地页页脚死链成片：法律信息 4 项 + Twitter/LinkedIn/微博社交 3 项均为 `#` 死链 | `landing-page/index.html:482-516` | B | V1 落地页页脚：死链移除或标注「旧版死链，如实保留」（沿用 v0 原型处置口径，不伪造页面） |
| PG-08 | 双主页职责重叠：PAGE001（项目站导流）与 PAGE003（旧品牌营销落地页）均承担「介绍+引流」，且下载入口分别指向 Gitee releases 与 /tool/，品牌一个 Icon Gen 一个 iconsize | 逆向报告②三部分关系、③页面表 | C | 默认不做留档：landing-page 去留/合并/品牌统一方向待用户决策（与 FL-07 域名问题绑定） |
| PG-09 | PAGE001 预览卡瓦片为纯数字占位（16/32/…/1024），无真实图标渲染 | `web/public/index.html:338-349` | D | 观察不动：静态展示可接受，V1 照旧（数字瓦片） |
| PG-10 | 版权年份 2023 未更新（工具页页脚/落地页页脚） | `tool/index.html:145`、`landing-page/index.html:584` | D | 观察不动：PRD §8 已定「照旧还原」，V1 原型同步标注 2023 为旧版原貌 |

## 3. 流程问题（跳转 / 路径 / 异常处理）

| ID | 问题 | 证据来源 | 分级 | 处置 |
|---|---|---|---|---|
| FL-01 | 非正方形警告被立即覆盖：上传非正方形图先出 warning（5s），紧接着 success「图像已成功加载」单通知条后发覆盖先发，warning 实际不可见（v0 原型曾以延迟 2s 规避以便评审） | `main.js:226-234`；v0 原型 D5 | B | V1：通知改为堆叠队列（多条并存、独立计时、逐条消失），warning 与 success 不再互斥覆盖 |
| FL-02 | JSZip 为 CDN 外链，加载失败无降级：唯一外部脚本 `cdnjs jszip 3.10.1`，若 CDN 不可达，需到点击下载时才报「创建ZIP文件时出错: JSZip库未加载」 | `tool/index.html:13`、`fileUtils.js:268-270` | B | V1 架构建议：JSZip 改为构建期内置依赖（npm + 打包），消除运行时 CDN 依赖（P7 tech-architecture 落实；原型用模拟层） |
| FL-03 | 生成中不可取消、无进度：常驻 info「正在生成图标，请稍候...」，大图全平台生成期间无进度百分比、无取消入口 | `main.js:252-282` | B | V1：生成中显示「平台级进度」（如 iOS ✓ → Android 2/11…），保持不可取消照旧（生成耗时短，取消属新增功能不做） |
| FL-04 | 选项/平台变更后结果区不失效：生成完成后再改平台或选项，结果区仍显示旧平台列表，直接点下载会按新配置组包（与所见不一致，FN-09 的流程面） | `main.js:107-110,164-185` 无结果失效逻辑 | B | 与 FN-09 合并落地：结果过期标记 + 提示「配置已变更，建议重新生成」 |
| FL-05 | 拖放多文件仅取首个，无提示：drop 取 `files[0]` 处理，多余文件静默忽略 | `main.js:127-138` | D | 观察不动：行为合理（单文件工具），V1 照旧 |
| FL-06 | 文件选择器取消无反馈（change 不触发，停留原态） | page-spec §4 用户取消行 | D | 观察不动：符合平台惯例 |
| FL-07 | 落地页部署域名与去留【未知】：仓库内无任何部署配置指向 landing-page/，线上是否存在不可考 | 逆向报告③ PAGE003 行 | C | 默认不做留档：landing 部署域名/是否继续维护待用户决策（与 PG-08 绑定） |
| FL-08 | 桌面帮助菜单 GitHub 链接为占位死链 `https://github.com/yourusername/icon-generator` | `desktop/src/main/main.js:165` | C | 归入 FN-12 桌面壳决策：若保留桌面壳需替换为真实仓库地址 |

## 4. 公共能力识别（Component / Module / Service / Config 四类清单）

> 识别目的：为 P5 Design System 与 P7 模块拆分提供依据。来源均为真实代码。

### 4.1 Component（可复用业务/基础组件，12 项）

| 编号 | 组件 | 职责 | 来源 |
|---|---|---|---|
| C-01 | DropZone 拖放上传区 | 空态/预览态/拖拽悬停三态，文件入口 | `tool/index.html:29-53`、`style.css:163-237` |
| C-02 | PlatformCard 平台选择卡 | 单平台勾选卡（选中态高亮） | `tool/index.html:67-86`、`style.css:256-284` |
| C-03 | OptionSwitch 输出选项开关 | 4 输出选项复选行 | `tool/index.html:93-108`、`style.css:287-306` |
| C-04 | FileInfo 文件信息条 | 「文件名/大小/尺寸」单行信息 | `tool/index.html:46-48`、`main.js:222-223` |
| C-05 | Notification 通知条 | 四态（info/success/error/warning）右下角通知 | `style.css:432-473`、`main.js:445-469` |
| C-06 | Card 卡片容器 | card-header + card-body 通用容器 | `style.css:131-156` |
| C-07 | Button 按钮 | primary/secondary/success + disabled | `style.css:43-100` |
| C-08 | ResultTabs 结果平台 Tab | 按平台过滤结果（孤儿代码，V1 启用） | `style.css:317-341`、`main.js:331-345` |
| C-09 | IconGrid 结果图标网格 | 图标缩略图+名称+尺寸（孤儿代码，V1 启用） | `style.css:343-401` |
| C-10 | FeatureCard 能力/特性卡 | 主页 3 卡与落地页 6 卡同构 | `index.html:225-242`、landing `styles.css` .feature-card |
| C-11 | DownloadCard 下载卡 | 平台图标+名称+版本说明+按钮 | `landing-page/index.html:246-296` |
| C-12 | FaqItem FAQ 手风琴 | 问答展开/收起（互斥） | landing `main.js:257-277` |

### 4.2 Module（页面级模块，9 项）

| 编号 | 模块 | 组成 | 来源 |
|---|---|---|---|
| M-01 | 上传卡片模块 | DropZone + FileInfo + 选择/更换按钮 | `tool/index.html:23-56` |
| M-02 | 设置卡片模块 | 5×PlatformCard + 4×OptionSwitch + 生成/重置 | `tool/index.html:58-118` |
| M-03 | 结果卡片模块 | 平台列表 + 下载按钮（V1：Tab+网格+计数+ZIP 树） | `tool/index.html:120-141` |
| M-04 | 主页英雄模块 | eyebrow/H1/lead/按钮组/预览瓦片卡 | `web/public/index.html:318-351` |
| M-05 | 主页入口表模块 | 4 行 meta 表格 | `web/public/index.html:372-397` |
| M-06 | 落地页下载模块 | 4×DownloadCard + 网页版提示 | `landing-page/index.html:240-297` |
| M-07 | 落地页联系模块 | 5 联系方式 + 表单（F028） | `landing-page/index.html:380-467` |
| M-08 | 落地页 FAQ 模块 | 6×FaqItem | `landing-page/index.html:326-377` |
| M-09 | 落地页效果展示模块 | 源图→三平台尺寸预览 | `landing-page/index.html:143-185` |

### 4.3 Service（纯逻辑服务，6 项）

| 编号 | 服务 | 职责 | 来源 |
|---|---|---|---|
| S-01 | TemplateService 尺寸模板服务 | 五平台尺寸模板查询（57 项模板） | `web/public/js/iconSizes.js:5-130` |
| S-02 | ImageService 图像服务 | 加载/校验/正方形判断/Canvas 逐尺寸缩放生成 PNG | `web/public/js/imageProcessor.js:5-297` |
| S-03 | FileService 文件服务 | 类型/大小校验、大小格式化（B/KB/MB） | `main.js:191-239,476-484` |
| S-04 | ZipService 打包服务 | 目录结构组装、Contents.json、自适应 XML、ZIP 组包 | `web/public/js/fileUtils.js:6-324` |
| S-05 | NotifyService 通知服务 | 四态通知、时长/常驻控制 | `main.js:445-469` |
| S-06 | DownloadService 下载服务 | blob → a[download] 触发浏览器下载 | `main.js:377-393` |

### 4.4 Config（配置与常量，5 项）

| 编号 | 配置 | 内容 | 来源 |
|---|---|---|---|
| CF-01 | ICON_SIZES 平台尺寸模板 | 五平台 57 项模板（15+11+10+10+11） | `iconSizes.js:5-83` |
| CF-02 | PLATFORM_CONFIGS 平台资源结构 | assetsDir/iconsetDir/resDir/mipmapDirs 等 | `iconSizes.js:104-130` |
| CF-03 | 导出默认 Config | createSubFolders:true / prefixFilename:false / createContentsJson:true / createAdaptiveIcons:true；默认平台 ['iOS','Android'] | `main.js:11,35-40` |
| CF-04 | 校验阈值 | 文件 ≤5MB（5*1024*1024）、accept image/* | `main.js:192-202` |
| CF-05 | 通知文案枚举 | 七类 error 文案 + 成功/警告文案（中文原文） | `main.js` 各调用点（page-spec §2 异常处理行汇总） |

---

## 5. 分级汇总与 C 类待用户决策清单

### 5.1 分级统计

| 级别 | 数量 | 编号 |
|---|---|---|
| A（文档勘误） | 3 | A-01、A-02、A-03（见 §6） |
| B（V1 落地） | 11 | FN-01、FN-02、FN-03、FN-04、FN-09、FN-10、PG-01、PG-02、PG-03、PG-04、PG-05（PG-06、PG-07、FL-01、FL-02、FL-03、FL-04 为其配套落地项，合并计入前述 11 项的落地说明） |
| C（待用户决策，默认不做留档） | 7 | FN-05、FN-06、FN-07、FN-08+FN-12+FL-08（桌面壳合并一项）、PG-08+FL-07（landing 去留合并一项） |
| D（观察不动） | 7 | FN-11、PG-09、PG-10、FL-05、FL-06，另记录：web `css/styles.css` 与 landing 根 `styles.css` 遗留文件、`web/iconsize-web.zip` 构建产物入库（代码卫生，V1 重构时自然消除） |

> 统计口径：独立问题条目 A=3、B=11、C=5 组（7 条合并为 5 组）、D=5 条 + 2 条代码卫生 = 7。总计 26 条问题记录。

### 5.2 C 类待用户决策清单（默认不做，V1 以留档标注呈现）

| C 编号 | 决策点 | 涉及 | 默认 |
|---|---|---|---|
| C-1 | F030 系统检测推荐下载：补实现（按 UA 推荐下载卡）还是砍除死代码？ | FN-05 | 不做 |
| C-2 | F031 落地页扩展动效（打字机/预览弹窗/主题切换/复制/版本号）：补元素启用还是删除死 JS？ | FN-06 | 不做 |
| C-3 | 「单个下载」入口：README 已承诺但从未实现，补功能还是修 README？ | FN-07 + A-03 | 不做（README 勘误建议已登记） |
| C-4 | 桌面壳（Electron）去留：保留则需修复 Contents.json 选项 bug、对齐五平台模板、统一品牌、更新 Electron 版本与死链；放弃则仓库移除 desktop/。4 项差异明细见逆向报告⑨-2/⑨-3 | FN-08、FN-12、FL-08 | 不做（P7 给【建议，待用户确认】） |
| C-5 | landing-page 去留与品牌统一：与 PAGE001 双主页职责重叠、品牌 iconsize vs Icon Gen、部署域名【未知】 | PG-08、FL-07 | 不做 |

---

## 6. A 类勘误执行记录（2026-09-02 P4 执行）

| A 编号 | 勘误对象 | 错误 | 修正 |
|---|---|---|---|
| A-01 | `docs/09_test/COVERAGE_CHECKLIST.md` 首行结论 | 「37/37 项全部覆盖」计数错误：实际检查表为页面覆盖 25 项 + 功能/状态/异常 19 项 = 44 项 | 已改为「44/44（页面 25 + 功能/状态/异常 19）」，并加勘误注记 |
| A-02 | `docs/09_test/HTML_V0_ACCEPTANCE.md` §2.2 | 「F028-F031（旧版失效交互）按 PRD『修复后规格』在原型中实现为可用」失实：v0 原型实际仅实现 F028/F029（D4 亦仅记此两项），F030/F031 未实现（grep 原型无系统检测/打字机/主题切换痕迹），且 PRD 仅给出 F028/F029 修复规格 | 已改为「F028/F029 按修复后规格实现；F030/F031 未实现（属 P4 C 类待决策）」，并加勘误注记 |
| A-03 | 源仓库 `README.md` / `web/README.md`（**不修改源文件，仅登记勘误建议**） | ① 根 README 尺寸清单缺 watchOS 全段、Windows 缺 44×44 与 StoreLogo 200×200；② web README Windows 缺 24×24（代码 `iconSizes.js:58,60,66` 均有）；③ web README:62 声称「单个下载」未实现 | 勘误建议：尺寸清单以 `iconSizes.js` 为准（iOS 15/Android 11/macOS 10/Windows 10/watchOS 11）；「单个下载」措辞删除或实现后再写。因禁止修改既有源码，待用户自行修订 README。昨晚 P1-P3 文档未带入上述错误（reverse-analysis ⑨-3 已如实记录矛盾），无需回改 |

---

## 7. 与后续阶段的衔接

- P5：§4 公共能力清单 → docs/07_design_system/COMPONENT.md 组件记录表；PG-04 → TOKEN.md 统一基线。
- P6：§5.1 的 11 项 B 类优化全部在 `prototype/v1-new/app-prototype.html` 落地；§5.2 的 C 类以「C 类留档」标注呈现；F032 以差异说明卡覆盖。
- P7：S-01~S-06 → API_SPEC.md 本地能力契约；CF-01~CF-05 → DATA_MODEL.md；FL-02/FN-09/FL-04 → SYSTEM_ARCH.md 与 STATE_MACHINE.md。
