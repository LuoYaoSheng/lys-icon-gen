# IconGen 权限评审（PM）

> 评审依据：《AI 产品重构逻辑评审规范 v1.0》· 2026-09-03
> 输入文档清单：`docs/01_reverse/REVERSE_ANALYSIS.md`、`docs/02_product/PRD.md`、`docs/02_product/PAGE_SPEC.md`、`docs/06_review/PRODUCT_REVIEW.md`；源码抽查：`web/public/tool/index.html`、`web/public/js/main.js`、`web/server.js`、`desktop/src/main/{main,preload,iconGenerator}.js`、`desktop/src/renderer/renderer.js`、`desktop/package.json`、`.github/workflows/pages.yml`；grep 核验：apikey/api_key/token/secret/clipboard/permission/sandbox/webSecurity/CSP 全仓扫描。
> 只评审、不修改；「当前设计」均注明依据，无法证实标【未知】。

---

## 一、权限清单

### A. Web 侧系统权限（浏览器能力）

| 权限 | 使用情况 | 授权时机 | 评价 | 依据 |
|---|---|---|---|---|
| 文件读取（File API） | file input + drag 读取单文件 | 用户手势（点选/拖放即授权），最小化 | 合理 | `tool/index.html:39`、`main.js:65-72` |
| 下载保存 | a[download] + blob URL | 浏览器下载管理，用户可干预 | 合理 | `main.js:377-393` |
| 剪贴板 | 未使用（grep 0 命中） | — | 合理（无需） | — |
| 系统通知（Notification API） | 未使用；用页面内通知条 | — | 合理（页面内通知足够，避免系统级打扰授权） | `tool/index.html:149-153` |
| 网络 | 业务零请求；唯一外部脚本 JSZip CDN | 页面加载即隐式拉取 | 可用性与完整性风险（FL-02 + PM-05） | `tool/index.html:13` |
| 相机/麦克风/位置 | 未使用 | — | 合理 | — |

### B. Desktop 侧系统权限（Electron/OS）

| 权限 | 使用情况 | 授权/管控现状 | 评价 | 依据 |
|---|---|---|---|---|
| 文件系统读 | dialog.showOpenDialog（菜单开图）；**渲染进程直接 require('fs') 读任意路径** | 前者用户手势授权；后者无任何边界 | 失守（PM-01） | `desktop/src/main/main.js:192-207`；`desktop/src/renderer/renderer.js:272-283` |
| 文件系统写 | export-icons IPC → fs.writeFileSync 至所选目录；目录由 dialog 选择或 IPC 传入任意字符串 | 写入路径无白名单校验 | 失守（PM-01/02） | `iconGenerator.js:224`；`main.js:315-339` |
| 打开本地目录 | open-directory IPC → shell.openPath(dirPath) | dirPath 参数无校验（仅存在性检查） | 随 PM-01/02 | `main.js:342-356` |
| 打开外部 URL | shell.openExternal，目标为占位死链 | 无域名白名单 | 同源 FL-08 | `main.js:165` |
| 网络 | 无任何请求（完全离线） | — | 合理（与隐私承诺一致） | grep 0 命中 fetch/XHR |
| 剪贴板/系统通知/摄像头 | 未使用（菜单 copy/paste 为系统 role） | — | 合理 | `main.js:127-139` |
| 窗口控制 | set-compact/expanded-size、toggle-maximize IPC | — | 合理（桌面壳正常能力） | `main.js:232-241,359-369` |

### C. Electron 安全配置（应用内权限基线）

| 配置项 | 当前值 | Electron 安全基线要求 | 依据 |
|---|---|---|---|
| nodeIntegration | **true** | false（渲染层不应有 Node 能力） | `desktop/src/main/main.js:35` |
| contextIsolation | **false** | true | `desktop/src/main/main.js:36` |
| preload | 存在但自认死代码（注释：因禁用 contextIsolation 未真正起作用） | 应为唯一 IPC 通道 | `desktop/src/main/preload.js:4-5` |
| CSP | **无**（grep 全仓 0 命中 Content-Security-Policy） | 建议配置 | — |
| 渲染进程取 IPC 方式 | 直接 `require('electron')`（绕过 preload） | 仅经 contextBridge 暴露白名单 API | `renderer.js:2` |
| IPC sender 校验 | 无（所有 ipcMain.handle 不校验来源） | 校验 event.sender | `main.js:232-376` 全部 handler |

### D. 应用内权限与授权（角色/配额/API key）

| 项 | 现状 | 结论 |
|---|---|---|
| 登录/角色/配额 | 无（零登录，PRD §1 核心原则） | 合理（工具类产品无需应用内权限体系） |
| **API key 存储/授权时机** | **不存在任何 API key**：grep 全仓（apikey/api_key/api-key/token/secret）产品代码 0 命中；唯一 `id-token: write` 为 GitHub Actions OIDC 部署声明（`.github/workflows/pages.yml:11`），属 CI 平台凭据非产品密钥；产品功能为纯本地确定性尺寸缩放（Canvas/nativeImage），无 AI 或外部 API 调用 | **PM-04 结论：评审项不适用**。注意：项目名 IconGen 含「Gen」但与生成式 AI 无关，勿在文档/宣传中引入歧义；若未来引入 AI 能力（如 AI 生成图标），API key 的输入时机（用时输入 vs 持久保存）、存储位置（内存 vs electron-store/safeStorage）与清除路径需另行设计 |

## 二、权限维度结论

1. **Web 侧达标**：权限请求面最小（读一个用户选择的文件 + 触发一次下载），全部用户手势即时授权，无预授权、无后台权限——与「零上传零登录」原则自洽（`web/server.js` 仅静态服务，无后端授权面）。
2. **Desktop 侧不达标**：Electron 安全最小权限原则全面失守（C 节 6 项全红）。风险定量说明：当前渲染层仅加载本地静态 HTML（`main.js:46` loadFile），无远程内容、无用户文本注入执行面（表单值仅用于 DOM 展示），**实际可利用性低**；但一旦未来加载任何远程/半可信内容或引入 XSS，nodeIntegration 全开意味着直接 RCE（读写任意文件）。
3. **CI 侧达标**：OIDC 短时效部署令牌，无长期密钥落仓。

## 三、问题清单（PM-01 起；格式：当前设计/问题/影响/建议方向）

### PM-01 Electron 安全基线全面失守【新发现 · C（决策绑定），若保留桌面壳则升级为 B 强制项；建议升级 P4 C-4】
- **当前设计**：nodeIntegration:true + contextIsolation:false + 无 CSP + preload 死代码 + 渲染进程直接 require('fs')/'electron'（依据见 §一 C 节各行）。
- **问题**：渲染层拥有完整 Node 权限，应用内权限模型等于「全有」；与 Electron 官方安全清单全部相悖。
- **影响**：现状实际风险低（纯本地内容、无注入面），但架构性风险高——任何后续迭代引入远程内容/富文本即成 RCE 缺口；也是应用上架（如 Mac 公证/商店审核）的潜在障碍【后一点为推断，标未知】。
- **建议方向**：绑定 P4 C-4 桌面壳去留决策——①若放弃桌面壳：随仓库移除一并消解；②若保留：必须收紧为 contextIsolation:true + nodeIntegration:false + preload 白名单 API + 基础 CSP，作为保留的前置强制项（建议写入 C-4 决策清单第 5 项）。

### PM-02 IPC 通道无 sender 与参数校验【新发现 · B（随 PM-01/C-4 生效）】
- **当前设计**：全部 ipcMain.handle 不校验 event.sender；export-icons 接受任意 outputPath 直写文件系统；open-directory 接受任意 dirPath 调 shell.openPath（`desktop/src/main/main.js:315-356`）。
- **问题**：在 nodeIntegration 全开下无增量风险（渲染层本可直接 fs），但这是未来收紧的前提欠账：一旦切到 contextIsolation，这些通道即成为唯一攻击面。
- **影响**：安全收紧改造的工作量与遗漏风险。
- **建议方向**：随 PM-01 一并落地：sender 校验 + 路径参数约束（限定 lastOutputPath 祖先目录或重新走 dialog）。

### PM-03 shell.openExternal 目标无白名单且当前为占位死链【同源交叉引用 → P4 FL-08（C，随 C-4）】
- 权限视角补充：openExternal 是「以系统默认程序打开任意 URL/协议」的系统级动作，应限定 https 白名单。维持 P4 处置（换真实仓库地址），若桌面壳保留建议同时加域名白名单。

### PM-04 API key 授权时机【结论项，非问题】
- 结论与依据：本项目无 API key 存储，评审项不适用（§一 D 节）。产品纯本地、零网络调用，无授权时机设计需求。若未来引入 AI 生成能力，须新增「输入-存储-清除」三段授权设计并重新评审。

### PM-05 Web 唯一外部脚本无完整性防护【新发现 · B，扩展 P4 FL-02】
- **当前设计**：`<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js">` 无 integrity（SRI）属性，全站无 CSP（`web/public/tool/index.html:13`；grep 0 命中 CSP）。
- **问题**：P4 FL-02 只讲了 CDN 不可达的可用性降级；未讲供应链完整性——CDN 被劫持时页面将执行任意脚本（可窃取用户拖入的图片、篡改输出包）。
- **影响**：与「本地处理零上传」的隐私承诺存在被第三方脚本击穿的可能。
- **建议方向**：落实 P7 ADR-2（JSZip npm 内置、构建期打包）后风险自然消除；若 V1 过渡期仍用 CDN，至少加 SRI integrity+crossorigin 属性（一行改动）。

### PM-06 Web 无 CSP 响应头/meta【新发现 · D，随 PM-05 一并考虑】
- **当前设计**：静态站无 CSP（GitHub Pages 亦无法加响应头，只能 meta 标签）。
- **问题/影响**：JSZip 内置化后外发面为零，CSP 收益有限。
- **建议方向**：观察不动；若 V1 保持零外部资源，可不引入（避免过度设计）。

## 四、统计

- 新发现问题 4 项：B 2 项（PM-02、PM-05，均随相关决策生效）、C 1 项（PM-01，决策绑定/条件 B）、D 1 项（PM-06）；PM-04 为结论项不计数。
- 同源交叉引用 1 项：PM-03（→FL-08）。
- 核心结论：Web 权限面最小且授权时机正确；Desktop 权限面全开（PM-01/02），需在 C-4 决策中作为保留前置条件；API key 评审项不适用（无密钥、无外部调用，证据充分）。
