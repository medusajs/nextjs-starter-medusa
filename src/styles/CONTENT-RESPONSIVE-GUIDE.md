# Content-Aware Tailwind Responsive System

## 🎯 Overview

This system extends Tailwind CSS with **content-area responsive variants** that respond to the actual width of your content area, not the viewport width. This is perfect for layouts with companion panels, sidebars, or any scenario where content gets compressed.

## 🔧 Available Variants

### Content-Based Breakpoints
Use these instead of `sm:`, `md:`, `lg:` when you want to respond to content area width:

| Variant | Description | Content Width |
|---------|-------------|---------------|
| `cxs:`  | Content Extra Small | < 640px |
| `csm:`  | Content Small | 640px+ |
| `cmd:`  | Content Medium | 768px+ |
| `clg:`  | Content Large | 1024px+ |
| `cxl:`  | Content Extra Large | 1280px+ |

### Semantic Variants
Human-readable alternatives:

| Variant | Description |
|---------|-------------|
| `content-mobile:`  | Mobile-sized content area |
| `content-tablet:`  | Tablet-sized content area |
| `content-desktop:` | Desktop-sized content area |

### Panel State Variants
Respond to companion panel state:

| Variant | Description |
|---------|-------------|
| `panel-open:`   | When any companion panel is open |
| `panel-closed:` | When no companion panel is open |

### Device Awareness
Distinguish between actual device vs compressed content:

| Variant | Description |
|---------|-------------|
| `device-mobile:`  | Actual mobile device |
| `device-desktop:` | Actual desktop device |

### Combined Variants
Advanced responsive behavior:

| Variant | Description |
|---------|-------------|
| `panel-open-cmd:`  | Panel open + medium content |
| `panel-closed-clg:` | Panel closed + large content |
| `device-mobile-cxs:` | Mobile device + extra small content |

## 📚 Usage Examples

### Basic Content-Responsive Grid
```html
<div className="
  grid gap-4
  cxs:grid-cols-1 
  csm:grid-cols-2 
  cmd:grid-cols-3 
  clg:grid-cols-4 
  cxl:grid-cols-5
">
  <!-- Grid adapts to content area width -->
</div>
```

### Panel-Aware Layout
```html
<div className="
  cmd:grid-cols-4
  panel-open-cmd:!grid-cols-2
  panel-open-clg:!grid-cols-3
">
  <!-- Fewer columns when panel compresses content -->
  <!-- Use ! prefix to ensure panel variants override base classes -->
</div>
```

### Typography Scaling
```html
<h1 className="
  cxs:text-xl 
  csm:text-2xl 
  cmd:text-3xl 
  clg:text-4xl
  panel-open:text-lg
">
  Responsive heading that scales with content area
</h1>
```

### Smart Visibility
```html
<!-- Hide on compressed content -->
<div className="cxs:hidden csm:block">
  Hidden when content is too narrow
</div>

<!-- Show different content based on panel state -->
<span className="panel-closed:inline panel-open:hidden">
  Expanded view
</span>
<span className="panel-closed:hidden panel-open:inline">
  Compact view
</span>
```

### Advanced Responsive Behavior
```html
<div className="
  /* Normal state: 4 columns on medium+ */
  cmd:grid-cols-4 
  clg:grid-cols-5
  
  /* Panel open: reduce columns (use ! for reliable override) */
  panel-open-cmd:!grid-cols-2 
  panel-open-clg:!grid-cols-3
  
  /* Mobile device: always stack */
  device-mobile:!grid-cols-1
">
  Complex responsive grid
</div>
```

## 🎨 Common Patterns

### 1. Progressive Enhancement
Start with mobile-first content sizing:
```html
<div className="
  cxs:p-2 
  csm:p-4 
  cmd:p-6 
  clg:p-8 
  cxl:p-10
">
```

### 2. Panel-Aware Spacing
Adjust spacing when content gets compressed:
```html
<div className="
  cmd:px-8 
  panel-open-cmd:px-4
  panel-open-cxs:px-2
">
```

### 3. Conditional Features
Hide/show features based on available space:
```html
<div className="flex items-center gap-4">
  <span>Always visible</span>
  <span className="csm:inline cxs:hidden">
    Hidden when too narrow
  </span>
  <span className="cmd:inline csm:hidden cxs:hidden">
    Only on wider content
  </span>
</div>
```

### 4. Smart Navigation
Adapt navigation based on content space:
```html
<nav className="
  cxs:space-y-1 
  csm:space-x-4 csm:space-y-0 csm:flex
">
  <a href="#" className="block csm:inline">Home</a>
  <a href="#" className="block csm:inline">About</a>
  <a href="#" className="cxs:hidden csm:block">Contact</a>
</nav>
```

## 🔧 Technical Implementation

### How It Works
1. The `useContentMediaQuery` hook measures actual content area width
2. It sets `data-media-query` attributes on the container
3. Our Tailwind plugin creates CSS selectors that target these attributes
4. Classes like `cmd:p-4` become `[data-media-query="md"] .your-element { padding: 1rem }`

### Integration with Existing Code
- Works alongside regular Tailwind responsive variants
- Use `sm:`, `md:`, `lg:` for viewport-based responses
- Use `csm:`, `cmd:`, `clg:` for content-based responses

### Performance
- Zero JavaScript runtime cost (pure CSS)
- Uses efficient attribute selectors
- No media query conflicts with viewport-based variants

## 🚀 Migration Guide

### From Custom CSS
```css
/* Old way */
[data-media-query="md"] .my-component {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* New way */
```
```html
<div className="cmd:p-8 cmd:grid cmd:grid-cols-3">
```

### From Viewport Responsive
```html
<!-- Viewport-based (old) -->
<div className="md:grid-cols-3 lg:grid-cols-4">

<!-- Content-based (new) -->
<div className="cmd:grid-cols-3 clg:grid-cols-4">

<!-- Hybrid approach (recommended) -->
<div className="
  md:grid-cols-3 lg:grid-cols-4
  panel-open-cmd:grid-cols-2 panel-open-clg:grid-cols-3
">
```

## 🎯 Best Practices

1. **Start with viewport responsiveness** (`sm:`, `md:`, `lg:`) for basic responsive design
2. **Add content responsiveness** (`csm:`, `cmd:`, `clg:`) for advanced layout adaptation
3. **Use panel state variants** for companion panel integration
4. **Test with panels open/closed** to ensure layouts work in all states
5. **Use semantic variants** (`content-mobile:`) for better code readability
6. **Use `!` prefix for combined variants** to ensure they override base classes:
   ```html
   <!-- ✅ Good: Panel variants override base classes -->
   <div className="cmd:grid-cols-4 panel-open-cmd:!grid-cols-2">
   
   <!-- ❌ Might not work: CSS specificity issues -->
   <div className="cmd:grid-cols-4 panel-open-cmd:grid-cols-2">
   ```

## 🐛 Troubleshooting

### Class Not Working?
1. Ensure the element is inside a container with `data-media-query` attributes
2. Check that the `UnifiedLayoutWrapper` is wrapping your content
3. Verify Tailwind is processing the new variants (check browser dev tools)

### Conflicts with Regular Tailwind?
- Content variants have the same specificity as regular variants
- Use more specific selectors or `!important` if needed
- Consider order of classes in your HTML

### Performance Issues?
- The system adds minimal CSS overhead
- Use combined variants sparingly (`panel-open-cmd:` etc.)
- Profile with browser dev tools if needed

## 📖 Examples in Codebase

See these components for real-world usage:
- `ContentResponsiveDemo` - Comprehensive examples
- `UnifiedLayoutWrapper` - Core implementation
- `CompanionPanel` - Panel state integration

Happy coding with content-aware responsive design! 🎉