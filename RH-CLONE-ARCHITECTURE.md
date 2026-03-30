# RH.com 复刻项目 — 架构与分阶段执行方案

> **基础框架**：Medusa 官方 Storefront 2.x（Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS）
> **后端**：MedusaJS 2.x + 本地 PostgreSQL
> **运行端口**：Storefront `localhost:8000` / Medusa `localhost:9000`
> **合规边界**：不复制 RH 商标、图片、文案；使用占位素材复刻版式与交互风格

---

## 一、RH.com 全站页面结构与复刻优先级

### 1.1 页面清单与分类

| 优先级 | 类型 | 页面 | 对应路由 | 说明 |
|--------|------|------|----------|------|
| **P0 核心** | 首页 | Home | `/[cc]/(main)/page.tsx` | 全屏 Hero + 品类导航 + 编辑式内容区 + 精选商品 |
| **P0 核心** | 商品列表 | Store / Collections / Categories | `/store` `/collections/[handle]` `/categories/[...category]` | 2列网格 + 筛选 + 排序 + 分页 |
| **P0 核心** | 商品详情 | PDP | `/products/[handle]` | 左图右信息 + 变体选择 + 加购 + 折叠面板 |
| **P0 核心** | 购物车 | Cart | `/cart` | 商品列表 + 订单摘要 |
| **P0 核心** | 结账 | Checkout | `/(checkout)/checkout` | 地址 + 配送 + 支付（保留 Medusa 原生流程） |
| **P0 核心** | 导航 | Header + Mega Menu + Footer | 公共组件 | 双层 Header + 品类 Mega Menu + 4列 Footer |
| **P1 品牌** | 账户 | Account（登录/注册/订单/地址/个人资料） | `/account/*` | 改样式，保留原生逻辑 |
| **P1 品牌** | 会员 | Membership | `/membership` | 新增静态页：会员权益展示 |
| **P1 品牌** | 关于 | About | `/about` | 新增静态页：品牌故事 |
| **P1 品牌** | 设计服务 | Design Services | `/design-services` | 新增静态页 |
| **P2 辅助** | 404 | Not Found | `not-found.tsx` | 品牌化 404 |
| **P2 辅助** | 订单确认 | Order Confirmed | `/order/[id]/confirmed` | 改样式 |
| **P2 辅助** | 搜索 | Search | 可复用 `/store` | 搜索结果复用商品列表 |

### 1.2 路由地图

```
/[countryCode]/
├── (main)/
│   ├── page.tsx                          ← 首页
│   ├── store/page.tsx                    ← 全部商品
│   ├── collections/[handle]/page.tsx     ← 集合页
│   ├── categories/[...category]/page.tsx ← 分类页
│   ├── products/[handle]/page.tsx        ← 商品详情
│   ├── cart/page.tsx                     ← 购物车
│   ├── account/                          ← 账户（登录/注册/订单/地址/个人资料）
│   ├── about/page.tsx                    ← 【新增】关于
│   ├── design-services/page.tsx          ← 【新增】设计服务
│   ├── membership/page.tsx               ← 【新增】会员
│   └── order/[id]/confirmed/page.tsx     ← 订单确认
├── (checkout)/
│   └── checkout/page.tsx                 ← 结账
└── not-found.tsx                         ← 404
```

---

## 二、RH.com 设计系统规范（逆向提取）

### 2.1 颜色系统

| Token 名 | 色值 | 用途 |
|-----------|------|------|
| `qw-black` | `#000000` | 主文字、按钮填充 |
| `qw-charcoal` | `#1A1A1A` | 正文文字 |
| `qw-dark-grey` | `#333333` | 二级文字 |
| `qw-medium-grey` | `#666666` | 三级文字、说明 |
| `qw-grey` | `#999999` | 占位符、禁用态 |
| `qw-light-grey` | `#CCCCCC` | 边框、分隔线 |
| `qw-pale-grey` | `#E8E8E8` | 浅边框 |
| `qw-off-white` | `#F5F5F0` | 卡片/区块背景 |
| `qw-warm-white` | `#FAF9F6` | 页面次级背景 |
| `qw-white` | `#FFFFFF` | 页面主背景 |
| `qw-gold` | `#B8860B` | 品牌金色点缀 |
| `qw-error` | `#C41E3A` | 错误/促销红 |

### 2.2 字体系统

| 用途 | 字体族 | 字重 | 特征 |
|------|--------|------|------|
| 标题/品牌 | Cormorant Garamond（Google Fonts） | 300/400 | 衬线、优雅、大写+letter-spacing |
| 正文/UI | Helvetica Neue → Arial → sans-serif | 400/500 | 无衬线、清晰、小字号 |

**字号阶梯**（Tailwind token）：

| Token | 大小 | 用途 |
|-------|------|------|
| `micro` | 10px | 眉标、标签 |
| `caption` | 12px | 辅助说明 |
| `body` | 14px | 正文 |
| `body-lg` | 16px | 大正文 |
| `card-title` | 20px | 卡片标题 |
| `section-title` | 32px | 区块标题 |
| `hero` | 48px | 首屏大标题 |

### 2.3 间距系统

- 基准单位：4px
- Section 间距：`80px`（移动端 `48px`）
- 内容容器最大宽度：`1440px`，左右 padding `24px`（桌面 `48-80px`）
- 卡片间距：`24px`

### 2.4 动效规则

| 场景 | 属性 | 时长 | 曲线 |
|------|------|------|------|
| 按钮 hover | 颜色/背景 | 300ms | ease |
| 图片 hover | transform scale(1.03) | 800ms | cubic-bezier(0.25,0.1,0.25,1) |
| 页面路由切换 | opacity | 350ms | cubic-bezier(0.16,1,0.3,1) |
| 商品卡片入场 | opacity + translateY(28px) | 500ms | cubic-bezier(0.16,1,0.3,1) |
| 导航 hover | opacity + translateY(-2px) | 300ms | ease |
| 侧边菜单 | translateX | 500ms | cubic-bezier(0.16,1,0.3,1) |
| 购物车抽屉 | translateX | 500ms | cubic-bezier(0.16,1,0.3,1) |

### 2.5 响应式断点

| Token | 宽度 | 说明 |
|-------|------|------|
| 默认 | 0-767px | 移动端（iPhone 14 = 375px） |
| `small` | 768px+ | 平板 |
| `medium` | 1024px+ | 桌面（导航展开） |
| `large` | 1440px+ | 大桌面 |
| `xlarge` | 1680px+ | 超宽屏 |

### 2.6 圆角与阴影

- **圆角**：几乎不用圆角（0px），按钮/卡片均为直角，体现建筑感
- **阴影**：极少使用；仅在浮层（Mega Menu、抽屉）使用轻微阴影

---

## 三、保留的 Medusa 原生电商能力

以下功能 **只改样式，不改数据流/业务逻辑**：

| 能力 | 涉及模块 | 改造方式 |
|------|----------|----------|
| 商品浏览（列表/详情/变体/价格） | `products/*`, `store/*`, `collections/*`, `categories/*` | 改 UI 样式 |
| 购物车（增删改查、数量、删除） | `cart/*` | 改 UI 样式 |
| 结账（地址/配送/支付/提交） | `checkout/*` | 改 UI 样式 |
| 用户账户（注册/登录/个人资料/地址/订单） | `account/*` | 改 UI 样式 |
| 区域/地区/货币 | `middleware.ts` + region 逻辑 | 不改 |
| 国际化路由 | `[countryCode]` 路由 | 不改 |
| 购物车抽屉（加购后弹出） | `cart-dropdown` | 改 UI 样式 |
| 免运费提示 | `free-shipping-price-nudge` | 改 UI 样式 |
| 订单确认 | `order/*` | 改 UI 样式 |

---

## 四、组件清单

### 4.1 公共组件（全站复用）

| 组件 | 文件位置 | 核心功能 |
|------|----------|----------|
| **Header（双层）** | `layout/templates/nav/` | 顶层：Logo + 搜索 + 账户 + 购物车；导航层：品类链接 |
| **Mobile Side Menu** | `layout/components/side-menu/` → 改为 `nav/nav-client.tsx` | 全高白底侧边菜单，品类列表，底部关闭按钮 |
| **Footer（4列）** | `layout/templates/footer/` | 品类/服务/公司/法律 + 邮件订阅 + 版权 |
| **LocalizedClientLink** | `common/components/localized-client-link/` | 带国家代码的链接（不改） |
| **ProductPreview（商品卡片）** | `products/components/product-preview/` | 图片 + 系列名 + 商品名 + 价格 |
| **Thumbnail** | `products/components/thumbnail/` | 商品缩略图（购物车/抽屉用） |
| **CartDropdown（购物车抽屉）** | `layout/components/cart-dropdown/` | 右侧滑入抽屉 |
| **DeleteButton** | `common/components/delete-button/` | 删除操作（不改） |
| **LineItemPrice / UnitPrice** | `common/components/line-item-price/` | 价格显示（不改逻辑，改样式） |
| **Modal / Accordion / Input / Radio / Checkbox** | `common/components/*` | 基础 UI（改样式） |

### 4.2 页面级组件

| 页面 | 组件 | 核心功能 |
|------|------|----------|
| **首页** | `Hero` | 全屏深色背景 + 品牌标题 + CTA |
| **首页** | `CategoryGrid` | 品类网格（深色卡片 + 悬停效果） |
| **首页** | `FeaturedProducts / ProductRail` | 精选商品横向滚动或网格 |
| **PLP** | `PaginatedProducts` | 商品网格 + 分页 |
| **PLP** | `RefinementList / SortProducts` | 筛选 + 排序 |
| **PDP** | `ImageGallery` | 桌面：左缩略图+右主图；移动端：顶部大图+底部横滚缩略图 |
| **PDP** | `ProductActions` | 变体选择 + 数量 + 加购按钮 |
| **PDP** | `ProductTabs` | 折叠面板（描述/尺寸/配送/保养） |
| **PDP** | `RelatedProducts` | 相关商品推荐 |
| **Cart** | `ItemsTemplate` | 购物车商品列表 |
| **Cart** | `Summary` | 订单摘要（小计/运费/税/总计） |
| **Checkout** | `CheckoutForm` | 地址 + 配送 + 支付 |
| **Checkout** | `CheckoutSummary` | 结账侧边摘要 |

---

## 五、分阶段开发计划

### Phase 0：设计系统 Token 化（基础层）
**目标**：建立全站统一的设计语言，后续所有页面只引用 token，不出现零散 hex/魔法数字。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 0.1 | 在 `tailwind.config.js` 中定义颜色系统（`qw-*`） | `tailwind.config.js` | 所有 `qw-*` 颜色可在 class 中使用 |
| 0.2 | 定义字体系统：衬线（Cormorant Garamond）+ 无衬线 | `tailwind.config.js` + `layout.tsx`（next/font） | 页面标题用衬线，正文用无衬线 |
| 0.3 | 定义字号阶梯（micro/caption/body/card-title/section-title/hero） | `tailwind.config.js` | 各字号 token 可用 |
| 0.4 | 定义间距 token（qw-1 到 qw-24 + section spacing） | `tailwind.config.js` | section 间距统一 |
| 0.5 | 定义断点（small:768/medium:1024/large:1440/xlarge:1680） | `tailwind.config.js` | 断点与 RH 适配 |
| 0.6 | 更新 `globals.css`：基础排版（body/h1-h6/a/selection）+ 工具类（content-container/qw-btn-primary/qw-btn-secondary） | `globals.css` | 全站基础样式统一 |
| 0.7 | 在 `layout.tsx` 中加载 Cormorant Garamond 字体 | `layout.tsx` | 字体正确加载，无 FOIT |

### Phase 1：全局布局（Header + Footer + 页面骨架）
**目标**：打通全站骨架，所有页面共享统一的导航和页脚。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 1.1 | 改造 Header：品牌 Logo + 桌面品类导航链接 + 搜索/账户/购物车图标 | `nav/index.tsx` | 桌面端双层 Header 可见 |
| 1.2 | 移动端汉堡菜单 + 侧边菜单（全高白底、品类列表、底部关闭按钮） | `nav/nav-client.tsx`（新建） | 375px 下汉堡菜单可用，侧边菜单从左滑入 |
| 1.3 | 改造 Footer：4列链接 + 邮件订阅 + 版权 + 移动端手风琴折叠 | `footer/index.tsx` | 桌面4列，移动端折叠 |
| 1.4 | 改造购物车抽屉样式 | `cart-dropdown/index.tsx` | 右侧滑入，RH 风格 |
| 1.5 | 页面路由淡入动画（template.tsx） | `(main)/template.tsx`（新建） | 页面切换有淡入效果 |

### Phase 2：首页
**目标**：首页完整呈现 RH 风格的编辑式布局。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 2.1 | Hero 区：全屏深色背景 + 品牌标题 + 副标题 + CTA 按钮 + 入场动画 | `hero/index.tsx` | 全屏 Hero，文字居中，动画流畅 |
| 2.2 | 品类网格：深色卡片 + 品类名 + 悬停缩放效果 | `category-grid/index.tsx`（新建） | 桌面3列，平板2列，移动端1列 |
| 2.3 | 精选商品区：从 Medusa 获取数据 + 商品卡片网格 | `featured-products/` + `product-rail/` | 商品数据正确显示 |
| 2.4 | 首页 page.tsx 串联所有区块 | `(main)/page.tsx` | 首页完整可浏览 |

### Phase 3：商品列表页（PLP）
**目标**：商品浏览体验对标 RH。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 3.1 | 改造商品卡片（ProductPreview）：图片 3:4 比例 + 悬停缩放 + 系列名 + 商品名 + 价格 | `product-preview/index.tsx` | 卡片样式对标 RH |
| 3.2 | 改造商品网格：桌面4列、平板2列、移动端2列 | `paginated-products.tsx` | 网格响应式正确 |
| 3.3 | 商品卡片进入视口淡入动画（IntersectionObserver） | `product-reveal.tsx`（新建） | 滚动时卡片从下方淡入 |
| 3.4 | 改造筛选/排序 UI | `refinement-list/` | 样式对标 RH |
| 3.5 | 图片 blur placeholder | `product-preview/` + `image-gallery/` + `thumbnail/` | 图片加载有模糊占位 |

### Phase 4：商品详情页（PDP）
**目标**：PDP 完整呈现 RH 风格。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 4.1 | 改造图片画廊：桌面左缩略图+右主图；移动端顶部大图+底部横滚缩略图 + Lightbox | `image-gallery/index.tsx` | 桌面/移动端画廊正确 |
| 4.2 | 改造产品信息区：面包屑 + 系列名 + 商品名 + 价格 + 变体选择 + 加购 | `product-actions/` + `product-price/` | 信息区样式对标 |
| 4.3 | 改造产品 Tab/折叠面板 | `product-tabs/index.tsx` | 折叠面板可展开/收起 |
| 4.4 | 相关商品推荐区 | `related-products/index.tsx` | 底部推荐商品显示 |
| 4.5 | PDP 布局：桌面左右分栏，移动端上下堆叠 | `products/templates/index.tsx` | 响应式布局正确 |

### Phase 5：购物车 + 结账
**目标**：购物车和结账流程样式对标 RH，保留 Medusa 原生数据流。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 5.1 | 改造购物车页面：商品列表 + 订单摘要；移动端上下堆叠 | `cart/templates/index.tsx` + `summary.tsx` | 购物车样式对标，加购流程完整 |
| 5.2 | 改造结账页面样式；移动端上下堆叠 | `checkout/page.tsx` + `checkout-form/` + `checkout-summary/` | 结账流程完整可用 |
| 5.3 | 改造结账 Header（极简：返回 + Logo） | `(checkout)/layout.tsx` | 结账页有独立极简 Header |

### Phase 6：账户页面
**目标**：账户页面样式对标 RH，保留原生逻辑。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 6.1 | 改造登录/注册页样式 | `account/components/login/` + `register/` | 登录注册可用 |
| 6.2 | 改造账户仪表盘样式 | `account/components/overview/` + 各子页 | 账户页面样式统一 |

### Phase 7：新增页面 + 404 + 细节打磨
**目标**：补齐品牌页面，打磨全站细节。

| 序号 | 任务 | 改动文件 | 验收标准 |
|------|------|----------|----------|
| 7.1 | 新增 About 页面 | `about/page.tsx`（新建） | Hero + 内容区块 |
| 7.2 | 新增 Design Services 页面 | `design-services/page.tsx`（新建） | Hero + 内容区块 |
| 7.3 | 改造 404 页面 | `not-found.tsx` | 品牌化 404 |
| 7.4 | 全站按钮 hover 过渡统一 300ms | 全局检查 | 所有按钮 hover 过渡一致 |
| 7.5 | 导航 hover 动效（opacity + translateY） | `nav/index.tsx` | 桌面导航 hover 有动效 |

### Phase 8：移动端适配 + 全站验收
**目标**：375px 下所有页面完美显示，全站无报错。

| 序号 | 任务 | 验收标准 |
|------|------|----------|
| 8.1 | 首页：Hero 文字不溢出，品类网格变单列 | 375px 无溢出 |
| 8.2 | NavBar：汉堡菜单 + 侧边菜单可用 | 侧边菜单从左滑入，底部有关闭按钮 |
| 8.3 | PLP：移动端2列（不是1列） | 375px 下2列网格 |
| 8.4 | PDP：顶部大图 + 底部横滚缩略图 + 信息区全宽 | 375px 下布局正确 |
| 8.5 | Cart：上下堆叠 | 375px 下商品在上摘要在下 |
| 8.6 | Checkout：上下堆叠 | 375px 下表单在上摘要在下 |
| 8.7 | 全站无横向滚动条 | `html { overflow-x: clip }` |
| 8.8 | `npx tsc --noEmit` 无报错 | 终端无红色 |
| 8.9 | 无 Hydration mismatch 警告 | 浏览器控制台无警告 |
| 8.10 | 所有图片有 alt 属性 | 检查所有 `<Image>` 和 `<img>` |
| 8.11 | 字体加载正确（衬线 + 无衬线） | 视觉检查 |
| 8.12 | 颜色系统统一（无默认蓝色链接） | 视觉检查 |
| 8.13 | 购物车加购流程完整可用 | 端到端测试 |

---

## 六、你的执行方式（给小白的操作指南）

### 每个 Phase 你只需要发一条消息：

```
请按照 RH-CLONE-ARCHITECTURE.md 方案，现在执行 Phase X。
请先读取相关文件，再给出修改计划，确认后再动代码。
每步完成后运行 `npx tsc --noEmit` 确认无报错。
```

### 每个 Phase 完成后发一条验收消息：

```
Phase X 已完成，请验收：
- 终端有无 TypeScript 报错
- 浏览器有无 hydration 警告
- 移动端（375px）有无横向滚动条
- 页面字体和颜色是否统一
发现问题请直接修复。
```

### 如果某个 Phase 出了问题：

```
Phase X 的 [具体问题描述]，请修复。
不要改动其他 Phase 的内容。
```

---

## 七、风险与注意事项

| 风险 | 应对 |
|------|------|
| Medusa 后端未启动导致页面空白 | 确保 `localhost:9000` 可访问，且已创建 Region + Sales Channel |
| 字体加载失败（FOIT） | 使用 `next/font` 的 `display: "swap"` |
| 图片域名未配置 | `next.config.js` 的 `images.remotePatterns` 需包含 Medusa 上传域名 |
| Tailwind 类名冲突（Medusa UI preset vs 自定义） | 自定义 token 用 `qw-` 前缀，避免覆盖 Medusa UI 组件 |
| 移动端横向滚动 | 全局 `overflow-x: clip`；每个容器检查 `max-w-[100vw]` |
| Hydration mismatch | 避免在 Server Component 中使用 `Date.now()` 等不稳定值 |

---

*文档版本 1.0 | 基于 Medusa Storefront 2.x 官方模板 | 纯本地开发*
