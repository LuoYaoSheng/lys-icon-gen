# IconGen 权限规格（PERMISSION）

> 现状 = `docs/product-review/PERMISSION_REVIEW.md`（PM 评审）+ 源码抽查结论；目标态 = 该评审建议方向 + `docs/04_architecture/MODULE_ARCH.md` §3（preload 白名单）。内容全部引自上述来源，未证实标【未知】。编写日期：2026-09-03。

---

## 1. Web 侧权限（浏览器能力）——现状达标

| 权限 | 使用情况 | 授权时机 | 结论 | 来源 |
|---|---|---|---|---|
| 文件读取（File API） | file input + drag 读取单文件 | 用户手势（点选/拖放即授权），最小化 | 合理 | `tool/index.html:39`、`main.js:65-72` |
| 下载保存 | a[download] + blob URL | 浏览器下载管理，用户可干预 | 合理 | `main.js:377-393` |
| 剪贴板 / 系统通知 / 相机/麦克风/位置 | 未使用（grep 0 命中；通知用页面内通知条） | — | 合理 | PERMISSION_REVIEW §一 A |
| 网络 | 业务零请求；唯一外部脚本 JSZip CDN | 页面加载即隐式拉取 | 可用性与完整性风险（FL-02 + PM-05：无 SRI/无 CSP） | `tool/index.html:13` |
| 登录/角色/配额/API key | 无（零登录；全仓产品代码无任何密钥，PM-04 结论：评审项不适用） | — | 合理 | PERMISSION_REVIEW §一 D |

Web 侧总评：权限请求面最小（读一个用户选择的文件 + 触发一次下载），全部用户手势即时授权，无预授权、无后台权限——与「零上传零登录」原则自洽（PERMISSION_REVIEW §二 1）。

## 2. Desktop 侧权限（Electron/OS）——现状不达标（PM-01）

### 2.1 系统权限使用现状

| 权限 | 使用情况 | 管控现状 | 来源 |
|---|---|---|---|
| 文件系统读 | dialog.showOpenDialog（菜单开图）；**渲染进程直接 require('fs') 读任意路径** | 前者用户手势授权；后者无任何边界 | `desktop/src/main/main.js:192-207`；`renderer.js:272-283` |
| 文件系统写 | export-icons IPC → fs.writeFileSync 至所选目录；目录由 dialog 选择或 IPC 传入任意字符串 | 写入路径无白名单校验；⚠ 直接覆盖同名文件（UF-04） | `iconGenerator.js:224`；`main.js:315-339` |
| 打开本地目录 | open-directory IPC → shell.openPath(dirPath) | 参数无校验（仅存在性检查） | `main.js:342-356` |
| 打开外部 URL | shell.openExternal，目标为占位死链 `github.com/yourusername/icon-generator` | 无域名白名单 | `main.js:165` |
| 网络 | 无任何请求（完全离线，grep 0 命中 fetch/XHR） | — | PERMISSION_REVIEW §一 B |
| 剪贴板/系统通知/摄像头 | 未使用（菜单 copy/paste 为系统 role） | — | `main.js:127-139` |
| 窗口控制 | set-compact/expanded-size、toggle-maximize IPC | — | `main.js:232-241,359-369` |
| 配置持久化 | electron-store 明文 JSON（lastOutputPath 绝对路径等） | 无敏感数据，明文可接受；缺 schema 版本（DS-03） | `main.js:252-296` |

### 2.2 Electron 安全配置基线对照（六项全红）

| 配置项 | 当前值 | Electron 安全基线要求 | 来源 |
|---|---|---|---|
| nodeIntegration | **true** | false | `desktop/src/main/main.js:35` |
| contextIsolation | **false** | true | `main.js:36` |
| preload | 存在但自认死代码（注释：因禁用 contextIsolation 未真正起作用） | 应为唯一 IPC 通道 | `desktop/src/main/preload.js:4-5` |
| CSP | **无**（全仓 0 命中） | 建议配置 | — |
| 渲染进程取 IPC 方式 | 直接 require('electron')（绕过 preload） | 仅经 contextBridge 暴露白名单 API | `renderer.js:2` |
| IPC sender 校验 | 无（所有 ipcMain.handle 不校验来源） | 校验 event.sender | `main.js:232-376` |

风险定级：当前渲染层仅加载本地静态 HTML（loadFile），无远程内容、无用户文本注入执行面，**实际可利用性低**；但任何后续迭代引入远程/半可信内容或 XSS，nodeIntegration 全开即直接 RCE（读写任意文件）（PERMISSION_REVIEW §二 2）。此项随 C-4 桌面壳去留决策生效，若保留则升级为 B 强制项（PL-10）。

## 3. 目标态权限规格（若 C-4 决策保留桌面壳）

来源：PERMISSION_REVIEW §三建议方向；`docs/04_architecture/MODULE_ARCH.md` §3。

1. **BrowserWindow 收紧**：`nodeIntegration: false` + `contextIsolation: true` + `preload` 作为唯一 IPC 通道（contextBridge 白名单 API）。
2. **IPC 白名单与校验**：全部 ipcMain.handle 校验 event.sender；export-icons / open-directory 的路径参数约束（限定 lastOutputPath 祖先目录或重新走 dialog）（PM-02）。
3. **基础 CSP** 配置。
4. **openExternal 域名白名单**（https + 真实仓库地址，修 FL-08 死链）（PM-03）。
5. **导出覆盖确认**：写盘前检测同名文件并确认（UF-04）。
6. electron-store 补 schemaVersion 字段（DS-03；加密不必要——不含密钥/个人数据）。

若 C-4 决策放弃桌面壳：desktop/ 整体归档移除，上述风险一并消解。

## 4. CI 侧

`.github/workflows/pages.yml` 仅 `id-token: write`（GitHub OIDC 短时效部署令牌），无长期密钥落仓——达标（PERMISSION_REVIEW §二 3）。

## 5. 文件写入权限小结（双端）

| 端 | 写入动作 | 目标 | 确认机制 |
|---|---|---|---|
| web | 无应用层写盘；仅浏览器下载管理器写 app-icons.zip | 用户下载目录 | 浏览器原生（应用层仅「下载已开始」，UF-03 C 类留档） |
| desktop | fs.writeFileSync 写 PNG/Contents.json/XML | 用户所选目录（dialog 或 lastOutputPath） | ⚠ 无覆盖确认（UF-04，目标态补） |
