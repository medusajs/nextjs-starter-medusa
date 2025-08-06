# 🎯 Dynamic Product Filters Guide

## Overview

The **Dynamic Filter System** provides intelligent, data-driven product filtering for your Medusa store. Instead of static, hardcoded filters, the system automatically discovers filter options from your actual product data and provides both server-side and client-side filtering capabilities.

## 🚀 Key Features

- **Auto-Discovery**: Automatically extracts filter options from product data
- **Hybrid Filtering**: Combines API-level filtering with client-side processing  
- **Real Data Driven**: No fake fallback data - only shows actual product attributes
- **Type Extraction**: Derives product types from handles when database fields are empty
- **Size Detection**: Extracts sizes from product variant options
- **Performance Optimized**: Leverages Next.js caching for fast responses

## 🏗️ Architecture

### Component Structure
```
FilteredProductsContainer (Server Component)
├── getProductFilters() - Discovers available filters from products
├── listProductsWithSort() - Fetches and filters products
└── FilteredProductsClient (Client Component)
    ├── FilterSortBar - Filter controls and sorting
    │   └── FilterPanelContent - Filter options panel
    └── PaginatedProducts - Product grid display
```

### Data Flow
```
1. Server scans products → Discovers filter options
2. User selects filter → URL updates with parameters  
3. Server applies hybrid filtering:
   - API filters: tags, materials, price (real DB fields)
   - Client filters: types, sizes (derived from data)
4. Results rendered with updated counts
```

## 📊 Filter Types

### **Product Types** (Client-Side Filtered)
- **Source**: Extracted from `product.handle`
- **Mapping**: `t-shirt` → "T-Shirt", `sweatpants` → "Sweatpants"
- **Why Client-Side**: Product `type_id` fields are often null in Medusa

### **Sizes** (Client-Side Filtered)  
- **Source**: Extracted from `variant.options[].value`
- **Processing**: Normalized to uppercase (M, S, L, XL)
- **Why Client-Side**: No dedicated size field exists at product level

### **Materials** (API Filtered)
- **Source**: `product.material` or `product.metadata.material`
- **Processing**: Direct API filtering when available

### **Tags/Colors** (API Filtered)
- **Source**: `product.tags[].value`
- **Processing**: API-level filtering for performance

### **Price Range** (API Filtered)
- **Source**: `variant.calculated_price.calculated_amount`
- **Processing**: Min/max range extraction from all variants

## 🎯 Implementation Details

### Server Component: FilteredProductsContainer

**Location**: `src/modules/store/components/filtered-products-container/index.tsx`

**Responsibilities**:
- Parse filter parameters from URL
- Fetch dynamic filter options
- Apply hybrid filtering strategy
- Pass filtered data to client

**Key Logic**:
```typescript
// Hybrid filtering approach
const clientFilters = {
  types: filters.types,  // Handle-based filtering
  sizes: filters.sizes   // Variant option filtering
}

const queryParams = {
  tag_id: filters.tags,      // API filtering  
  material: filters.materials // API filtering
}
```

### Client Component: FilteredProductsClient

**Location**: `src/modules/store/components/filtered-products-container/client.tsx`

**Responsibilities**:
- Manage filter state from URL parameters
- Handle filter change events
- Update URL without full page refresh
- Render filter UI and product grid

**Key Features**:
- URL state synchronization
- Race condition prevention  
- Filter persistence across selections

### Data Discovery: getProductFilters

**Location**: `src/lib/data/products.ts`

**Responsibilities**:
- Scan all products for available filter options
- Extract types from product handles
- Extract sizes from variant options
- Calculate filter counts and labels
- Return only filters with actual data

**Smart Extraction Logic**:
```typescript
// Type extraction from handles
const typeMapping = {
  't-shirt': 'T-Shirt',
  'sweatpants': 'Sweatpants', 
  'shorts': 'Shorts',
  'sweatshirt': 'Sweatshirt'
}

// Size extraction from variants
variant.options?.forEach((option) => {
  const size = option.value.toUpperCase()
  sizeCounts.set(size, { label: size, count: current.count + 1 })
})
```

### Hybrid Filtering: listProductsWithSort

**Location**: `src/lib/data/products.ts`

**Responsibilities**:
- Apply API-level filters to reduce data transfer
- Apply client-side filters for derived fields
- Handle pagination and sorting
- Return filtered count for accurate pagination

**Performance Strategy**:
```typescript
// 1. API filtering (fast, server-side)
const products = await listProducts({
  queryParams: { tag_id: filters.tags, material: filters.materials }
})

// 2. Client filtering (post-processing)  
const filtered = products.filter(product => {
  return clientFilters.types.includes(product.handle)
})
```

## 🎛️ Filter Panel System

### FilterSortBar Component

**Location**: `src/modules/store/components/filter-sort-bar/index.tsx`

**Features**:
- Filter button with active filter count
- Sort dropdown integration
- Dynamic filter data passing
- Responsive design

### FilterPanelContent Component  

**Location**: `src/modules/layout/components/filter-panel-content/index.tsx`

**Features**:
- Dynamic filter section generation
- Checkbox and range inputs
- Real-time URL state synchronization
- Filter option counts display

## 🚀 Usage Examples

### Basic Implementation

```tsx
// In your page component
<FilteredProductsContainer
  sortBy={sortBy}
  page={page}
  countryCode={countryCode}
  searchParams={searchParams}
/>
```

### Custom Filter Mapping

```typescript
// In getProductFilters()
const typeMapping = {
  'custom-handle': 'Custom Display Name',
  'another-handle': 'Another Name'
}
```

### Adding New Filter Types

1. **Add to data extraction**:
```typescript
// In getProductFilters()
const brandCounts = new Map()
products.forEach(product => {
  if (product.metadata?.brand) {
    const brand = product.metadata.brand
    brandCounts.set(brand, { label: brand, count: existing.count + 1 })
  }
})
```

2. **Add to result object**:
```typescript
const result = {
  // ... existing filters
  brands: Array.from(brandCounts.entries())
    .sort(sortByCount)
    .map(([id, data]) => ({ id, ...data }))
}
```

3. **Add to filtering logic**:
```typescript
// Client-side filtering
if (clientFilters.brands && clientFilters.brands.length > 0) {
  filteredProducts = filteredProducts.filter(product => {
    return clientFilters.brands.includes(product.metadata?.brand)
  })
}
```

## 🔧 Configuration

### URL Parameters

The system uses URL parameters for filter state:

```
/store?types=t-shirt,sweatshirt&sizes=M,L&materials=cotton&price_min=10&price_max=50
```

**Parameter Format**:
- **Multiple values**: Comma-separated (`types=t-shirt,shorts`)
- **Price range**: Separate min/max (`price_min=10&price_max=50`)
- **Page reset**: Automatically resets to page 1 on filter change

### TypeScript Types

```typescript
interface DynamicFilters {
  tags: Array<{ id: string; label: string; count: number }>
  types: Array<{ id: string; label: string; count: number }>
  materials: Array<{ id: string; label: string; count: number }>
  sizes: Array<{ id: string; label: string; count: number }>
  collections: Array<{ id: string; label: string; count: number }>
  categories: Array<{ id: string; label: string; count: number }>
  priceRange: { min: number; max: number }
}
```

## 🎯 Performance Considerations

### Next.js Caching
- **Data Cache**: API calls with same parameters are cached
- **Router Cache**: Client-side route segment caching
- **Request Memoization**: Duplicate requests during render are deduplicated

### Optimization Strategies
- **Hybrid filtering** reduces API payload size
- **Client-side post-processing** for derived fields
- **Memoized filter extraction** for repeated requests
- **Pagination** limits data transfer

### Future Optimizations
- **Client-side memoization** with `useMemo()` for instant filtering
- **State-based filtering** to eliminate server round-trips
- **Pre-computed filter indexes** for large catalogs

## 🐛 Troubleshooting

### No Filters Showing
1. **Check product data**: Ensure products have the required fields
2. **Verify data extraction**: Check console logs for discovered filters
3. **Confirm component props**: Ensure `dynamicFilters` is passed correctly

### Filters Not Working
1. **Check URL parameters**: Verify filter values are in URL
2. **Review API calls**: Check if correct parameters are sent to API
3. **Validate client filtering**: Ensure derived field logic is correct

### Performance Issues
1. **Monitor API call timing**: Check for cache hits vs network calls
2. **Review filter complexity**: Simplify complex client-side filtering
3. **Consider memoization**: Implement client-side caching for instant responses

## 📝 Development Notes

### Debug Logging
The system includes comprehensive debug logging:
- `🔍 COMPLETE PRODUCT DATA DEBUG`: Full product structure analysis
- `🔴 SERVER FILTER DEBUG`: Applied filters and API queries  
- `🔵 CLIENT COMPONENT`: Data flow to UI components

### Testing Approach
1. Test with empty product data (no filters should show)
2. Test with minimal data (only populated filters appear)  
3. Test filter combinations (multiple selections work)
4. Test URL direct access (bookmarkable filter states)

### Extension Points
- **Custom filter types**: Add new filter extraction logic
- **UI customization**: Modify filter panel components
- **API integration**: Extend Medusa API filtering capabilities
- **Analytics**: Track filter usage patterns