# IconGen 错误码规格（ERROR_CODE）

> 第一部分：旧项目错误处理现状盘点（全部错误路径与文案，来源源码）；第二部分：V1 错误码规范建议（源自 `docs/08_development/API_SPEC.md` §0 的 ErrorCode 定义，非新增设计）。编写日期：2026-09-03。

---

## 1. 现状错误处理盘点（旧版实际行为）

### 1.1 web 端（PAGE002）——通知条四态 + console.error，无错误码

现状：所有错误经 `showNotification('error', 文案)` 右下角通知呈现（单条覆盖制，`main.js:445-469`），同时 `console.error`；**无结构化错误码、无 error 对象标准化**（来源：`docs/01_reverse/REVERSE_ANALYSIS.md` ④；`docs/product-review/USER_FLOW_REVIEW.md` §三）。

| # | 场景 | 用户可见文案（原文） | 触发位置 | 备注 |
|---|---|---|---|---|
| E1 | 非图片文件 | 「请选择有效的图像文件」 | `main.js:193-196` | 类型校验 |
| E2 | 文件超 5MB | 「文件大小不能超过5MB」 | `main.js:199-202` | 阈值 5*1024*1024 |
| E3 | 图像解码失败 | 「处理图像时出错: 图像加载失败」 | `main.js:235-238` | loadImage reject |
| E4 | 生成前置不满足 | 「请选择图像并至少选择一个平台」 | `main.js:245-247` | 无文件或无平台 |
| E5 | 生成过程抛错 | 「生成图标时出错: {msg}」 | `main.js:283-286` | 含「不支持的平台: {platform}」 |
| E6 | 下载前置不满足 | 「没有可供下载的图标」 | `main.js:351-353` | 无文件点下载 |
| E7 | ZIP 组包失败 | 「创建ZIP文件时出错: {msg}」 | `main.js:398-402` | 含「JSZip库未加载」（FL-02） |
| W1 | 非正方形警告 | 「警告：图像不是正方形，可能会导致图标变形」（5 秒） | `main.js:226-228` | warning 不阻断；⚠ FL-01 被后发 success 覆盖 |

信息态：常驻 info「正在生成图标，请稍候...」「正在准备下载...」；成功态：success「图像已成功加载」「图标已成功生成，可以下载」「下载已开始」「应用已重置」（来源：REVERSE_ANALYSIS ④ PAGE002 全部操作路径）。

已知缺口（评审登记）：
- 系统失败有通知无下一步指引（不指引重试/换图/换浏览器）（USER_FLOW_REVIEW §三 2）。
- 生成中无防重入（UF-02）、无任务态（ST-01）——异常与并发不可预期。
- 环境失败（旧浏览器无 Canvas/File API、CDN 不可达）无提前检测（UF-05/FL-02）。

### 1.2 desktop 端——通知 + console，异常分支零散

| # | 场景 | 行为 | 来源 |
|---|---|---|---|
| D1 | 打开图片失败 | error 通知（renderer.js 打开路径 catch） | `desktop/src/renderer/renderer.js` |
| D2 | 生成失败 | error 通知，按钮恢复 | `renderer.js` 生成路径 catch |
| D3 | 导出失败 | error 通知（fs 写入异常向上抛） | `iconGenerator.js` export 路径 |
| D4 | 导出覆盖 | **无错误亦无确认**：fs.writeFileSync 直接覆盖同名文件（UF-04） | `iconGenerator.js:224` |

来源：`docs/product-review/USER_FLOW_REVIEW.md` §一流程 5；REVERSE_ANALYSIS ②。

### 1.3 无全局错误机制

无 window.onerror/unhandledrejection 捕获、无错误边界、无落盘日志（仅 console.error，DS-06 D 类照旧）（来源：`docs/product-review/DATA_STORAGE_REVIEW.md` 表 #9；STATE_REVIEW）。

## 2. V1 错误码规范建议（源自 API_SPEC §0，非本文新增）

### 2.1 统一错误对象

所有 Service 接口 reject/throw `AppError { code: ErrorCode; message: string }`；message 取自文案枚举（`docs/07_design_system/GUIDELINES.md` §4.3），不得意译（来源：API_SPEC §0）。

```ts
type ErrorCode =
  | 'FILE_INVALID_TYPE'      // 请选择有效的图像文件
  | 'FILE_TOO_LARGE'         // 文件大小不能超过5MB
  | 'IMAGE_DECODE_FAILED'    // 处理图像时出错: 图像加载失败
  | 'PRECONDITION_FAILED'    // 请选择图像并至少选择一个平台 / 没有可供下载的图标
  | 'PLATFORM_UNSUPPORTED'   // 不支持的平台: {platform}
  | 'ZIP_BUILD_FAILED'       // 创建ZIP文件时出错: {msg}
  | 'PERMISSION_DENIED';     // 文件读取权限被拒（V1 预留，旧版无此分支）
```

### 2.2 现状→错误码映射

| 现状项（§1.1） | ErrorCode | 说明 |
|---|---|---|
| E1 | FILE_INVALID_TYPE | 校验前置 |
| E2 | FILE_TOO_LARGE | 校验前置 |
| E3 | IMAGE_DECODE_FAILED | FileReader/onerror → reject（PAGE_SPEC §4 文件读写异常行） |
| E4 | PRECONDITION_FAILED | canGenerate 派生态拦截（V1 收敛为单一判定，修 ST-02 两处表达式不一致） |
| E5 | PLATFORM_UNSUPPORTED / 传播 | 不支持平台名单独码；其余生成异常归入传播错误 |
| E6 | PRECONDITION_FAILED | 同码不同文案，按枚举区分 |
| E7 | ZIP_BUILD_FAILED | JSZip 未加载为其中一种 cause（ADR-2 内置化后消除） |
| （无） | PERMISSION_DENIED | V1 预留：File API 拒绝分支（原型场景库已演示） |

### 2.3 配套规范（均引自既有 P7/V1 决策）

1. 常驻 loading 通知必须有终态清除路径（成功/失败均清）——防永久 loading（STATE_MACHINE §5）。
2. 异常路径状态回退：S4→S2、S6→S5（STATE_MACHINE §5）。
3. 通知队列 ≤3 条并存，常驻项可定向清除（dismiss(id)，B/FL-01）。
4. 契约测试断言：非图片/超限/损坏三类 error 文案逐字断言（API_SPEC §8）。
5. desktop（若 C-4 保留）：导出覆盖前检测冲突（UF-04）与 IPC 参数校验（PM-02）错误路径需补错误码定义（建议随桌面壳决策细化【待定】）。
