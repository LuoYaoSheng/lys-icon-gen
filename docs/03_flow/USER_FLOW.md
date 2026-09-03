# IconGen 用户旅程（USER_FLOW）

> 覆盖 web 端（上传→配置→生成→下载）与 desktop 端两条旅程，另含落地页转化旅程；流程图改写自 `docs/01_reverse/REVERSE_ANALYSIS.md` ⑥（源码行号出处见该文）与 `docs/product-review/USER_FLOW_REVIEW.md` §一（流程 1/2/5）。只描述旧版实际行为；评审发现的缺口以「⚠」标注并注明编号。编写日期：2026-09-03。

---

## 旅程 1：web 端首次生成下载（主场景：上传→配置→生成→下载）

最短路径 = 3 次有效交互（上传 1 + 生成 1 击 + 下载 1 击；默认 iOS+Android 已勾选、三选项已开，配置可零操作跳过）（来源：USER_FLOW_REVIEW §一流程 1；`tool/index.html:66-87` 默认值）。

```mermaid
flowchart TD
    A[访问 /tool/ 在线工具] --> B[点击 选择图像 或拖放文件]
    B --> C{文件校验}
    C -->|image/* 且 ≤5MB| D[Canvas 加载图像]
    C -->|非图片 或 >5MB| E[error 通知: 请选择有效的图像文件 / 文件大小不能超过5MB]
    E --> B
    D --> F[显示预览 + 文件信息<br/>文件名/大小/尺寸]
    F --> G{图像为正方形?}
    G -->|否| H[warning 通知 5 秒<br/>仍可继续生成]
    G -->|是| I[success 通知 图像已成功加载]
    H --> I
    I --> J[选择平台 iOS/Android 默认<br/>macOS/Windows/watchOS 可加选]
    J --> K[配置输出选项<br/>子文件夹/前缀/Contents.json/自适应图标]
    K --> L[点击 生成图标 按钮已启用]
    L --> M[常驻 info 通知 正在生成图标请稍候<br/>⚠ 无进度无防重入 FL-03/UF-02]
    M --> N[逐平台 Canvas 生成全部尺寸 blob+dataURL]
    N --> O[结果区显示已生成平台列表<br/>平滑滚动到位 + success 通知<br/>⚠ 仅平台名列表无图标预览 FN-02]
    O --> P[点击 下载所有图标]
    P --> Q[⚠ 重新生成图标再用 JSZip 组包 全量重算 FN-09<br/>按选项构建目录/Contents.json/adaptive XML]
    Q --> R[浏览器下载 app-icons.zip]
    R --> S[success 通知 下载已开始]
```

## 旅程 2：web 端临时替换图标（换图重生成场景，PRD §3 场景 2）

```mermaid
flowchart TD
    A[处于预览态 已有旧结果] --> B[点击 更换图像]
    B --> C[重新打开文件选择器]
    C --> D{选择新文件}
    D -->|取消| E[change 不触发 停留原态 FL-06 照旧]
    D -->|选中| F[新文件覆盖 selectedFile<br/>预览与信息更新]
    F --> G[⚠ 旧结果区仍显示且下载按钮可用<br/>UF-01/PL-04 换图不失效]
    G --> H{用户选择}
    H -->|自觉再点 生成图标| I[按新图重新生成 → 结果区刷新]
    H -->|直接点 下载所有图标| J[⚠ 用新图按当前平台组包<br/>所见非所得 UF-01]
    H -->|点击 重置| K[回初始态 生成按钮禁用<br/>⚠ 通知应用已重置 执行两次 FN-01<br/>平台/选项勾选保留 照旧]
```

来源：`web/public/js/main.js:191-239`（processFile 不清空 resultSection）；USER_FLOW_REVIEW §一流程 2。

## 旅程 3：desktop 端本地生成导出（Electron 桌面壳）

```mermaid
flowchart TD
    A[启动 iconsize 应用] --> B[打开图片<br/>菜单 Cmd+O 或拖放]
    B --> C[配置回填自 electron-store<br/>平台/选项/上次输出目录]
    C --> D[点击 生成<br/>按钮禁用防重入 生成中...]
    D --> E[nativeImage 逐尺寸 resize<br/>生成 PNG buffer + dataUrl]
    E --> F[生成完成 导出按钮启用]
    F --> G[选择输出目录<br/>dialog 或沿用 lastOutputPath]
    G --> H[导出落盘 fs.writeFileSync<br/>⚠ 同名文件直接覆盖无确认 UF-04]
    H --> I[success 通知 + 路径回显]
    I --> J[打开输出文件夹 shell.openPath]
    J --> K[结束]
    D -->|生成失败| L[error 通知 停留可重试]
    H -->|导出失败| L
```

来源：USER_FLOW_REVIEW §一流程 5（`desktop/src/renderer/renderer.js:55-83,415,487-489`；`desktop/src/main/iconGenerator.js:224`）；REVERSE_ANALYSIS ② 双端关系。

> desktop 与 web 的行为差异：desktop 生成期间禁用按钮（`renderer.js:415`），web 无此防护（UF-02）；desktop 配置持久化，web 刷新即失（DS-05，照旧）；desktop Contents.json 选项不生效（FN-08）。

## 旅程 4：落地页转化（PAGE003，营销路径）

```mermaid
flowchart TD
    A[访问 iconsize 落地页] --> B[浏览特性/效果/步骤/FAQ]
    A -->|立即下载| C[#download 下载区 平滑滚动]
    C --> D{选择获取方式}
    D -->|macOS DMG/Windows 安装包/Linux AppImage| E[Gitee releases tag/3.0.0 新窗口<br/>⚠ 版本固化链接 IA-03]
    D -->|网页版| F[在线工具 /tool/ 新窗口 → 旅程 1]
    A -->|联系我们 → 表单| G[⚠ 表单提交失效 F028]
    A -->|移动端汉堡菜单| H[⚠ 菜单开合失效 F029]
```

来源：`landing-page/index.html:252-296`；USER_FLOW_REVIEW §一流程 4；`docs/product-review/INFORMATION_ARCHITECTURE_REVIEW.md` §四抽查 5。

## 五要素完整性结论（摘要）

| 流程 | 开始 | 操作 | 成功 | 失败 | 返回 | 结论 |
|---|---|---|---|---|---|---|
| 1 首次生成 | ✓ | ✓ | ✓ | ✓（7 类 error） | △ 无页面级回链（PG-03） | 不达标（返回） |
| 2 换图重生成 | ✓ | ✓ | △ 旧结果不清（UF-01） | ✓ | △ | 不达标（成功语义失真） |
| 3 主页→工具→回 | ✓ | ✓ | ✓ | — | ✗ 无回链 | 不达标（PG-03） |
| 4 落地页转化 | ✓ | ✓ | △ 外链成败无回执 | ✗ Gitee 失效无兜底 | △ | 部分不达标 |
| 5 desktop 导出 | ✓ | ✓ | ✓ | ✓ | ✓ | 基本达标（UF-04 覆盖确认缺失） |

来源：USER_FLOW_REVIEW §二总表。V1 目标状态机（补 S4 生成中/S5_Stale 过期态）见 `docs/04_architecture/STATE_MACHINE.md` §2。
