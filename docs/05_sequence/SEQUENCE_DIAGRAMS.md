# IconGen 时序图集（SEQUENCE_DIAGRAMS）

> 6 张 sequenceDiagram，覆盖 web 上传→生成→下载、desktop 生成导出、Android 自适应图标 XML 生成、zip 打包、生成失败路径。参与者与消息内容改写自 `docs/01_reverse/REVERSE_ANALYSIS.md` ④、`docs/08_development/DATA_MODEL.md` §3、`docs/08_development/API_SPEC.md` 及 `docs/product-review/` 各评审（源码行号出处见各文）。编写日期：2026-09-03。

---

## SD-1 web 上传 → 校验 → 预览（F001-F007）

```mermaid
sequenceDiagram
    participant U as 用户
    participant DOM as tool/index.html
    participant M as main.js
    participant IP as imageProcessor.js
    U->>DOM: 点击「选择图像」/ 拖放文件
    DOM->>M: file input change / drop(files[0])
    M->>M: 校验类型 image/*（非 → error「请选择有效的图像文件」）
    M->>M: 校验大小 ≤5MB（超 → error「文件大小不能超过5MB」）
    M->>IP: loadImage(URL.createObjectURL(file))
    IP->>IP: Image onload 取宽高
    IP-->>M: { width, height }（失败 → error「处理图像时出错: 图像加载失败」）
    M->>DOM: 预览态切换 + fileInfo「文件名|大小|尺寸」
    alt 宽≠高
        M->>DOM: warning「图像不是正方形，可能会导致图标变形」5 秒
    end
    M->>DOM: success「图像已成功加载」+ 生成按钮按平台数启用
```

来源：REVERSE_ANALYSIS ④ PAGE002「用户操作→系统响应」；`main.js:191-239`。

## SD-2 web 生成 → 结果展示（F010-F011）

```mermaid
sequenceDiagram
    participant U as 用户
    participant M as main.js
    participant IP as imageProcessor.js
    participant FU as fileUtils.js
    U->>M: 点击「生成图标」（按钮 enabled = 文件且平台>0）
    M->>M: 前置校验（不满足 → error「请选择图像并至少选择一个平台」）
    M->>M: 常驻 info「正在生成图标，请稍候...」
    loop 每个已选平台
        M->>IP: generatePlatformIcons(platform)
        IP->>IP: 逐尺寸 canvas.drawImage(image,0,0,size,size) → toBlob/toDataURL
        IP-->>M: GeneratedIcon[]（含 blob/dataURL/metadata）
    end
    M->>FU: createFileStructure(...)（⚠ 死计算 ST-03，返回值未用）
    M->>M: hideNotification → success「图标已成功生成，可以下载」
    M->>M: showDownloadSection：结果区显示平台列表 + scrollIntoView
```

来源：`main.js:244-287`；ST-03 见 `docs/product-review/STATE_REVIEW.md`。

## SD-3 web 下载 → zip 打包（F012、F020-F023）

```mermaid
sequenceDiagram
    participant U as 用户
    participant M as main.js
    participant IP as imageProcessor.js
    participant FU as fileUtils.js
    participant JZ as JSZip(CDN)
    participant BR as 浏览器
    U->>M: 点击「下载所有图标」
    M->>M: 校验 selectedFile（无 → error「没有可供下载的图标」）
    M->>M: 常驻 info「正在准备下载...」
    M->>IP: 逐平台重新生成全部图标（⚠ FN-09 全量重算）
    IP-->>M: GeneratedIcon[]
    M->>FU: createZipFile(icons, config)
    FU->>JZ: 检查库已加载（未加载 → reject「JSZip库未加载」）
    loop 每平台每尺寸
        FU->>JZ: 按路径添加 PNG（子文件夹模式 {platform}/... 或扁平+前缀）
    end
    opt Apple 系平台 × createContentsJson × 子文件夹模式
        FU->>JZ: file(...) 添加 Contents.json（images+info）
    end
    opt Android × createAdaptiveIcons × 子文件夹模式
        FU->>JZ: file(...) 添加 values/ic_launcher_background.xml + mipmap-*/ic_launcher.xml
    end
    JZ-->>FU: generateAsync → Blob
    FU-->>M: zip Blob
    M->>BR: a[download="app-icons.zip"] + click
    M->>M: 100ms 后 revokeObjectURL → success「下载已开始」
    Note over M,BR: 组包失败任一步 → error「创建ZIP文件时出错: {msg}」
```

来源：`main.js:350-403`、`fileUtils.js:266-324`；条目数对账（默认 34 / 全平台 67）见 `docs/07_design_system/GUIDELINES.md` §4.2。

## SD-4 Android 自适应图标 XML 生成（F021，含已知缺陷 PL-02）

```mermaid
sequenceDiagram
    participant M as main.js
    participant FU as fileUtils.js
    participant JZ as JSZip
    M->>FU: createAndroidAdaptiveIconFiles（Android×createAdaptiveIcons×子文件夹模式）
    FU->>FU: 组 values/ic_launcher_background.xml（背景色资源）
    FU->>JZ: file("Android/res/values/ic_launcher_background.xml", xml)
    loop mipmapDirs 各密度（ldpi…xxxhdpi）
        FU->>FU: 组 ic_launcher.xml：<adaptive><background>@color/ic_launcher_background</background>
        FU->>FU: <foreground>@${mipmapDir}/ic_launcher_foreground</foreground>（⚠ 非标准引用，应为 @mipmap/ic_launcher_foreground，PL-02）
        FU->>JZ: file("Android/res/mipmap-{density}/ic_launcher.xml", xml)
    end
    FU-->>M: 资源条目写入完成
    Note over FU: 对照：desktop 版写法为 @mipmap/ic_launcher_foreground（iconGenerator.js:343）
```

来源：`web/public/js/fileUtils.js:63-88`；PL-02 见 `docs/product-review/PRODUCT_LOGIC_REVIEW.md` §八。

## SD-5 desktop 生成与本地导出（F032）

```mermaid
sequenceDiagram
    participant U as 用户
    participant R as renderer.js
    participant MM as 主进程 main.js
    participant IG as iconGenerator.js
    participant FS as 文件系统
    U->>R: 打开图片（菜单 Cmd+O / 拖放，仅取路径）
    R->>MM: IPC get-config（electron-store 回填平台/选项/lastOutputPath）
    U->>R: 点击「生成图标」（按钮禁用防重入「生成中...」）
    R->>MM: IPC generate-icons(platforms)
    MM->>IG: generateAllIcons(imagePath, platforms)
    IG->>IG: nativeImage.createFromPath → 逐尺寸 resize → toPNG
    IG-->>MM: { size,name,folder,dataUrl,buffer }[]（⚠ 双份驻留 DS-02）
    MM-->>R: 图标列表（dataUrl 预览渲染）
    U->>R: 点击「导出」（选目录 dialog 或沿用 lastOutputPath）
    R->>MM: IPC export-icons(icons, outputPath, createSubFolders, prefixFilename)
    Note over R,MM: ⚠ createContentsJson 已传参但主进程未接收转发（FN-08）
    MM->>IG: exportIconsToDirectory(...)
    IG->>FS: fs.writeFileSync 逐条目写 PNG/Contents.json/XML（⚠ 直接覆盖 UF-04）
    FS-->>MM: 写入完成
    MM-->>R: 导出成功（success 通知 + 路径回显）
    U->>R: 点击「打开输出文件夹」
    R->>MM: IPC open-directory(dirPath)
    MM->>MM: shell.openPath(dirPath)
```

来源：`desktop/src/main/main.js`（IPC handlers）；`desktop/src/renderer/renderer.js:55-83,415,476-489`；`iconGenerator.js`（export/write 路径）；REVERSE_ANALYSIS ②。

## SD-6 web 生成失败路径（异常时序）

```mermaid
sequenceDiagram
    participant U as 用户
    participant M as main.js
    participant IP as imageProcessor.js
    participant DOM as 通知条
    U->>M: 点击「生成图标」（前置满足）
    M->>DOM: 常驻 info「正在生成图标，请稍候...」
    M->>IP: generatePlatformIcons(platform)
    alt 平台名不受支持
        IP-->>M: throw「不支持的平台: {platform}」
    else Canvas/toBlob 抛错
        IP-->>M: throw Error(msg)
    end
    M->>M: catch(err)
    M->>DOM: error「生成图标时出错: {err.message}」+ console.error
    Note over M,DOM: ⚠ 旧版无状态回退标志（无任务态 ST-01）；loading 通知由 error 替换，无永久 loading
    M->>M: 结果区保持隐藏/旧态，可重试（停留在可操作状态）
```

来源：`main.js:244-287` 异常分支；`docs/product-review/USER_FLOW_REVIEW.md` §三 2；V1 回退规则（S4→S2）见 `docs/04_architecture/STATE_MACHINE.md` §5。
