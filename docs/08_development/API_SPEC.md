# IconGen 本地能力契约（API_SPEC.md，P7）

> 本产品纯前端、零后端（SYSTEM_ARCH.md ADR-1），不存在 HTTP API。本文定义**本地能力契约**：UI 层可调用的服务接口（函数签名 + 行为 + 错误 + 来源）。服务清单来自 product-review §4.3（S-01~S-06）。签名用 TypeScript 表达（建议渐进引入，仅领域层强制）。

---

## 0. 契约总表

| 服务 | 接口数 | 旧版对应 |
|---|---|---|
| TemplateService（S-01） | 3 | iconSizes.js 常量直接访问 |
| FileService（S-03） | 3 | main.js:191-239,476-484 散落逻辑 |
| ImageService（S-02） | 5 | imageProcessor.js |
| ZipService（S-04） | 3 | fileUtils.js |
| DownloadService（S-06） | 1 | main.js:377-393 内联 |
| NotifyService（S-05） | 3 | main.js:445-469 |

通用错误类型：所有接口 reject/throw `AppError { code: ErrorCode; message: string }`；message 取自文案枚举（guidelines §4.3），不得意译。

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

## 1. TemplateService 尺寸模板服务（S-01）

来源：`web/public/js/iconSizes.js`（常量）；V1 包装为查询接口并保持数据不变。

```ts
interface TemplateService {
  /** 平台枚举与顺序 */
  getPlatforms(): PlatformKey[];                                  // ['iOS','Android','macOS','Windows','watchOS']
  /** 单平台模板（iOS 15 / Android 11 / macOS 10 / Windows 10 / watchOS 11） */
  getSpecs(platform: PlatformKey): readonly PlatformIconSpec[];
  /** 平台资源配置（目录结构/附加文件开关） */
  getPlatformConfig(platform: PlatformKey): PlatformConfig;
}
```
- 纯函数、同步、无副作用；数据与 guidelines §4.1 逐项一致（比对测试锁定）。

## 2. FileService 文件服务（S-03）

来源：`main.js:191-239`（校验）、`main.js:476-484`（格式化）。

```ts
interface FileMeta { name: string; type: string; size: number; width: number; height: number; }

interface FileService {
  /** 校验：非 image/* → FILE_INVALID_TYPE；>5MB → FILE_TOO_LARGE（阈值 5*1024*1024） */
  validate(file: File): AppError | null;
  /** 解码获取宽高；解码失败 → IMAGE_DECODE_FAILED；权限拒绝 → PERMISSION_DENIED */
  readMeta(file: File): Promise<FileMeta>;
  /** 大小格式化：B / KB / MB 两位小数 */
  formatSize(bytes: number): string;                              // '245.76 KB'
  /** 信息行格式（照旧） */
  formatInfoLine(meta: FileMeta): string;                         // '文件名: x | 大小: y | 尺寸: WxHpx'
  /** 正方形判断（warning 用，不阻断） */
  isSquare(meta: FileMeta): boolean;
}
```

## 3. ImageService 图像服务（S-02）

来源：`web/public/js/imageProcessor.js:5-297`（loadImage/isSquare/generatePlatformIcons/reset）。

```ts
interface ImageService {
  /** 载入（objectURL）；失败 IMAGE_DECODE_FAILED */
  load(file: File): Promise<{ width: number; height: number }>;
  /** 逐平台生成全部尺寸 PNG（Canvas drawImage 拉伸 → toBlob），透传 spec 附加字段 */
  generatePlatformIcons(platform: PlatformKey,
    onProgress?: (done: number, total: number) => void): Promise<GeneratedIcon[]>;
  /** 平台不存在 → PLATFORM_UNSUPPORTED */
  reset(): void;
  dispose(): void;
}
```
- V1 变更：新增 `onProgress`（B/FL-03 平台级进度）；生成结果缓存于 Store（B/FN-09），下载阶段不再调用本接口重复生成（旧版 main.js:359-365 每次下载全量重算，废除）。
- 绘制行为照旧：`ctx.drawImage(image, 0, 0, size, size)` 直接拉伸（含小图放大的既有行为，无最小尺寸校验——照旧，reverse-analysis 流程 3）。

## 4. ZipService 打包服务（S-04）

来源：`web/public/js/fileUtils.js`（createContentsJson/createAndroidAdaptiveIconFiles/createZipFile）。

```ts
interface ZipOptions { createSubFolders: boolean; prefixFilename: boolean;
                       createContentsJson: boolean; createAdaptiveIcons: boolean; }

interface ZipService {
  /** 组包规则模型（目录树/计数），供结果区预览与下载共用（B/PG-01） */
  buildModel(platforms: PlatformKey[], options: ZipOptions): ZipModel;
  /** 生成真实 ZIP Blob（JSZip 构建期内置依赖，ADR-2） */
  buildZip(icons: Record<PlatformKey, GeneratedIcon[]>,
           options: ZipOptions): Promise<Blob>;   // 失败 → ZIP_BUILD_FAILED
}
```

规则契约（guidelines §4.2，锁定不变式）：
1. 子文件夹模式路径：`{platform}/...`（iOS/macOS/watchOS → `Assets.xcassets/AppIcon.appiconset`；Android → `res/mipmap-*`；Windows → `Assets`）。
2. 扁平模式：basePath=''；`prefixFilename` 仅此时给文件名加 `{platform.toLowerCase()}-` 前缀。
3. 资源文件：Contents.json（Apple 系 × createContentsJson × 子文件夹模式）；`values/ic_launcher_background.xml` + 每密度 `mipmap-*/ic_launcher.xml`（Android × createAdaptiveIcons × 子文件夹模式）。Windows 无。
4. Contents.json：images[]（size=floor(size/scale)、idiom、filename、scale、role?、subtype?）+ info{version:1, author:'Icon Generator'}。
5. 条目数对账：默认配置 34；全平台 67（回归断言）。

## 5. DownloadService 下载服务（S-06）

来源：`main.js:377-393`（blob → a[download] → revokeObjectURL）。

```ts
interface DownloadService {
  /** 触发浏览器下载 'app-icons.zip'；100ms 后 revokeObjectURL（照旧） */
  saveBlob(blob: Blob, filename?: string): void;
}
```

## 6. NotifyService 通知服务（S-05）

来源：`main.js:445-469`；V1 队列化（B/FL-01）。

```ts
interface NotifyService {
  /** 入队并展示；duration 默认 3000ms，0=常驻；返回 id；队列上限 3（挤掉最旧） */
  notify(type: 'info'|'success'|'error'|'warning', message: string, duration?: number): number;
  /** 定向清除（用于常驻 loading 终态） */
  dismiss(id: number): void;
}
```

## 7. 页面间导航契约（非 HTTP）

| 导航 | 契约 |
|---|---|
| PAGE001 → PAGE002 | 站内链接 `/tool/`（真实部署为路由跳转；原型内为面板切换） |
| PAGE003 → 网页版 | 新窗口 `/tool/` |
| PAGE003 → 桌面下载 | 新窗口 Gitee releases tag 3.0.0（外链，V1 保留；可用性【未知】照旧） |
| 工具页 → 主页 | V1 新增 header 品牌回链（B/PG-03） |

## 8. 契约测试清单（Vitest 断言来源）

1. TemplateService：五平台条目数 15/11/10/10/11；Windows 含 24×24 与 StoreLogo 200（README 勘误基线）。
2. FileService：非图片/超限/损坏三类 error 文案逐字断言。
3. ZipService.buildModel：默认 34、全平台 67、扁平+前缀 26（iOS+Android）且全部带 `ios-`/`android-` 前缀、关 json/xml 后资源 0。
4. Contents.json：15 条 images、marketing 条目 idiom=ios-marketing、info.author='Icon Generator'。
