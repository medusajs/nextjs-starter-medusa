# 🧪 Filter System Test Suite

## Overview

Comprehensive test suite for the Dynamic Product Filtering system, covering unit tests, component tests, integration tests, and utility functions.

## 📁 Test Structure

```
src/
├── lib/data/__tests__/
│   └── products.test.ts                    # Server-side filtering logic
├── modules/store/components/filtered-products-container/__tests__/
│   ├── client.test.tsx                     # Client component behavior  
│   ├── integration.test.tsx                # End-to-end workflows
│   └── utils.test.ts                       # Utility functions
└── modules/layout/components/filter-panel-content/__tests__/
    └── index.test.tsx                      # Filter panel UI
```

## 🎯 Test Categories

### 1. **Unit Tests** (`products.test.ts`)
**Purpose**: Test server-side filtering logic and data processing

**Coverage**:
- ✅ Filter option discovery from product data
- ✅ Type extraction from product handles  
- ✅ Size extraction from variant options
- ✅ Hybrid filtering (API + client-side)
- ✅ Price range calculation
- ✅ Filter counting and sorting
- ✅ Edge cases (missing data, empty arrays)

**Key Test Cases**:
```typescript
describe('getProductFilters', () => {
  it('should extract filter options from product data')
  it('should handle products with missing data gracefully')
  it('should sort filters by count (most popular first)')
  it('should create friendly type labels from handles')
})

describe('listProductsWithSort - Hybrid Filtering', () => {
  it('should apply API filters for real database fields')
  it('should apply client-side filtering for derived fields')
  it('should combine API and client-side filtering')
  it('should handle pagination correctly with filtering')
})
```

### 2. **Component Tests** (`client.test.tsx`)
**Purpose**: Test React component behavior and state management

**Coverage**:
- ✅ URL parameter parsing and state synchronization
- ✅ Filter change handling and URL updates
- ✅ Race condition prevention
- ✅ Props passing to child components
- ✅ Error handling for malformed data

**Key Test Cases**:
```typescript
describe('FilteredProductsClient', () => {
  it('should render filter controls and product grid')
  it('should parse filters from URL search params')
  it('should handle filter changes and update URL')
  it('should preserve existing filters when adding new ones')
  it('should reset page to 1 when filters change')
})
```

### 3. **Filter Panel Tests** (`filter-panel-content/index.test.tsx`)
**Purpose**: Test filter UI rendering and interactions

**Coverage**:
- ✅ Dynamic filter section generation
- ✅ Filter option rendering with counts
- ✅ Checkbox state management
- ✅ Filter change event handling
- ✅ Data prioritization (props vs URL)

**Key Test Cases**:
```typescript
describe('FilterPanelContent', () => {
  it('should render filter sections based on dynamic filters')
  it('should not render sections with empty options')
  it('should handle filter changes correctly')
  it('should maintain checkbox states correctly')
})
```

### 4. **Integration Tests** (`integration.test.tsx`)
**Purpose**: Test complete filter workflows end-to-end

**Coverage**:
- ✅ Complete filter selection workflow
- ✅ Multiple filter combinations
- ✅ Filter state persistence across navigation
- ✅ Filter removal and clearing
- ✅ Page reset behavior
- ✅ Sort integration with filters

**Key Test Cases**:
```typescript
describe('Filter System Integration Tests', () => {
  it('should complete full filter workflow: select → URL update → display')
  it('should handle multiple filter selections correctly')
  it('should maintain filter state across page changes')
  it('should handle filter removal correctly')
})
```

### 5. **Utility Tests** (`utils.test.ts`)
**Purpose**: Test helper functions and data transformations

**Coverage**:
- ✅ URL parameter parsing utilities
- ✅ Filter data transformations
- ✅ Validation functions
- ✅ Error handling utilities
- ✅ Counting and merging functions

**Key Test Cases**:
```typescript
describe('Filter URL Utilities', () => {
  it('should parse comma-separated values correctly')
  it('should handle price range parsing')
  it('should build query string from filter updates')
})
```

## 🚀 Running Tests

### Run All Filter Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Run Specific Test Suites
```bash
# Server-side filtering tests
npm test -- products.test.ts

# Client component tests  
npm test -- client.test.tsx

# Integration workflow tests
npm test -- integration.test.tsx

# Filter panel UI tests
npm test -- filter-panel-content

# Utility function tests
npm test -- utils.test.ts
```

### Run Tests by Pattern
```bash
# All filter-related tests
npm test -- --testPathPattern="filter"

# Only integration tests
npm test -- --testNamePattern="integration"

# Only component tests
npm test -- --testPathPattern="components.*test"
```

## 📊 Coverage Goals

### Current Coverage Targets
- **Unit Tests**: 95%+ coverage for `getProductFilters` and `listProductsWithSort`
- **Component Tests**: 90%+ coverage for React components
- **Integration Tests**: 85%+ coverage for complete workflows
- **Utility Tests**: 100% coverage for helper functions

### Coverage Reports
```bash
# Generate detailed coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Jest Configuration
Tests use the existing Jest setup with:
- **jsdom environment** for React component testing
- **Next.js integration** for App Router testing
- **TypeScript support** with proper type checking
- **Module mocking** for external dependencies

### Mock Strategy
- **Next.js router**: Mocked for URL navigation testing
- **Medusa SDK**: Mocked for API call testing  
- **Child components**: Mocked for focused testing
- **Browser APIs**: Mocked for consistent testing

## 🧪 Test Data

### Mock Products
```typescript
const mockProducts: HttpTypes.StoreProduct[] = [
  {
    id: 'prod_1',
    title: 'Cotton T-Shirt Blue',
    handle: 't-shirt',
    material: 'cotton',
    tags: [{ id: 'tag_1', value: 'blue' }],
    variants: [
      {
        id: 'var_1',
        options: [{ id: 'opt_1', value: 'M' }],
        calculated_price: { calculated_amount: 2500 }
      }
    ]
  }
  // ... more products
]
```

### Mock Dynamic Filters
```typescript
const mockDynamicFilters = {
  tags: [{ id: 'blue', label: 'Blue', count: 2 }],
  types: [{ id: 't-shirt', label: 'T-Shirt', count: 1 }],
  materials: [{ id: 'cotton', label: 'Cotton', count: 2 }],
  sizes: [{ id: 'M', label: 'M', count: 2 }],
  // ... complete filter structure
}
```

## 🎯 Testing Best Practices

### 1. **Arrange, Act, Assert Pattern**
```typescript
it('should filter products by type', async () => {
  // Arrange
  const mockProducts = [/* test data */]
  const mockFilters = { types: ['t-shirt'] }
  
  // Act
  const result = await listProductsWithSort({
    clientFilters: mockFilters,
    countryCode: 'us'
  })
  
  // Assert  
  expect(result.response.products).toHaveLength(1)
  expect(result.response.products[0].handle).toBe('t-shirt')
})
```

### 2. **User-Centric Testing**
```typescript
it('should update URL when user selects filter', async () => {
  const user = userEvent.setup()
  render(<FilteredProductsClient {...props} />)
  
  // User action
  await user.click(screen.getByTestId('filter-button'))
  
  // User expectation
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('types=t-shirt')
    )
  })
})
```

### 3. **Edge Case Coverage**
```typescript
it('should handle malformed URL parameters gracefully', () => {
  mockGet.mockReturnValue('invalid,,filter,') // Malformed data
  
  render(<FilteredProductsClient {...props} />)
  
  // Should filter out empty values and not crash
  expect(screen.getByTestId('active-filters')).toBeInTheDocument()
})
```

### 4. **Async Testing**
```typescript
it('should handle async filter changes', async () => {
  const user = userEvent.setup()
  
  await user.click(filterButton)
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalled()
  })
})
```

## 🐛 Debugging Tests

### Common Issues & Solutions

#### **1. Mock Not Working**
```typescript
// Problem: Mock not being applied
jest.mock('next/navigation')

// Solution: Ensure mock is before imports
jest.mock('next/navigation')
import { useRouter } from 'next/navigation'
```

#### **2. State Not Updating**
```typescript
// Problem: Component state not reflecting changes
await user.click(button)
expect(result).toBe(expected) // Fails

// Solution: Wait for async updates
await user.click(button)
await waitFor(() => {
  expect(result).toBe(expected)
})
```

#### **3. URL Parameters Not Parsing**
```typescript
// Problem: Search params not being read
mockGet.mockReturnValue('t-shirt')

// Solution: Mock all parameter calls
mockGet
  .mockReturnValueOnce('t-shirt') // types
  .mockReturnValueOnce(null)      // tags
  .mockReturnValueOnce(null)      // materials
```

### Debug Helpers
```typescript
// Add debug output in tests
console.log('Active filters:', screen.getByTestId('active-filters').textContent)
console.log('Mock calls:', mockPush.mock.calls)

// Use screen.debug() to see rendered HTML
screen.debug()
```

## 📈 Continuous Integration

### Test Pipeline
```yaml
# .github/workflows/test.yml
name: Test Filter System
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run test:integration
```

### Quality Gates
- ✅ All tests must pass
- ✅ Coverage must be > 85%
- ✅ No console errors in test output
- ✅ TypeScript compilation successful

## 🔄 Test Maintenance

### Regular Updates
- **Product data structure changes** → Update mock data
- **New filter types** → Add test cases
- **API changes** → Update mock responses
- **UI changes** → Update component tests

### Performance Monitoring
- Monitor test execution time
- Optimize slow tests with focused mocking
- Use `test.only()` for debugging specific tests
- Clean up unused test files and mocks

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Guide](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [User Event API](https://testing-library.com/docs/user-event/intro)

**The comprehensive test suite ensures the filter system is robust, reliable, and maintainable for production use.** 🚀