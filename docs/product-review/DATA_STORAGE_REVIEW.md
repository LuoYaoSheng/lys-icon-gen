# IconGen 数据与存储评审（DS）

> 评审依据：《AI 产品重构逻辑评审规范 v1.0》· 2026-09-03
> 输入文档清单：`docs/01_reverse/REVERSE_ANALYSIS.md`、`docs/02_product/PRD.md`、`docs/02_product/PAGE_SPEC.md`、`docs/06_review/PRODUCT_REVIEW.md`；源码抽查：`web/public/js/{main,imageProcessor,fileUtils}.js`、`desktop/src/main/{main,iconGenerator}.js`、`desktop/src/renderer/renderer.js`、`desktop/package.json`（electron-store 8）、grep 全仓（localStorage/sessionStorage/indexedDB/cookie/apikey/token/secret 均 0 命中于产品代码）。
> 只评审、不修改；「当前设计」均注明依据，无法证实标【未知】。

---

## 一、数据清单逐项表

> 生命周期五段：产生 / 传输 / 使用 / 保存 / 销毁。加密列指落盘加密。

| # | 数据项 | 分类 | 存储位置与方式 | 加密 | 应否保存（评审结论） | 生命周期五段现状 | 结论 |
|---|---|---|---|---|---|---|---|
| 1 | 用户上传源图（web） | 用户数据-临时 | 内存：File 对象 + Image + objectURL（`main.js:206-209`） | 不落盘，不适用 | 不应保存（零上传承诺） | 产生=选择/拖放；传输=无网络（本地 API）；使用=Canvas 缩放；保存=仅内存；销毁=**objectURL 永不 revoke**（换图/重置均不释放，`main.js:209` 无 revoke，`imageProcessor.js:289-297` reset 不处理 URL） | 原则正确，销毁段有泄漏（DS-01） |
| 2 | 生成图标产物（web） | 临时-任务产物 | 内存：blob + dataURL（`imageProcessor.js:231-273`），不缓存（每次下载重算，`main.js:359-365`） | 不适用 | 会话内存合理；应缓存复用（FN-09 已列） | 产生=生成；保存=不保存；销毁=刷新即失；重算=浪费 | 与 P4 FN-09 同源（DS-04） |
| 3 | ZIP 下载物（web） | 用户数据-交付物 | 浏览器下载目录（a[download]，`main.js:377-393`） | 不适用 | 应交用户保存（交付物） | 产生=组包；100ms 后 revokeObjectURL（`main.js:390-393`，销毁正确） | 达标 |
| 4 | 导出配置（web） | 配置 | 内存会话态 `config` 对象（`main.js:35-40`），刷新丢失 | 不适用 | 会话态可接受（P7 data-model §2.3 已定照旧） | 产生=默认值；使用=组包；保存=不持久；销毁=刷新 | 达标（DS-05 记录双端不一致） |
| 5 | 用户上传源图（desktop） | 用户数据-引用 | 不复制；仅保存磁盘路径，生成时 fs 读取（`iconGenerator.js:93` nativeImage.createFromPath） | 不适用 | 不复制为合理 | 产生=选择；使用=生成；不主动销毁（仅引用） | 达标 |
| 6 | 生成图标产物（desktop） | 临时-任务产物 | 内存：dataUrl + buffer **双份**驻留（`iconGenerator.js:125-139`），导出后不清空 `generatedIcons`（`renderer.js:421,435`） | 不适用 | 会话内存合理 | 销毁段缺失：导出完成不清空，直到下次生成覆盖 | 双份驻留+不清理（DS-02） |
| 7 | 导出产物（desktop） | 用户数据-交付物 | 用户所选目录落盘，`fs.writeFileSync` 覆盖写（`iconGenerator.js:224,293,327,346`） | 否（明文 PNG/JSON/XML） | 应保存（交付物） | 产生=导出；保存=用户目录；销毁=用户自理；**覆盖无确认**（UF-04） | 交付合理，覆盖行为见 UF-04 |
| 8 | 应用配置（desktop） | 配置 | electron-store → userData JSON 明文：lastOutputPath/selectedPlatforms/四开关（`desktop/src/main/main.js:252-296`） | 否 | 应保存（偏好记忆合理） | 产生=首次改动；保存=明文 JSON；无版本迁移字段；无清理机制 | 明文可接受（无敏感数据）；缺 schema 版本（DS-03） |
| 9 | 日志（web/desktop） | 日志 | 仅 console.error（`main.js` 各 catch、`desktop main.js` 各 catch），无落盘 | 不适用 | 零上传原则下不宜引入上报 | 产生=异常时；不保存 | 达标（DS-06 观察） |
| 10 | 埋点/遥测 | — | 无（全站无网络请求，web 唯一外部资源为 JSZip CDN 脚本） | — | 不应有 | 不存在 | 达标（与零上传承诺一致） |
| 11 | API key / 密钥 | — | **不存在**：grep 全仓产品代码 apikey/api_key/token/secret 0 命中；产品为纯本地确定性缩放，无任何 AI/API 调用 | — | 不适用 | 不适用 | 结论见 PM-04 |
| 12 | CI 部署凭据 | 环境配置 | `.github/workflows/pages.yml` 仅 `id-token: write`（GitHub OIDC，非产品密钥） | 平台托管 | 应保存 | 平台管理 | 达标 |
| 13 | 仓库内构建产物 | 工程卫生 | `web/iconsize-web.zip` 提交入库（P4 §5.1 D 类代码卫生已列） | — | 不应入库 | — | 同源交叉引用 |
| 14 | 未引用遗留文件 | 工程卫生 | `web/public/css/styles.css`、`landing-page/styles.css`（P1 ②已记录、P4 D 类已列） | — | 应清理 | — | 同源交叉引用 |

## 二、生命周期五段总评

- **产生**：全部数据由用户显式动作产生（上传/配置/导出），无隐性采集——达标。
- **传输**：web 无网络传输（仅 CDN 取 JSZip 脚本库，非用户数据外发）；desktop 完全离线——达标，与「零上传」承诺一致（根 `README.md` 第 21 行）。
- **使用**：web 生成结果不缓存导致下载重算（DS-04=P4 FN-09，B）；desktop dataUrl+buffer 双份全量驻留（DS-02，B）。
- **保存**：web 一律不保存（会话态，刷新即失，符合工具定位）；desktop 配置明文 JSON（可接受）+ 交付物落盘（合理）。
- **销毁**：web objectURL 不 revoke（DS-01，B）；desktop 导出后产物不清空（并入 DS-02）；无其他销毁需求。

## 三、问题清单（DS-01 起；格式：当前设计/问题/影响/建议方向）

### DS-01 objectURL 创建后永不 revoke【新发现 · B】
- **当前设计**：processFile 每次执行 `URL.createObjectURL(file)`（`web/public/js/main.js:209`），换图、重置、再次上传路径均无 `revokeObjectURL`（resetApp `main.js:408-437` 与 imageProcessor.reset `imageProcessor.js:289-297` 均不处理）。对照：ZIP 下载的 objectURL 在 100ms 后正确 revoke（`main.js:390-393`）。
- **问题**：每次换图泄漏一个 blob 引用，直到页面卸载。
- **影响**：长会话多次换图内存增长；与既有 ZIP 路径的正确做法不一致，属实现疏漏非设计意图。
- **建议方向**：loadImage resolve 后立即 revoke，或在换图/重置统一释放；V1 Store 化时纳入 dispose 路径（P7 state-management §3 已有 dispose 概念）。

### DS-02 desktop 生成产物双份驻留且导出后不清空【新发现 · B，随 P4 C-4 生效】
- **当前设计**：每个图标同时持有 dataUrl（base64 字符串）与 buffer（PNG Buffer）（`desktop/src/main/iconGenerator.js:125-139`）；`generatedIcons` 在导出成功后不清空（`desktop/src/renderer/renderer.js:435` 仅在下次生成时重置 `renderer.js:421`）。
- **问题**：五平台 57 项全量生成时内存占用约双倍（base64 较二进制再膨胀 ~33%）；导出完成后持续占用。
- **影响**：桌面应用常驻内存偏高；属资源生命周期管理缺失。
- **建议方向**：预览用 dataUrl 与导出用 buffer 二选一按需生成；导出成功后释放或置空。

### DS-03 electron-store 无 schema 版本与清理机制【新发现 · C，随 C-4 生效】
- **当前设计**：electron-store 默认 JSON（`desktop/src/main/main.js:8`），键值直接读写，无版本字段、无迁移逻辑（get-config/save-config `259-297`）。
- **问题**：未来配置结构变更无迁移路径；lastOutputPath 记录用户目录绝对路径，卸载后残留（electron-store 随 userData）。
- **影响**：低（数据非敏感）；长期演进成本。
- **建议方向**：加 schemaVersion 字段即可；**加密不必要**（不含任何密钥/个人数据，明文是合理设计——此为评审结论，非问题）。

### DS-04 生成结果不缓存、下载全量重算【同源交叉引用 → P4 FN-09（B）】
- 数据面表现：任务产物「保存」段为空，每次下载重新产生。维持 P4 处置（V1 缓存复用+过期标记，`V1_ACCEPTANCE.md` §7 已落地）。

### DS-05 web/desktop 配置持久化策略不一致【新发现 · D】
- **当前设计**：web 会话内存不持久（刷新丢平台/选项勾选）；desktop electron-store 跨会话记忆（依据：`main.js:35-40` vs `desktop main.js:259-297`）。
- **问题**：同一产品两端行为不同；但 P7 data-model §2.3 已定「V1 web 照旧不持久化」。
- **影响**：低（工具类产品会话态可接受）。
- **建议方向**：观察不动；若未来 web 侧用户强烈要求记忆偏好，再评审（届时用 localStorage 仅存四开关+平台，仍不涉敏感数据）。

### DS-06 无落盘日志【新发现 · D】
- **当前设计**：全部错误仅 console.error（web `main.js` 各 catch；desktop 两进程 console）。
- **问题/影响**：用户报障时无法提供错误线索；但零上传原则下引入落盘日志收益有限。
- **建议方向**：观察不动。error 通知已含具体 msg（`main.js:237,285,401`），可指引截图报障。

## 四、统计

- 新发现问题 5 项：DS-01（B）、DS-02（B，随 C-4）、DS-03（C，随 C-4）、DS-05（D）、DS-06（D）。
- 同源交叉引用 3 项：DS-04（→FN-09）、仓库 zip 入库与遗留 CSS（→P4 §5.1 D 类代码卫生）。
- 关键结论：**本项目不存在 API key/密钥类数据**（见表 #11，grep 依据）；用户图片数据全程不出本机、web 侧不落盘，隐私承诺与实现相符。
