# IconGen 页面交互规格说明（Page Spec）

> 对象为浏览器侧三页（PAGE001/PAGE002/PAGE003）。每页按 11 维度展开，并附六项特检矩阵。事实基线：`docs/01_reverse/REVERSE_ANALYSIS.md`。

---

## 0. 全局交互约定

1. **布局**：内容容器 max-width 1200px 居中（web 工具页 style.css `.container`）；响应式断点 ≥1200 / 768-1199 / <767 / <480，及横屏矮屏（<600px 高）。
2. **通知组件（仅 PAGE002）**：固定右下角（bottom:20px; right:20px，<767px 通栏）；四态配色 info=#17a2b8、success=#28a745、error=#dc3545、warning=#ffc107(深色文字)；默认 3000ms 自动隐藏，duration=0 常驻；同一时间仅一条（后发覆盖先发）。
3. **按钮**：btn-primary 蓝(#4a7bff)/btn-secondary 灰(#f8f9fa)/btn-success 绿(#28a745)；disabled 态 opacity .65 + not-allowed。
4. **拖放区**：2px 虚线边框；hover 与拖拽悬停(.active)时边框变主色、背景淡蓝。
5. **外部依赖策略（原型）**：零外链——JSZip 用模拟层替代；图片用占位块；字体系统字体栈。
6. **文案**：全部沿用旧项目中文文案（见各页「按钮行为」）。
7. **浏览器兼容**：现代桌面/移动浏览器（Canvas、File API、Drag API）。

---

## 1. PAGE001 项目主页

| 维度 | 规格 |
|---|---|
| PAGE-ID | PAGE001（对应 PRD §6 PAGE001、逆向报告④ PAGE001） |
| 页面目标 | 品牌展示 + 导流在线工具与源码仓库 |
| 进入条件 | 访问站点根路径 `/`；无前置条件 |
| 页面结构 | 顶栏（品牌+6 导航项）→ 英雄区（左文案+3 按钮 / 右预览卡：窗口顶栏 3 圆点 + 4×2 尺寸瓦片 16/32/64/128/180/256/512/1024）→ 能力区（#features，3 卡）→ 使用入口区（#usage，4 行表格）→ 页脚 |
| 组件列表 | 品牌标（IG 方块+Icon Gen）、导航链接组、eyebrow 标签、H1、lead 段、主/次按钮×3、预览卡、能力卡×3、meta 表格、页脚 |
| 按钮列表 | 「打开在线工具」(主)、「GitHub 源码」(次)、「Gitee 源码」(次)；导航：能力/使用/在线工具/Open/GitHub/Gitee |
| 按钮行为 | 主按钮与导航「在线工具」→ 跳转 /tool/；锚点→页内定位；GitHub/Gitee/Open→新目标外链 |
| 状态列表 | 无动态状态（纯静态） |
| 跳转关系 | → PAGE002（/tool/）；→ 外部仓库/体系页 |
| 异常处理 | 无（无脚本） |
| 数据展示规则 | 全部硬编码；预览卡瓦片为纯数字占位（旧版即如此） |

---

## 2. PAGE002 在线图标生成工具（核心）

| 维度 | 规格 |
|---|---|
| PAGE-ID | PAGE002（对应 PRD §6 PAGE002、逆向报告④ PAGE002、功能 F001-F023） |
| 页面目标 | 一张源图 → 五平台结构化图标 ZIP |
| 进入条件 | PAGE001 跳转或直访 /tool/；页面加载完成即 initApp |
| 页面结构 | header（H1「图标生成器」+副标题）→ main 三段卡片：①上传卡片（dropArea 内含 uploadContent 上传态 / previewContent 预览态互斥）②设置卡片（平台组 5 项 + 选项组 4 项 + 按钮容器）③结果卡片（默认隐藏：resultContent + download-section）→ footer → 通知条 |
| 组件列表 | 拖放区、云上传 SVG、文件选择 input(hidden, accept=image/*)、预览图、文件信息条、平台复选卡片×5（iOS/Android/macOS/Windows/watchOS）、选项复选框×4（createSubFolders/prefixFilename/createContentsJson/createAdaptiveIcons）、通知条、结果平台 chip 列表、下载按钮 |
| 按钮列表 | 「选择图像」#uploadBtn(primary)、「更换图像」#changeImageBtn(secondary)、「生成图标」#generateBtn(primary, 初始 disabled)、「重置」#resetBtn(secondary)、「下载所有图标」#downloadZipBtn(success) |
| 按钮行为 | 选择图像→file input click；更换图像→file input click；生成图标→handleGenerate（校验→逐平台 Canvas 生成→结果区渲染→滚动定位→success）；重置→resetApp（单次执行）；下载所有图标→downloadAllIcons（重生成→JSZip 组包→a[download=app-icons.zip]→success「下载已开始」）；生成按钮 disabled 逻辑=!(selectedFile && selectedPlatforms.length>0) |
| 状态列表 | S1 初始（上传态/无结果/生成禁用）；S2 已载入（预览态/生成按钮=按平台数）；S3 拖拽悬停（.active 高亮）；S4 生成中（常驻 info 通知）；S5 已生成（结果区显示+下载可用）；S6 下载中（常驻 info）；S7 重置后=S1 |
| 跳转关系 | 无页面级跳转（单页完成）；进入自 PAGE001；页脚无链接 |
| 异常处理 | 非图片→error「请选择有效的图像文件」；>5MB→error「文件大小不能超过5MB」；解码失败→error「处理图像时出错: 图像加载失败」；生成抛错→error「生成图标时出错: {msg}」；ZIP 失败→error「创建ZIP文件时出错: {msg}」；无平台点生成→error「请选择图像并至少选择一个平台」；无文件点下载→error「没有可供下载的图标」 |
| 数据展示规则 | 文件信息格式「文件名: {name} | 大小: {B/KB/MB 两位小数} | 尺寸: {W}×{H}px」；结果区列出所选平台名 chip（蓝底 #4285f4）；提示行「点击下面的按钮下载所有生成的图标 (ZIP格式)」 |

### PAGE002 交互细节补充（对齐旧版 main.js）
- 平台复选框 change → 卡片 .selected 类切换 + selectedPlatforms 重建（顺序=DOM 顺序）。
- 预览图最大 200×200（object-fit contain）。
- dropArea 上传态 cursor:pointer，预览态 cursor:default。
- 通知隐藏函数 hideNotification 在生成/下载成功路径显式调用（先清 loading 再 success）。
- 生成结果后 resultSection.scrollIntoView({behavior:'smooth'})。
- 重置不重置平台与选项勾选（仅文件/预览/结果/按钮）——照旧还原。

---

## 3. PAGE003 iconsize 落地页

| 维度 | 规格 |
|---|---|
| PAGE-ID | PAGE003（对应 PRD §6 PAGE003、逆向报告④ PAGE003、功能 F026-F031） |
| 页面目标 | 营销转化：下载桌面版 / 跳转网页版 / 收集反馈 |
| 进入条件 | 独立域名访问；无前置 |
| 页面结构 | 头部（logo+汉堡+6 导航）→ 英雄区（H1/简介/双按钮/4 平台图标/GIF/浮动装饰）→ #features 6 卡 → 效果展示区（源图→三平台多尺寸预览）→ #how-it-works 5 步 → #download 4 下载选项+网页版提示+截图+3 证言 → #faq 6 手风琴 → #contact 5 联系方式+表单 → 页脚 4 栏 |
| 组件列表 | 导航菜单、汉堡按钮（<768px 显示）、hero 按钮、平台图标组（Apple/Android/Windows/Linux）、特性卡×6、效果对比区、步骤条×5、下载卡×4（macOS/Windows/Linux/网页版）、证言卡×3、FAQ 手风琴×6、联系条目×5、表单（姓名/邮箱/主题/消息+发送按钮）、页脚 4 栏 |
| 按钮列表 | 「立即下载」(#download)、「了解更多」(#how-it-works)、下载卡按钮×4（下载 DMG/下载安装包/下载 AppImage/立即使用）、「发送消息」、FAQ 问题×6（可点击）、汉堡按钮 |
| 按钮行为 | 锚点平滑滚动（top=目标 offsetTop-80）；下载卡 1-3 → Gitee releases tag 3.0.0（新窗口）；网页版卡 → /tool/（新窗口）；FAQ → 展开/收起（互斥）；发送消息 → 校验必填（姓名/邮箱/消息）→ 成功提示 5 秒 + 重置（重开发修复：旧版未绑定）；汉堡 → 菜单开合（重开发修复：旧版未绑定） |
| 状态列表 | header.scrolled（滚动>100px）；FAQ 项 active（一次仅一个）；动画元素 animated（进入视口触发一次性入场）；菜单 active/menu-open |
| 跳转关系 | → Gitee releases（外链×3）→ /tool/（PAGE002）；页内锚点 5 组；页脚导航/联系/法律链接（旧版多为 # 死链，重开发需给出真实去向或移除） |
| 异常处理 | 表单必填缺失 → 输入框 .error 标红（重开发实现）；其余无 |
| 数据展示规则 | 全部硬编码；下载卡含平台图标+名称+适用版本说明（macOS 10.13+/Windows 10+/主流 Linux/无需下载）；证言含引号图标+文本+署名角色 |

---

## 4. 六项特检矩阵（逐页）

### 空状态 / 加载 / 错误 / 权限 / 文件读写异常 / 用户取消

| 检查项 | PAGE001 | PAGE002 | PAGE003 |
|---|---|---|---|
| 空状态 | 无数据概念（静态页） | ① 上传态（未选文件，fileInfo「未选择文件」）② 结果占位（隐藏态内建占位 SVG+「生成图标后将在这里显示」，实际不展示因为整卡隐藏） | 无数据概念；FAQ 默认全收起 |
| 加载 | 无脚本无加载态 | 图像加载：无中间 loading（同步 URL.createObjectURL→onload）；生成：常驻 info「正在生成图标，请稍候...」；下载准备：常驻 info「正在准备下载...」 | 图片加载走浏览器默认；无全局 loading |
| 错误 | 无 | 七类 error 通知（见 PAGE002 异常处理行）+ console.error | 表单校验错误（重开发实现行内标红）；旧版无全局错误机制 |
| 权限 | 无 | 无登录/角色；文件访问由浏览器 file input/drag 授权；无相机/剪贴板等敏感权限 | 同左 |
| 文件读写异常 | 无 | loadImage reject「图像加载失败」→「处理图像时出错: …」；FileReader onerror→reject；ZIP blob 生成失败→「创建ZIP文件时出错: …」 | 无文件读写 |
| 用户取消 | 无 | ① 文件选择器取消 → change 不触发，停留原态 ② 拖放 dragleave → 仅移除高亮 ③（旧版无导出目录概念，web 端无目录选择） | 下载确认/新窗口打开由浏览器处理；表单可随时放弃 |

---

## 5. 原型实现约束（针对 v0 原型；P6 已归位至 prototype/v0-old/app-prototype.html，原路径 prototype/app-prototype.html）

1. 浏览器窗口画框呈现三页，顶部评审面板可切换页面与「场景库」（正常/加载/成功/失败/空数据/异常五态场景）。
2. 每页左上角标注「PAGE00X · 对应 PRD §6 PAGE00X」。
3. JSZip 以内置模拟打包器替代：点击下载时弹出 ZIP 内容清单（目录树+文件名），并模拟触发「下载已开始」。
4. 图像上传用模拟文件库（1024 正方形 PNG / 800×600 非正方形 / 6MB 超限 / 非图片 txt / 损坏文件）与真实拖放双通道；预览用 CSS 渐变占位块。
5. 所有按钮均有真实行为（旧版失效交互在原型中按「修复后规格」呈现，并在验收报告修复项中记录）。
