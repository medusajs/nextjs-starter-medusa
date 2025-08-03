# 🎯 Content-Aware Responsive System

## Overview

The **Content-Aware Responsive System** is a revolutionary approach to responsive design that responds to **actual content area width** rather than viewport width. This is essential for modern layouts with sidebars, companion panels, and dynamic content compression.

## 🚀 Why Content-Aware?

### Traditional Responsive Design Problem
```html
<!-- ❌ Traditional: Responds to viewport, not content -->
<div className="md:grid-cols-4">
  <!-- This shows 4 columns even when a sidebar compresses the content! -->
</div>
```

### Our Solution
```html
<!-- ✅ Content-Aware: Responds to actual available space -->
<div className="cmd:grid-cols-4 panel-open-cmd:!grid-cols-2">
  <!-- Adapts when companion panel compresses content area -->
</div>
```

## 🎨 Tailwind Integration

We've extended Tailwind CSS with custom variants that work seamlessly with existing responsive utilities:

### Available Variants

| Variant | Description | Content Width |
|---------|-------------|---------------|
| `cxs:` | Content Extra Small | < 640px |
| `csm:` | Content Small | 640px+ |
| `cmd:` | Content Medium | 768px+ |
| `clg:` | Content Large | 1024px+ |
| `cxl:` | Content Extra Large | 1280px+ |

### Panel State Variants

| Variant | Description |
|---------|-------------|
| `panel-open:` | When companion panel is open |
| `panel-closed:` | When companion panel is closed |
| `panel-open-cmd:` | Panel open + medium content |

## 🔧 Technical Implementation

### Custom Tailwind Plugin
- **Location**: `src/lib/tailwind/content-media-plugin.js`
- **Integration**: Automatically included in `tailwind.config.js`
- **Zero Runtime Cost**: Pure CSS, compiled at build time

### useContentMediaQuery Hook
- **Location**: `src/lib/hooks/use-content-media-query.ts`
- **Uses**: ResizeObserver for precise measurements
- **Provides**: Real-time content area width detection

### UnifiedLayoutWrapper
- **Location**: `src/modules/layout/components/unified-layout-wrapper/index.tsx`
- **Purpose**: Applies data attributes for CSS targeting
- **Features**: Automatic margin compression, responsive integration

## 📖 Usage Examples

### Basic Content Responsiveness
```html
<div className="
  cxs:grid-cols-1 
  csm:grid-cols-2 
  cmd:grid-cols-3 
  clg:grid-cols-4
">
  <!-- Grid adapts to content area width -->
</div>
```

### Panel-Aware Layouts
```html
<div className="
  cmd:grid-cols-4 
  panel-open-cmd:!grid-cols-2
  panel-open-clg:!grid-cols-3
">
  <!-- Fewer columns when panel compresses content -->
</div>
```

### Smart Typography
```html
<h1 className="
  cxs:text-xl 
  csm:text-2xl 
  cmd:text-3xl 
  panel-open:text-lg
">
  Text scales with available space
</h1>
```

## 🎪 Live Demo

Visit `/content-aware` to see the system in action with:
- Interactive grid demonstrations
- Real-time content width display
- Panel state integration examples
- ContentResponsiveWrapper demonstration

## 🎯 Best Practices

1. **Use `!` prefix** for combined variants to ensure proper CSS specificity
2. **Start with traditional responsive** (`sm:`, `md:`) then enhance with content-aware
3. **Test with panels open/closed** to ensure layouts work in all states
4. **Use semantic variants** (`content-mobile:`) for better readability

## 📚 Related Documentation

- [Tailwind Plugin Reference](./tailwind-plugin.md)
- [useContentMediaQuery Hook](./hooks.md)
- [Integration Guide](./integration.md)
- [Migration from Custom CSS](./migration.md)