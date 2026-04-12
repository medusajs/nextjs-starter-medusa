# CLAUDE.md — RH-Style Medusa Storefront 编码规范

> **定位**：本文件是 `RH-CLONE-ARCHITECTURE.md` 的**配套编码规范**。执行顺序参照该文档的 Phase 0–8 计划，本文件仅约束"怎么写代码"。
>
> **项目**：基于 Medusa Next.js Starter 2.x 复刻 RH.com (Restoration Hardware) 视觉语言
> **技术栈**：Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Medusa 2.x 后端
> **运行端口**：Storefront `localhost:8000` / Medusa `localhost:9000`

---

## 1. 设计 Token 定义

### 1.1 颜色系统

所有颜色通过 Tailwind `qw-*` 前缀引用，**禁止**在代码中硬编码 hex 值。

| Token | Hex | 用途 |
|---|---|---|
| `qw-black` | `#000000` | 主文字、CTA 按钮填充、标题 |
| `qw-charcoal` | `#1A1A1A` | 正文文字、body 默认色 |
| `qw-dark-grey` | `#333333` | 二级文字、次要标题 |
| `qw-medium-grey` | `#666666` | 三级文字、辅助说明、placeholder |
| `qw-grey` | `#999999` | 占位符、禁用态、图标默认色 |
| `qw-light-grey` | `#CCCCCC` | 边框、分隔线 |
| `qw-pale-grey` | `#E8E8E8` | 浅边框、细分隔 |
| `qw-off-white` | `#F5F5F0` | 卡片/区块背景（暖灰调） |
| `qw-warm-white` | `#FAF9F6` | 页面次级背景 |
| `qw-white` | `#FFFFFF` | body 默认背景、表单 input 背景、模态框/抽屉内容区、文字反色 |
| `qw-gold` | `#B8860B` | 品牌金色点缀（会员标识、hover 微高亮） |
| `qw-error` | `#C41E3A` | 错误提示、促销价格、库存警告 |

**页面背景约定**：

- body 默认背景：`bg-qw-white`（已在 `layout.tsx` 和 `globals.css` 中设定）
- 导航栏固态背景：`bg-[#f9f7f4]`（已在 NavShell 中使用）
- 首页 Hero / 品牌区块：`bg-qw-black` 或深色渐变
- 区块差异化背景：使用 `bg-qw-warm-white` 或 `bg-qw-off-white` 与 body 白底形成层次
- **禁止**原生 Tailwind `bg-white`（不走 qw-token 的硬编码白），统一使用 `bg-qw-white`

### 1.2 字体系统

| 用途 | 字体族 | Tailwind class | 字重 | 特征 |
|---|---|---|---|---|
| 标题 / 品牌 / 商品名 | Cormorant Garamond (Google Fonts) | `font-serif` | 300 / 400 | 衬线，大写 + `tracking-[0.08em]`，优雅建筑感 |
| 正文 / UI / 按钮 | **Inter Variable Font**（本地，`src/fonts/`） | `font-sans` | 100–900（可变） | 无衬线，x-height 高，跨平台一致，零 CDN |

字体通过 `next/font` 在 `src/app/layout.tsx` 加载：
- `--font-serif`（Cormorant Garamond）：`next/font/google`
- `--font-sans`（Inter）：`next/font/local`，字体文件在 `src/fonts/Inter-Variable*.woff2`

### 1.3 字号阶梯

| Token | 大小 | 行高 | Tailwind class | 用途 |
|---|---|---|---|---|
| `micro` | 10px | 14px | `text-micro` | 眉标、标签、面包屑 |
| `caption` | 12px | 16px | `text-caption` | 辅助说明、系列名 |
| `body` | 14px | 20px | `text-body` | 正文 |
| `body-lg` | 16px | 24px | `text-body-lg` | 大正文 |
| `card-title` | 20px | 28px | `text-card-title` | 卡片标题、导航 Logo |
| `section-title` | 32px | 40px | `text-section-title` | 区块标题 |
| `hero` | 48px | 56px | `text-hero` | 首屏大标题 |

### 1.4 间距系统

- **基准单位**：4px（`qw-1` = 0.25rem）
- **Token 范围**：`qw-1`（4px）到 `qw-24`（96px），每级递增 4px
- **Section 间距**：桌面 `80px`（`py-20`），移动端 `48px`（`py-12`）
- **内容容器**：最大宽度 **`2560px`**（`max-w-body`），左右 `px-6`（24px），通过 `.content-container` 复用
- **卡片间距**：`gap-6`（24px）

### 1.5 响应式断点

| Token | 宽度 | 用途 |
|---|---|---|
| 默认 | 0–767px | 移动端 |
| `small` | 768px+ | 平板 |
| `medium` | 1024px+ | 桌面（导航展开） |
| `large` | 1440px+ | 大桌面 |
| `xlarge` | 1680px+ | 超宽屏 |
| `2xlarge` | 1920px+ | 4K |

### 1.6 动效参数

| 场景 | 属性 | 时长 | 曲线 | Tailwind / Framer Motion |
|---|---|---|---|---|
| 按钮 hover | opacity / background | 300ms | ease | `transition-opacity duration-300` |
| 图片 hover | transform scale(1.03) | 800ms | cubic-bezier(0.25,0.1,0.25,1) | `group-hover:scale-[1.03] transition-transform duration-[800ms]` |
| 页面路由切换 | opacity | 350ms | cubic-bezier(0.16,1,0.3,1) | Framer Motion `animate={{ opacity: 1 }}` |
| 商品卡片入场 | opacity + translateY(28px) | 500ms | cubic-bezier(0.16,1,0.3,1) | IntersectionObserver + Framer Motion |
| 导航 hover | opacity + translateY(-2px) | 300ms | ease | `hover:opacity-80 hover:-translate-y-0.5` |
| 侧边菜单 / 购物车抽屉 | translateX | 500ms | cubic-bezier(0.16,1,0.3,1) | Headless UI Transition |
| Accordion 开合 | height + opacity | 300ms | cubic-bezier(0.87,0,0.13,1) | Radix Accordion |

---

## 2. `src/modules/` 子目录改造策略

### 策略说明

- **保留 (Keep)**：仅微调 Tailwind class，不改动组件结构和数据流
- **重写 (Rewrite)**：保留 Medusa 数据接口，重写 JSX 结构和样式以对标 RH
- **新增 (New)**：创建全新组件
- **不动 (Untouched)**：完全不修改

### 模块清单

| 子目录 | 策略 | 改动范围 | 注意事项 |
|---|---|---|---|
| **`account/`** | **重写样式** | 登录/注册页面 → RH 极简单列居中表单；账户仪表盘 → 侧边导航+右侧内容区；订单卡片 → 直角无阴影列表 | 保留所有 Medusa auth/account API 调用；`account-info` 中的 `useFormState` 逻辑不动 |
| **`cart/`** | **重写样式** | 购物车模板 → 左右分栏（桌面）/ 上下堆叠（移动端）；商品项 → 大缩略图+详情；摘要 → 简约黑线框 | 保留 `updateLineItem`、`deleteLineItem` 等 server action |
| **`categories/`** | **保留** | 仅换字体/间距/颜色 token | 模板结构复用 `store/` |
| **`checkout/`** | **重写样式** | 地址/配送/支付表单 → RH 风格 input（底部单线、无圆角）；结账摘要 → 右侧固定列 | Stripe 集成、`payment-wrapper` 逻辑完全不动 |
| **`collections/`** | **保留** | 同 `categories/` | — |
| **`common/`** | **重写样式** | `input/` → 底部单线无圆角；`delete-button/` → 纯文字按钮；`native-select/` → 自定义下拉箭头；`modal/` → 直角全高遮罩 | `localized-client-link/` 完全不动；`line-item-price/`、`line-item-unit-price/` 仅改字体/颜色 |
| **`home/`** | **重写+新增** | `hero/` → 全屏深色 Hero（已有 `home-hero-stack.tsx`）；`featured-products/` → 网格布局 + 入场动画 | 原 `category-grid/` 和 `hero/index.tsx` 已删除，使用新组件 |
| **`layout/`** | **已重写** | `nav/` → 双层 Header（`nav-shell.tsx`、`nav-catalog-row.tsx`、`nav-search-inline.tsx`、`nav-region-switcher.tsx`）；`footer/` → 4 列 + 邮件订阅 + 地区选择；`cart-dropdown/` → 右侧滑入抽屉 | `side-menu/` → 移动端全高侧边菜单；`cart-button/` 保留；`medusa-cta/` 移除或隐藏 |
| **`order/`** | **重写样式** | 订单详情/确认 → RH 极简排版；移除彩色装饰 | 数据流不动 |
| **`products/`** | **重写** | `product-preview/` → 3:4 图片 + hover 缩放 + 系列名 + 价格；`image-gallery/` → 左缩略图 + 右主图（桌面）；`product-actions/` → 变体选择 + 加购按钮（黑底白字直角）；`product-tabs/` → Radix Accordion 直角折叠面板；`product-info/` → 面包屑 + 标题 + 价格行 | `product-price/` 逻辑保留，仅改样式；`related-products/` 用横向滚动或网格 |
| **`shipping/`** | **保留** | 免运费提示仅改颜色 | — |
| **`skeletons/`** | **重写样式** | 骨架屏脉冲动画改为 `bg-qw-pale-grey animate-pulse`，移除圆角 | 结构不动 |
| **`store/`** | **重写样式** | `paginated-products.tsx` → 桌面 4 列 / 平板 2 列 / 移动 2 列网格 + IntersectionObserver 入场；`refinement-list/` → RH 风格筛选面板；`pagination/` → 简约分页 | `product-reveal.tsx` 已创建用于入场动画 |

---

## 3. 绝对禁止项清单

以下样式属性 **在整个项目中绝对禁止使用**，违反任何一条都必须立即修正：

### 3.1 阴影 (Box Shadow)

```
❌ 禁止: shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl（Tailwind 预设阴影）
❌ 禁止: drop-shadow-*
❌ 禁止: 商品卡片、按钮、输入框上添加任何阴影

✅ 例外: 浮层组件（下拉菜单、Modal、地区选择弹窗）可使用自定义轻阴影：
   shadow-[0_8px_24px_rgba(0,0,0,0.18)] 或 shadow-[0_10px_22px_rgba(0,0,0,0.12)]
✅ 例外: @medusajs/ui 内部组件自带阴影无法控制，不强制覆盖
```

### 3.2 圆角 (Border Radius)

```
❌ 禁止: rounded-md, rounded-lg, rounded-xl, rounded-2xl (中/大圆角)
❌ 禁止: 自定义组件中使用 rounded-full (除头像、指示器小圆点外)

✅ 自定义组件一律 rounded-none 或不写（默认直角），体现建筑感
✅ 例外: 头像圆形裁切 (rounded-full)
✅ 例外: 移动端指示器小圆点 (rounded-full, width/height ≤ 6px)
✅ 例外: @medusajs/ui 内部组件（<Button> 等）自带圆角无法控制，不强制覆盖
```

### 3.3 渐变 (Gradient)

```
❌ 禁止: bg-gradient-to-*, from-*, via-*, to-*
❌ 禁止: background: linear-gradient(...) / radial-gradient(...)

✅ 唯一例外: 导航栏 overlay 模式的透明→深色渐变遮罩
   即 NavShell 中的 group-data-[tone=overlay] 半透明渐变
✅ 唯一例外: 图片上文字可读性叠加层 (Hero 场景)
```

### 3.4 非 Token 白色

```
❌ 禁止: 原生 Tailwind bg-white（不经过 qw-token 的硬编码白色）
❌ 禁止: bg-[#fff], bg-[#ffffff], bg-[#FFFFFF]
❌ 禁止: backgroundColor: 'white'

✅ 统一使用 bg-qw-white 替代所有白色背景（它也是 #FFFFFF，但走 token 体系）
✅ 页面/区块需要暖灰层次时，使用 bg-qw-warm-white 或 bg-qw-off-white
```

### 3.5 其他禁止项

```
❌ 禁止: 蓝色链接 (text-blue-*, text-indigo-*)，所有链接用 text-inherit
❌ 禁止: 默认 Tailwind 色板直接使用 (blue-500, red-400 等)，必须用 qw-* token
❌ 禁止: font-bold / font-extrabold / font-black (RH 风格最重仅 font-semibold，标题用 font-light)
❌ 禁止: 行内 style={{ }} 定义颜色，必须用 Tailwind class 或 CSS 变量
❌ 禁止: animate-bounce, animate-spin (除 loading spinner), animate-ping
❌ 禁止: 任何 emoji 作为 UI 元素
❌ 禁止: transform rotate (装饰性旋转)，Chevron 旋转动画除外
```

---

## 4. RH 核心组件接口规范

### 4.1 ProductCard (ProductPreview)

**文件**：`src/modules/products/components/product-preview/index.tsx`

```typescript
interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean  // 精选商品标记，影响布局尺寸
}
```

**渲染结构**：

```
<LocalizedClientLink href="/products/[handle]">
  <div data-testid="product-wrapper">
    <Thumbnail />                          // 3:4 比例，overflow-hidden，group-hover:scale-[1.03]
    <div className="mt-4 gap-y-2">
      <span>系列名 (collection.title)</span> // text-caption uppercase tracking-[0.2em] text-qw-medium-grey
      <div className="flex justify-between">
        <Text>商品名</Text>                  // font-serif font-light uppercase tracking-[0.08em]
        <PreviewPrice />                     // text-body text-qw-charcoal
      </div>
    </div>
  </div>
</LocalizedClientLink>
```

**约束**：
- 图片容器 `aspect-[3/4]`，`overflow-hidden`
- 悬停缩放 `transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
- 无边框、无阴影、无圆角
- 系列名从 `product.collection?.title` 或 `product.tags?.[0]?.value` 取值

### 4.2 Header (Nav)

**文件**：`src/modules/layout/templates/nav/index.tsx`（Server Component）

```typescript
// Nav 是异步 Server Component，无 props，内部通过 server actions 获取数据
export default async function Nav(): Promise<JSX.Element>
```

**子组件接口**：

```typescript
// nav-shell.tsx — 客户端包裹层，管理滚动行为和导航 tone (solid/overlay)
interface NavShellProps {
  children: React.ReactNode
}

// nav-catalog-row.tsx — 桌面第二行品类导航
// 无外部 props，从 nav-data.ts 读取品类数据
export default function NavCatalogRow(): JSX.Element

// nav-search-inline.tsx — 搜索图标/内联搜索框
export default function NavSearchInline(): JSX.Element

// nav-region-switcher.tsx — 地区/语言切换器
interface NavRegionSwitcherProps {
  regions: StoreRegion[]
  locales: { code: string; name: string }[]
  currentLocale: { code: string; country: string }
}
```

**导航双层结构**：

```
<NavShell>
  <header>
    <!-- 第一层: h-[82px] -->
    <nav className="content-container">
      左: SideMenu(hamburger) + NavSearchInline
      中: Logo (font-serif text-card-title uppercase)
      右: NavRegionSwitcher + Account icon + CartDropdown
    </nav>

    <!-- 第二层: h-[54px]，仅桌面显示 -->
    <nav className="content-container hidden small:block">
      <NavCatalogRow />  // 品类链接，居中排列
    </nav>
  </header>
</NavShell>
```

**两种 tone 模式**：
- `solid`：白色/暖灰背景，黑色文字（滚动后 / 非首页）
- `overlay`：透明→深色渐变背景，白色文字（首页 Hero 上方）

### 4.3 CartDrawer (CartDropdown)

**文件**：`src/modules/layout/components/cart-dropdown/index.tsx`（Client Component）

```typescript
interface CartDropdownProps {
  cart?: HttpTypes.StoreCart | null
}
```

**行为规范**：
- 触发方式：hover 触发区 `onMouseEnter` / `onMouseLeave`，120ms 延迟关闭
- 商品变化时自动弹出 5 秒（非 `/cart` 页面）
- 使用 `createPortal` 渲染到 `document.body`
- 从右侧滑入 `translate-x-full → translate-x-0`，300ms ease-out

**渲染结构**：

```
<div className="fixed right-0 top-0 h-full max-w-[420px] bg-[#f9f7f4] border-l border-qw-pale-grey">
  <div>Cart 标题</div>                     // text-[13px] tracking-[0.06em] 居中
  <div>商品列表 (scrollable)</div>          // grid grid-cols-[122px_1fr]
    每项: Thumbnail + 标题 + 选项 + 数量 + 价格 + Remove
  <div>小计 + Go to cart 按钮</div>         // bg-qw-charcoal text-qw-white uppercase
  <!-- 空购物车时 -->
  <div>购物袋为空 + Explore products</div>
</div>
```

### 4.4 SideMenu (Mobile Menu)

**文件**：`src/modules/layout/components/side-menu/index.tsx`

```typescript
interface SideMenuProps {
  regions: StoreRegion[]
  locales: { code: string; name: string }[]
  currentLocale: { code: string; country: string }
  topLevelCategories: HttpTypes.StoreProductCategory[]
  iconClassName?: string  // hamburger 图标的颜色 class
}
```

**行为**：从左侧滑入，全高，白底，品类列表，底部关闭按钮。

### 4.5 ImageGallery (PDP)

**文件**：`src/modules/products/components/image-gallery/index.tsx`

```typescript
interface ImageGalleryProps {
  images: HttpTypes.StoreProductImage[]
}
```

**布局规范**：
- 桌面：左侧缩略图列（垂直滚动） + 右侧主图
- 移动端：顶部大图 + 底部水平滚动缩略图
- 图片无圆角，无阴影

### 4.6 ProductActions

**文件**：`src/modules/products/components/product-actions/index.tsx`

```typescript
interface ProductActionsProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}
```

**结构**：变体选择器 (OptionSelect) + 数量选择 + 加入购物车按钮 (`qw-btn-primary`)

### 4.7 Accordion (ProductTabs)

**文件**：`src/modules/products/components/product-tabs/accordion.tsx`

```typescript
interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}
```

**样式**：Radix Accordion，直角，顶部细线分隔 `border-t border-qw-pale-grey`，展开/收起 300ms。

---

## 5. Tailwind 扩展配置

**权威源**：以项目根目录 `tailwind.config.js` 文件为准。本节仅做要点提示，不复制完整配置（避免双份维护失去同步）。

关键扩展点：
- **颜色**：`colors` 中定义 `qw-*` 前缀色板（见 §1.1）
- **字体**：`fontFamily.sans` = Helvetica Neue 系；`fontFamily.serif` = CSS 变量 `--font-serif`（Cormorant Garamond）
- **字号**：`fontSize` 中定义 `micro` → `hero` 阶梯（见 §1.3）
- **间距**：`spacing` 中定义 `qw-1` → `qw-24`（4px 基准）
- **断点**：`screens` 中定义 `small`/`medium`/`large`/`xlarge`/`2xlarge`（见 §1.5）
- **动画**：`keyframes` + `animation` 中定义 accordion、fade-in、ring 等
- **插件**：`tailwindcss-radix` 用于 Radix Accordion 状态选择器
- **Preset**：`@medusajs/ui-preset`（Medusa UI 基础样式，不可移除）

---

## 6. 全局 CSS 工具类 (`globals.css`)

```css
@layer components {
  .content-container {
    @apply max-w-[1440px] w-full mx-auto px-6;
  }

  .qw-btn-primary {
    @apply inline-flex items-center justify-center
      bg-qw-black text-qw-white text-micro uppercase tracking-[0.2em]
      px-6 py-3 transition-opacity duration-300 hover:opacity-85;
  }

  .qw-btn-secondary {
    @apply inline-flex items-center justify-center
      border border-qw-black text-qw-black text-micro uppercase tracking-[0.2em]
      bg-transparent px-6 py-3 transition-colors duration-300
      hover:bg-qw-black hover:text-qw-white;
  }
}
```

---

## 7. 编码约定

### 7.1 文件与命名

- 组件文件：`kebab-case` 目录，`index.tsx` 入口
- 新增子组件：同级 `kebab-case.tsx`（如 `product-price-row.tsx`）
- 类型定义：行内 interface 或同文件顶部，不创建独立 `types.ts`
- 导入路径：优先使用 `@modules/*`、`@lib/*` 别名

### 7.2 Server / Client 分界

- 默认 Server Component（页面、模板、数据获取层）
- 只有需要 `useState`/`useEffect`/事件处理/浏览器 API 的组件才标记 `"use client"`
- Server Component 绝对不写 `onClick`、`onMouseEnter` 等事件处理

### 7.3 Medusa 数据流

- **不改动**：`src/lib/data/` 下的所有数据获取函数
- **不改动**：`src/lib/util/` 下的工具函数（价格格式化、URL 处理等）
- **不改动**：`middleware.ts` 和区域路由逻辑
- 组件只消费 Medusa 提供的 `HttpTypes` 类型，不创建自定义 API 层

### 7.4 样式优先级

1. Tailwind utility class（首选）
2. `globals.css` 中 `@layer components` 定义的工具类（`.qw-btn-primary` 等）
3. Framer Motion 内联 `animate`/`transition`（仅用于复杂动画）
4. **禁止** CSS Modules、styled-components、内联 `style={{ }}`（动态值除外如 `top: panelTop`）

### 7.5 图片处理

- 所有商品图片使用 Next.js `<Image>` 组件
- 必须提供 `alt` 属性（来自商品数据或合理描述）
- 缩略图统一走 `Thumbnail` 组件
- 图片容器统一 `overflow-hidden`，hover 缩放加在内部 `<Image>` 上

---

## 8. 页面 UI 转换方法论（Component CSS Audit）

### 8.1 标准工作流

每个页面/组件的 UI 改造遵循以下 4 步流程：

**Step 1: CSS Audit（采集 RH 原站 CSS 值）**

打开 RH.com 对应页面 → 用浏览器 DevTools 检查每个元素 → 记录为标准格式：

```
## [组件名] CSS Audit

### 元素: [元素描述]
- font-family: [值]
- font-size: [值]
- font-weight: [值]
- line-height: [值]
- letter-spacing: [值]
- text-transform: [值]
- color: [值]
- margin/padding: [值]
- border: [值]
- background: [值]
```

**Step 2: Token 映射（将 CSS 值映射为 Tailwind class）**

将 Step 1 的 CSS 值转换为项目 qw-* token 和 Tailwind class。

**Step 3: 差异标注（当前代码 vs 目标）**

对比当前组件代码，标注需要修改的 className。

**Step 4: 执行修改 + 验收**

修改代码 → `npx tsc --noEmit` → 浏览器验证 → 移动端 375px 验证。

### 8.2 完整示例：PDP 页面 CSS Audit

以下以 PDP（商品详情页）为例，展示完整的 CSS Audit 和 Token 映射。

> **RH 原站参考**：`rh.com/us/en/catalog/product/product.jsp?productId=prod19650088`
> **注意**：RH 使用自定义字体 `RHSans`（各字重），我们用 `Helvetica Neue`（font-sans）近似。
> **核心发现**：RH 的 PDP 标题用的是**无衬线体**（轻字重、大写），不是衬线体。

---

#### 8.2.1 PDP 布局容器

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| max-width | 1920px | `max-w-[1920px]` |
| padding-x (mobile) | 16px | `px-4` |
| padding-x (tablet) | 24px | `sm:px-6` |
| padding-x (desktop) | 90px | `xl:px-[90px]` |
| 左右分栏 | 50/50 flex | `small:flex-row small:w-1/2` |
| 右侧 sticky | top ~192px | `small:sticky small:top-48` |

**当前状态**: ✅ 已对齐，见 `products/templates/index.tsx`

---

#### 8.2.2 面包屑 (Breadcrumb)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| font-family | RHSans-Light | `font-sans` |
| font-size | 12px | `text-caption` |
| font-weight | 300 | `font-light`（或省略，caption 默认 normal 亦可） |
| text-transform | uppercase | `uppercase` |
| letter-spacing | 0.14em | `tracking-[0.14em]` |
| color | #898886 | `text-qw-medium-grey`（最接近，#666 vs #898886） |
| separator | "/" | 纯文本 `/` |

**当前状态**: ✅ 已对齐，见 `product-info/index.tsx`

**改进点**: RH 原站面包屑色 `#898886` 比 `qw-medium-grey`(#666) 浅，但差异可接受。如需精确匹配可新增 token `qw-warm-grey: #898886`。

---

#### 8.2.3 商品标题 (H1)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| font-family | RHSans-ExtraLight | `font-sans`（**不是** font-serif） |
| font-size | clamp(22px, 2.6vw, 28px) | `text-[clamp(1.375rem,2.6vw,1.75rem)]` |
| font-weight | 200–300 | `font-light` |
| text-transform | uppercase | `uppercase` |
| letter-spacing | 0.165px | `tracking-[0.165px]` |
| line-height | tight (~1.2) | `leading-tight` |
| color | #000000 | `text-qw-black` |

**当前状态**: ✅ 已对齐

**⚠️ 关键注意**: `globals.css` 中 `h1-h6 { @apply font-serif }` 会被 Medusa UI 的 `<Heading>` 组件继承。PDP 中必须在 className 上显式写 `font-sans` 覆盖全局 serif 设定。

---

#### 8.2.4 价格行 (Price Row)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| font-family | RHSans | `font-sans` |
| font-size | 13px | `text-[13px]` |
| font-weight | 400 | 默认（不写） |
| letter-spacing | 0.165px | `tracking-[0.165px]` |
| color (normal) | #000000 | `text-qw-black` |
| color (sale) | #CA2022 | `style={{ color: '#CA2022' }}` |
| "Starting at" | 同字号，在价格前 | 条件渲染 |
| 原价删除线 | line-through | `line-through text-qw-medium-grey` |

**当前状态**: ✅ 已对齐，见 `product-price-row.tsx`

---

#### 8.2.5 商品描述 (Description)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| font-family | RHSans | `font-sans` |
| font-size | 13px | `text-[13px]` |
| font-weight | 400 | 默认 |
| line-height | 1.66rem (~26.6px) | `leading-[1.66rem]` |
| color | #1A1A1A | `text-qw-charcoal` |
| margin-top | ~20px | `mt-5` |
| text-transform | none (normal case) | `normal-case` |

**当前状态**: ✅ 已对齐

---

#### 8.2.6 变体选择器 (Option Select)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| 标签 font-size | 13px | `text-[13px]` |
| 标签 text-transform | none (如 "Size Options") | `normal-case` |
| 按钮高度 | 40px | `h-10` |
| 按钮边框 | 1px solid #E8E8E8 | `border border-qw-pale-grey` |
| 按钮背景 | #F5F5F0 | `bg-qw-off-white` |
| 按钮圆角 | 0 | `rounded-none` |
| 选中态边框 | 1px solid #000 | `border-qw-black` |
| 按钮 letter-spacing | 0.08em | `tracking-[0.08em]` |
| 按钮 text-transform | uppercase | `uppercase` |

**当前状态**: ✅ 已对齐

---

#### 8.2.7 加入购物车按钮 (Add to Cart)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| background | #000000 | `bg-qw-black` |
| color | #FFFFFF | `text-qw-white` |
| height | 40px | `h-10` |
| border | none | `border-none` |
| border-radius | 0 | `rounded-none` |
| font-size | ~12px | `text-[12px]` |
| text-transform | uppercase | `uppercase` |
| letter-spacing | 0.08em | `tracking-[0.08em]` |
| hover | opacity 0.85 | `hover:opacity-85` |
| width | 100% | `w-full` |

**当前状态**: ⚠️ 基本对齐但使用了 `!important` 覆盖 Medusa UI Button。
见 `product-actions/index.tsx` 第 179 行：`!bg-qw-black !text-qw-white !border-none !rounded-none`

**改进建议**: 如频繁需要 `!important`，考虑不用 `<Button>` 组件而改用原生 `<button>` + `qw-btn-primary` class。

---

#### 8.2.8 折叠面板 (Accordion / Product Tabs)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| 触发器 font-size | 13px | `text-[13px]` |
| 触发器 font-weight | 400 | `font-normal` |
| 触发器 text-transform | uppercase | `uppercase` |
| 触发器 letter-spacing | 0.08em | `tracking-[0.08em]` |
| 触发器 color (closed) | #898886 | `text-[#898886]` |
| 触发器 color (open) | #1A1A1A | `data-[state=open]:text-qw-charcoal` |
| 分隔线 | 0.5px solid #D4D2CF | `border-t-[0.5px] border-[#D4D2CF]` |
| 图标 | +/- (不是 chevron) | 自定义 MorphingTrigger SVG |
| 展开动画 | 300ms ease | `animate-accordion-open/close` |
| 内容 font-size | 13px | `text-[13px]` |
| 内容 line-height | relaxed (~1.6) | `leading-relaxed` |

**当前状态**: ✅ 已对齐

---

#### 8.2.9 移动端底部操作栏 (Mobile Actions)

| 属性 | RH 原值 | 映射 Tailwind |
|---|---|---|
| background | 白底 | `bg-qw-white`（当前用了 `bg-white` ❌） |
| border-top | 1px solid #E8E8E8 | `border-t border-qw-pale-grey`（当前用了 `border-gray-200` ❌） |
| 关闭按钮 | 直角 | `rounded-none`（当前用了 `rounded-full` ❌） |
| 文字色 | qw-charcoal | `text-qw-charcoal`（当前用了 `text-ui-fg-base` ❌） |
| 促销色 | #CA2022 | 自定义色（当前用了 `text-ui-fg-interactive` ❌） |

**当前状态**: ❌ 需修正 — `mobile-actions.tsx` 仍残留 Medusa 原生样式。

**待修改清单**:
1. `bg-white` → `bg-qw-white`
2. `border-gray-200` → `border-qw-pale-grey`
3. `rounded-full` → `rounded-none`（关闭按钮）
4. `text-ui-fg-base` → `text-qw-charcoal`
5. `text-ui-fg-interactive` → `style={{ color: '#CA2022' }}`
6. `bg-gray-700 bg-opacity-75` → `bg-black/75`

---

### 8.3 如何对 AI 下达改造指令

掌握上述方法后，对任何页面你只需发一条消息：

```
请按照 CLAUDE.md §8 的 Component CSS Audit 方法，改造 [页面/组件名]。

1. 先读取相关文件
2. 对照 §8.2 的 CSS Audit 格式，列出当前代码与 RH 原站的差异
3. 给出修改计划
4. 执行修改
5. 运行 npx tsc --noEmit 确认无报错
```

如果你已提前做了 CSS Audit（用 DevTools 采集了 RH 原值），直接把 audit 表格粘贴给 AI：

```
请按照以下 CSS Audit 修改 [组件路径]：

### 元素: 页面标题
- font-family: sans-serif → font-sans
- font-size: 24px → text-[24px]
- color: #1A1A1A → text-qw-charcoal
... (你从 DevTools 采集的值)
```

### 8.4 是否需要提供截图？

| 方式 | 精确度 | 效率 | 推荐场景 |
|---|---|---|---|
| **CSS Audit 表格**（最佳） | ★★★★★ | ★★★★★ | 所有场景。从 DevTools 复制精确值 |
| **截图 + 文字描述** | ★★★☆☆ | ★★★☆☆ | 不会用 DevTools 时。AI 需猜测像素值 |
| **只提供截图** | ★★☆☆☆ | ★★☆☆☆ | 不推荐。AI 无法从图片提取精确 CSS 值 |
| **只说"照 RH.com 改"** | ★☆☆☆☆ | ★☆☆☆☆ | 不推荐。AI 无法访问 RH.com |

**推荐流程**：

1. 在浏览器打开 RH.com 对应页面
2. 打开 DevTools（F12）→ 选择元素（Ctrl+Shift+C）
3. 在 Computed 面板查看 font-size、color、margin 等
4. 复制值到 CSS Audit 表格
5. 将表格粘贴给 AI
