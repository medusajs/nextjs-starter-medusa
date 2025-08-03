# Styles Directory

## 🎯 Simple 1:1 Structure

This directory uses a clean, simple 1:1 mapping between files and their corresponding app pages or components.

```
styles/
├── app/                    # 📄 Page-specific styles (1:1 with app pages)
│   ├── store.css          # Store/homepage styles
│   ├── products.css       # Product listing & detail pages
│   ├── cart.css           # Cart page styles (future)
│   └── checkout.css       # Checkout flow styles (future)
├── modules/               # 🧩 Component-specific styles (1:1 with components)
│   ├── nav.css           # Navigation component
│   ├── cart-drawer.css   # Cart drawer component
│   ├── product-grid.css  # Product grid component
│   └── utilities.css     # Cross-cutting utilities
└── content-media-queries.css  # 📋 Main entry point
```

## 📝 CSS Structure Within Each File

Each CSS file contains **all styles** for its corresponding page/component:

```css
/* Example: styles/app/products.css */

/* =============================================================================
   COMPONENT-SPECIFIC STYLES
   ============================================================================= */
.products-container {
  padding: 1rem;
}

/* =============================================================================
   TRADITIONAL MEDIA QUERIES
   ============================================================================= */
@media (min-width: 768px) {
  .products-container {
    padding: 2rem;
  }
}

/* =============================================================================
   CONTENT MEDIA QUERIES (Custom System)
   Based on actual content area width, not viewport
   ============================================================================= */
[data-media-query="md"] .products-container {
  padding: 2rem;
}

/* =============================================================================
   COMPANION PANEL INTEGRATION
   Styles that respond to panel state + content size
   ============================================================================= */
[data-panel-open="true"][data-media-query="xs"] .products-container {
  padding: 0.75rem;
}
```

## 🎯 Benefits

- ✅ **Easy to Find**: Need product styles? Check `styles/app/products.css`
- ✅ **Easy to Maintain**: One file per component/page
- ✅ **Self-Contained**: All responsive styles in one place
- ✅ **No Deep Nesting**: Just two folders: `app/` and `modules/`
- ✅ **1:1 Mapping**: Mirrors your actual app structure

## 🚀 Usage

### Adding New Page Styles
1. Create file: `styles/app/new-page.css`
2. Add import to `content-media-queries.css`
3. Write styles with traditional + content media queries

### Adding New Component Styles
1. Create file: `styles/modules/new-component.css`
2. Add import to `content-media-queries.css`
3. Write styles with traditional + content media queries

## 🔧 Content Media Query System

This system responds to **actual content area width**, not just viewport width. Perfect for companion panel layouts where content gets compressed.

### Data Attributes (Set by JavaScript)
```html
<div 
  data-media-query="md"           <!-- Size: xs/sm/md/lg/xl -->
  data-semantic-size="tablet"     <!-- Type: mobile/tablet/desktop -->
  data-panel-open="true"          <!-- Panel state -->
  data-device-mobile="false"      <!-- Device context -->
>
```

### CSS Selectors
```css
/* Traditional media queries (viewport-based) */
@media (min-width: 768px) { }

/* Content media queries (content-area-based) */
[data-media-query="md"] { }

/* Panel-aware styles */
[data-panel-open="true"][data-media-query="xs"] { }
```

## 🎨 Example File Contents

### App Page Example
```css
/* styles/app/store.css */
.store-hero { padding: 2rem 1rem; }

@media (min-width: 768px) {
  .store-hero { padding: 4rem 2rem; }
}

[data-media-query="md"] .store-hero {
  padding: 4rem 2rem;
}
```

### Module Component Example
```css
/* styles/modules/nav.css */
.nav-menu { flex-direction: column; }

@media (min-width: 640px) {
  .nav-menu { flex-direction: row; }
}

[data-media-query="sm"] .nav-menu {
  flex-direction: row;
}
```

---

## 🌟 **Clean, Simple, Maintainable!**

This structure provides the perfect balance of organization and simplicity - making it easy to find, maintain, and extend your styles while supporting both traditional and content-area-based responsive design.