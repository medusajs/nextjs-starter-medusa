# 🎯 Filter System Components

## Overview

The Filter System provides a comprehensive set of components for product filtering, built on the Companion Panel architecture. The system automatically discovers filter options from product data and provides both server-side and client-side filtering capabilities.

## 🏗️ Component Architecture

```
FilteredProductsContainer (Server Component)
├── Data Discovery & API Filtering
└── FilteredProductsClient (Client Component)
    ├── FilterSortBar (Filter Controls)
    │   └── Opens FilterPanelContent via Companion Panel
    └── PaginatedProducts (Results Display)
```

## 🧩 Core Components

### FilteredProductsContainer
**Type**: Server Component  
**Location**: `src/modules/store/components/filtered-products-container/index.tsx`

**Purpose**: Orchestrates data fetching and filtering logic

**Props**:
```typescript
interface FilteredProductsContainerProps {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  title?: string
  searchParams: Record<string, string | string[]>
}
```

**Key Features**:
- Parses filter parameters from URL search params
- Discovers available filters from product data
- Applies hybrid filtering (API + client-side)
- Handles pagination and sorting
- Passes filtered data to client component

**Usage**:
```tsx
<FilteredProductsContainer
  sortBy={searchParams.sortBy as SortOptions}
  page={Number(searchParams.page) || 1}
  countryCode={params.countryCode}
  searchParams={searchParams}
/>
```

### FilteredProductsClient
**Type**: Client Component  
**Location**: `src/modules/store/components/filtered-products-container/client.tsx`

**Purpose**: Manages filter state and renders UI components

**Props**:
```typescript
interface FilteredProductsClientProps {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string  
  productsIds?: string[]
  title?: string
  dynamicFilters: DynamicFilters | null
  products: HttpTypes.StoreProduct[]
  count: number
  region: HttpTypes.StoreRegion
}
```

**Key Features**:
- Synchronizes filter state with URL parameters
- Handles filter change events and URL updates
- Manages race conditions in filter state
- Renders filter controls and product grid

**State Management**:
```typescript
const [activeFilters, setActiveFilters] = useState(getCurrentFilters)

// Prevents race conditions by reading directly from URL
const getCurrentFiltersFromActualURL = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    tags: params.get('tags')?.split(',').filter(Boolean) || [],
    types: params.get('types')?.split(',').filter(Boolean) || [],
    materials: params.get('materials')?.split(',').filter(Boolean) || [],
    sizes: params.get('sizes')?.split(',').filter(Boolean) || []
  }
}
```

### FilterSortBar
**Type**: Client Component  
**Location**: `src/modules/store/components/filter-sort-bar/index.tsx`

**Purpose**: Provides filter and sort controls

**Props**:
```typescript
interface FilterSortBarProps {
  sortBy: SortOptions
  dynamicFilters?: DynamicFilters | null
  activeFilters: ActiveFilters
  onFilterChange: (filterId: string, value: any) => void
}
```

**Key Features**:
- Filter button with active filter count badge
- Sort dropdown integration
- Opens filter panel via Companion Panel system
- Responsive design (button on mobile, always visible on desktop)

**Integration with Companion Panel**:
```typescript
const openPanel = (panelType: CompanionPanelType, data?: any) => {
  // Passes dynamic filters to panel
  openCompanionPanel(panelType, {
    filters: getActiveFiltersFromURL(),
    dynamicFilters,
    onFilterChange
  })
}
```

### FilterPanelContent
**Type**: Client Component  
**Location**: `src/modules/layout/components/filter-panel-content/index.tsx`

**Purpose**: Renders the filter options panel

**Props**:
```typescript
interface FilterPanelContentProps {
  data?: {
    filters?: ActiveFilters
    dynamicFilters?: DynamicFilters
    onFilterChange?: (filterId: string, value: any) => void
  }
  dynamicFilters?: DynamicFilters | null
}
```

**Key Features**:
- Dynamic filter section generation based on available data
- Multiple input types: checkboxes, price ranges, color swatches
- Real-time filter count updates
- Responsive design with proper touch targets

**Dynamic Filter Building**:
```typescript
function buildFiltersFromDynamic(dynamicFilters: DynamicFilters) {
  const sections = []
  
  // Product Types
  if (dynamicFilters?.types && dynamicFilters.types.length > 0) {
    sections.push({
      id: 'types',
      label: 'Product Types',
      type: 'checkbox' as const,
      options: dynamicFilters.types
    })
  }
  
  // Sizes  
  if (dynamicFilters?.sizes && dynamicFilters.sizes.length > 0) {
    sections.push({
      id: 'sizes',
      label: 'Sizes', 
      type: 'checkbox' as const,
      options: dynamicFilters.sizes
    })
  }
  
  return sections
}
```

### FilterModule
**Type**: Client Component  
**Location**: `src/modules/store/components/filter-module/index.tsx`

**Purpose**: Renders individual filter sections

**Props**:
```typescript
interface FilterModuleProps {
  filters: FilterConfig[]
  activeFilters: ActiveFilters
  onFilterChange: (filterId: string, value: any) => void
}
```

**Supported Filter Types**:
- **Checkbox**: Multi-select options with counts
- **Price Range**: Min/max sliders  
- **Color Swatches**: Visual color selection
- **Size Grid**: Size-specific layout

**Filter Types Implementation**:
```typescript
const renderFilterInput = (filter: FilterConfig) => {
  switch (filter.type) {
    case 'checkbox':
      return <CheckboxGroup options={filter.options} />
    case 'price':
      return <PriceRangeSlider min={filter.min} max={filter.max} />
    case 'color':
      return <ColorSwatches colors={filter.options} />
    default:
      return null
  }
}
```

## 📊 Data Flow

### Filter Discovery Process

1. **Product Scanning**: `getProductFilters()` analyzes all products
2. **Data Extraction**: Extracts filter options from various product fields
3. **Smart Mapping**: Maps raw data to user-friendly labels
4. **Count Calculation**: Calculates how many products match each filter
5. **Result Formatting**: Returns structured filter data

### Filter Application Process

1. **URL Parsing**: Extract filter parameters from search params
2. **State Synchronization**: Update component state with URL values
3. **Hybrid Filtering**: Apply both API and client-side filters
4. **Result Rendering**: Display filtered products with updated counts

### Filter Change Process

1. **User Interaction**: User selects/deselects filter option
2. **State Update**: Component state updated with new selection
3. **URL Update**: Browser URL updated with new parameters
4. **Server Re-render**: Server component re-executes with new params
5. **Data Filtering**: Filters applied to product data  
6. **UI Update**: Results re-rendered with new data

## 🎨 Styling & Responsive Design

### Mobile Design
- **Filter Button**: Prominent button with filter count badge
- **Slide-out Panel**: Full-screen overlay for filter options
- **Touch Targets**: Large, accessible touch areas
- **Scrollable Content**: Vertical scroll for long filter lists

### Desktop Design  
- **Persistent Sidebar**: Filter panel slides out as persistent column
- **Hover States**: Interactive hover effects for filter options
- **Compact Layout**: Space-efficient filter organization
- **Grid Integration**: Seamless integration with product grid

### CSS Classes
```scss
// Filter button styling
.filter-button {
  @apply relative inline-flex items-center px-4 py-2 border border-gray-300;
  
  &__badge {
    @apply absolute -top-2 -right-2 bg-red-500 text-white rounded-full;
  }
}

// Filter panel content
.filter-panel {
  @apply space-y-6 p-4;
  
  &__section {
    @apply border-b border-gray-200 pb-4;
  }
  
  &__options {
    @apply space-y-2 mt-3;
  }
}
```

## 🔧 Customization

### Adding New Filter Types

1. **Extend DynamicFilters type**:
```typescript
interface DynamicFilters {
  // ... existing types
  brands: Array<{ id: string; label: string; count: number }>
}
```

2. **Add extraction logic**:
```typescript
// In getProductFilters()
const brandCounts = new Map()
products.forEach(product => {
  const brand = product.metadata?.brand
  if (brand) {
    const existing = brandCounts.get(brand) || { label: brand, count: 0 }
    brandCounts.set(brand, { ...existing, count: existing.count + 1 })
  }
})
```

3. **Add UI component**:
```typescript
// In FilterPanelContent
if (dynamicFilters?.brands && dynamicFilters.brands.length > 0) {
  sections.push({
    id: 'brands',
    label: 'Brands',
    type: 'checkbox' as const,
    options: dynamicFilters.brands
  })
}
```

### Custom Filter Components

```typescript
// Custom filter component
const CustomFilterComponent = ({ filter, activeFilters, onFilterChange }) => {
  return (
    <div className="custom-filter">
      <h3>{filter.label}</h3>
      {filter.options.map(option => (
        <CustomFilterOption 
          key={option.id}
          option={option}
          isActive={activeFilters[filter.id]?.includes(option.id)}
          onChange={(value) => onFilterChange(filter.id, value)}
        />
      ))}
    </div>
  )
}

// Register custom component
const filterComponents = {
  'custom': CustomFilterComponent,
  'checkbox': CheckboxFilterComponent,
  'price': PriceRangeComponent
}
```

## 🧪 Testing

### Unit Tests
```typescript
describe('FilteredProductsClient', () => {
  it('should synchronize filters with URL parameters', () => {
    const mockSearchParams = new URLSearchParams('types=t-shirt&sizes=M,L')
    render(<FilteredProductsClient searchParams={mockSearchParams} />)
    
    expect(getActiveFilters()).toEqual({
      types: ['t-shirt'],
      sizes: ['M', 'L']
    })
  })
  
  it('should update URL when filters change', () => {
    const { getByLabelText } = render(<FilteredProductsClient />)
    
    fireEvent.click(getByLabelText('T-Shirt'))
    
    expect(window.location.search).toContain('types=t-shirt')
  })
})
```

### Integration Tests
```typescript
describe('Filter System Integration', () => {
  it('should filter products based on selected types', async () => {
    const products = await getFilteredProducts({ types: ['t-shirt'] })
    
    expect(products).toHaveLength(1)
    expect(products[0].handle).toBe('t-shirt')
  })
  
  it('should maintain filter state across navigation', () => {
    // Test URL persistence and state restoration
  })
})
```

## 🚀 Performance Optimization

### Current Optimizations
- **Next.js caching** leverages automatic request caching
- **Hybrid filtering** reduces API payload sizes
- **Client-side post-processing** for derived fields
- **Memoized computations** prevent unnecessary recalculations

### Future Optimizations
- **useMemo hooks** for expensive filter calculations
- **Virtual scrolling** for large filter lists
- **Debounced search** for real-time filtering
- **Service worker caching** for offline filter state

## 📝 Migration Notes

### From Static to Dynamic Filters
1. Remove hardcoded filter configurations
2. Update component props to accept `dynamicFilters`
3. Replace static filter logic with dynamic discovery
4. Test with actual product data

### Breaking Changes
- Filter data structure changed from static config to dynamic discovery
- Component props updated to include `dynamicFilters`
- URL parameter format standardized across filter types

## 🔗 Related Documentation
- [Companion Panel System](../companion-panel/index.md)
- [Dynamic Filters Guide](../guides/dynamic-filters.md)
- [State Management](../state-management/index.md)
- [Layout System](../layout/index.md)