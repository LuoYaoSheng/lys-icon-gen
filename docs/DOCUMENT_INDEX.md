# IconGen 文档索引（DOCUMENT_INDEX）

> 《旧 App AI 重构 SOP v2.0》编号文档体系（00_context～09_test + prototype/{v0-old,v1-new}）。登记日期：2026-09-03。`docs/product-review/`（产品逻辑评审六件套）保持原位，仅在本索引登记。

---

## 00_context 项目上下文

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [00_context/PROJECT_CONTEXT.md](00_context/PROJECT_CONTEXT.md) | 项目定位 / 仓库布局（web 与 desktop 双端）/ 构建运行方式 / 关键入口 | 本次新建（源：README、逆向报告①②、package.json×2） |
| [00_context/TECH_STACK.md](00_context/TECH_STACK.md) | 技术栈清单（web 纯前端 + Electron desktop） | 本次新建（源：package.json×2 核实） |
| [00_context/ASSET_INVENTORY.md](00_context/ASSET_INVENTORY.md) | 二进制资产与静态资源清单 | 本次新建（源：仓库 find 核实） |
| [00_context/DEPENDENCY_LIST.md](00_context/DEPENDENCY_LIST.md) | 直接依赖+用途，死依赖标注 | 本次新建（源：package.json×2 + 逆向报告⑧） |

## 01_reverse 逆向分析

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [01_reverse/REVERSE_ANALYSIS.md](01_reverse/REVERSE_ANALYSIS.md) | P1 逆向分析报告（项目概述/结构/页面/功能/流程/数据模型/依赖/未完成能力） | 迁移自 docs/reverse-analysis.md |

## 02_product 产品

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [02_product/PRD.md](02_product/PRD.md) | P2 产品需求文档（32 功能 F001-F032/页面/流程/验收标准） | 迁移自 docs/product/prd.md |
| [02_product/PAGE_SPEC.md](02_product/PAGE_SPEC.md) | P3 页面交互规格（三页 11 维度+六项特检矩阵） | 迁移自 docs/product/page-spec.md |
| [02_product/PRODUCT_MODEL.md](02_product/PRODUCT_MODEL.md) | 产品定位/用户角色/使用场景/核心价值 | 本次新建（源：PRD §1-§3、逆向报告①） |
| [02_product/FEATURE_MAP.md](02_product/FEATURE_MAP.md) | 产品能力树（F 编号→八分组） | 本次新建（源：逆向报告⑤、PRD §5） |

## 03_flow 流程

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [03_flow/USER_FLOW.md](03_flow/USER_FLOW.md) | 用户旅程 4 组（web 主流程/换图/desktop 导出/落地页转化） | 本次新建（源：逆向报告⑥、USER_FLOW_REVIEW） |
| [03_flow/PAGE_FLOW.md](03_flow/PAGE_FLOW.md) | 页面跳转关系（层级图 + 逐页出入口表） | 本次新建（源：IA_REVIEW §一、PAGE_SPEC） |
| [03_flow/BUSINESS_FLOW.md](03_flow/BUSINESS_FLOW.md) | 正常/异常/边界流程（含换图失效、生成失败、小图放大等边界） | 本次新建（源：逆向报告⑥、PRODUCT_LOGIC_REVIEW §八） |

## 04_architecture 架构

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [04_architecture/SYSTEM_ARCH.md](04_architecture/SYSTEM_ARCH.md) | P7 技术架构（总体架构/分层/选型/ADR/非功能） | 迁移自 docs/architecture/tech-architecture.md |
| [04_architecture/MODULE_ARCH.md](04_architecture/MODULE_ARCH.md) | P7 模块拆分（web/desktop/landing 三部分+旧文件去向映射） | 迁移自 docs/architecture/module-split.md |
| [04_architecture/STATE_MACHINE.md](04_architecture/STATE_MACHINE.md) | P7 状态管理（状态分层/PAGE002 状态机/Store 结构/流转规则） | 迁移自 docs/architecture/state-management.md |
| [04_architecture/DATA_FLOW.md](04_architecture/DATA_FLOW.md) | 数据流动（web Canvas 线与 desktop nativeImage 线对照） | 本次新建（源：逆向报告④⑦、DATA_MODEL §3、DATA_STORAGE_REVIEW） |

## 05_sequence 时序

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [05_sequence/SEQUENCE_DIAGRAMS.md](05_sequence/SEQUENCE_DIAGRAMS.md) | 6 张时序图（web 上传/生成/zip 打包、Android 自适应 XML、desktop 生成导出、生成失败路径） | 本次新建（源：逆向报告④、API_SPEC、DATA_MODEL §3） |

## 06_review 评审

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [06_review/PRODUCT_REVIEW.md](06_review/PRODUCT_REVIEW.md) | P4 产品体验审查（FN/PG/FL 问题 + C/M/S/CF 公共能力 + A/B/C/D 分级） | 迁移自 docs/review/product-review.md |
| [06_review/UX_REVIEW.md](06_review/UX_REVIEW.md) | UX 综合评审（操作路径/信息层级/页面职责三维度） | 本次新建（综合 PRODUCT_REVIEW + USER_FLOW_REVIEW） |
| [06_review/IA_REVIEW.md](06_review/IA_REVIEW.md) | 信息架构综合评审（层级/导航/命名/可预测性） | 本次新建（综合 INFORMATION_ARCHITECTURE_REVIEW） |

## 07_design_system 设计系统

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [07_design_system/TOKEN.md](07_design_system/TOKEN.md) | P5 设计令牌（V1 统一基线 + 旧三页色板存档 + 命名映射） | 迁移自 design-system/tokens.md |
| [07_design_system/COMPONENT.md](07_design_system/COMPONENT.md) | P5 组件库（业务 16 + 基础 4） | 迁移自 design-system/components.md |
| [07_design_system/PATTERN.md](07_design_system/PATTERN.md) | P5 交互模式 | 迁移自 design-system/patterns.md |
| [07_design_system/ASSETS.md](07_design_system/ASSETS.md) | P5 内联 SVG 图标资产 | 迁移自 design-system/assets.md |
| [07_design_system/GUIDELINES.md](07_design_system/GUIDELINES.md) | P5 使用准则与公共参数（尺寸模板全集/组包规则/枚举——唯一事实源） | 迁移自 design-system/guidelines.md |

## 08_development 开发

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [08_development/DATA_MODEL.md](08_development/DATA_MODEL.md) | P7 数据模型（7 实体 + ER + 校验规则） | 迁移自 docs/architecture/data-model.md |
| [08_development/API_SPEC.md](08_development/API_SPEC.md) | P7 本地能力契约（S-01~S-06 六服务 + ErrorCode + 契约测试清单） | 迁移自 docs/architecture/api-design.md |
| [08_development/ERROR_CODE.md](08_development/ERROR_CODE.md) | 现状错误处理盘点 + V1 错误码规范 | 本次新建（源：API_SPEC §0、逆向报告④） |
| [08_development/PERMISSION.md](08_development/PERMISSION.md) | 权限规格（Electron 安全基线现状与目标、文件写入） | 本次新建（源：PERMISSION_REVIEW + 源码） |

## 09_test 测试

| 文档 | 内容 | 来源/状态 |
|---|---|---|
| [09_test/COVERAGE_CHECKLIST.md](09_test/COVERAGE_CHECKLIST.md) | HTML 原型覆盖检查表（44/44） | 迁移自 docs/product/html-coverage-checklist.md |
| [09_test/HTML_V0_ACCEPTANCE.md](09_test/HTML_V0_ACCEPTANCE.md) | v0 旧版原型验收报告 | 迁移自 docs/product/html-acceptance-report.md |
| [09_test/V1_ACCEPTANCE.md](09_test/V1_ACCEPTANCE.md) | V1 新版原型验收报告 | 迁移自 docs/review/v1-acceptance.md |

## product-review/ 产品逻辑评审六件套（原位不动，仅登记）

| 文档 | 内容 |
|---|---|
| [product-review/PRODUCT_LOGIC_REVIEW.md](product-review/PRODUCT_LOGIC_REVIEW.md) | 产品逻辑评审总报告（整合，PL-01~PL-24 问题汇总） |
| [product-review/USER_FLOW_REVIEW.md](product-review/USER_FLOW_REVIEW.md) | 用户流程评审（UF 编号，五要素+异常三类） |
| [product-review/INFORMATION_ARCHITECTURE_REVIEW.md](product-review/INFORMATION_ARCHITECTURE_REVIEW.md) | 信息架构评审（IA 编号，层级图+可预测性抽查） |
| [product-review/DATA_STORAGE_REVIEW.md](product-review/DATA_STORAGE_REVIEW.md) | 数据与存储评审（DS 编号，数据清单生命周期五段） |
| [product-review/STATE_REVIEW.md](product-review/STATE_REVIEW.md) | 状态评审（ST 编号，状态清单与缺失态） |
| [product-review/PERMISSION_REVIEW.md](product-review/PERMISSION_REVIEW.md) | 权限评审（PM 编号，Electron 安全基线六项失守） |

## prototype/ 原型（原位不动）

| 路径 | 内容 |
|---|---|
| [prototype/v0-old/app-prototype.html](../prototype/v0-old/app-prototype.html) | v0 旧版原型（P6 归位物，单文件零外链） |
| [prototype/v1-new/app-prototype.html](../prototype/v1-new/app-prototype.html) | V1 新版原型（B 类优化落地，单文件零外链） |

## 附：迁移对照（2026-09-03 执行）

| 旧路径 | 新路径 |
|---|---|
| docs/reverse-analysis.md | docs/01_reverse/REVERSE_ANALYSIS.md |
| docs/product/prd.md | docs/02_product/PRD.md |
| docs/product/page-spec.md | docs/02_product/PAGE_SPEC.md |
| docs/product/html-coverage-checklist.md | docs/09_test/COVERAGE_CHECKLIST.md |
| docs/product/html-acceptance-report.md | docs/09_test/HTML_V0_ACCEPTANCE.md |
| docs/review/product-review.md | docs/06_review/PRODUCT_REVIEW.md |
| docs/review/v1-acceptance.md | docs/09_test/V1_ACCEPTANCE.md |
| docs/architecture/tech-architecture.md | docs/04_architecture/SYSTEM_ARCH.md |
| docs/architecture/module-split.md | docs/04_architecture/MODULE_ARCH.md |
| docs/architecture/state-management.md | docs/04_architecture/STATE_MACHINE.md |
| docs/architecture/data-model.md | docs/08_development/DATA_MODEL.md |
| docs/architecture/api-design.md | docs/08_development/API_SPEC.md |
| design-system/tokens.md | docs/07_design_system/TOKEN.md |
| design-system/components.md | docs/07_design_system/COMPONENT.md |
| design-system/patterns.md | docs/07_design_system/PATTERN.md |
| design-system/assets.md | docs/07_design_system/ASSETS.md |
| design-system/guidelines.md | docs/07_design_system/GUIDELINES.md |
