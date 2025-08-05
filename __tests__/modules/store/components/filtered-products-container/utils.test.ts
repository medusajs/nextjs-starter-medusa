/**
 * Utility functions tests for filter system
 */

// Test URL parameter parsing utilities
describe('Filter URL Utilities', () => {
  describe('parseFilterParams', () => {
    // This would test a utility function if we extracted it
    it('should parse comma-separated values correctly', () => {
      const parseCommaSeparated = (value: string | null) => 
        value ? value.split(',').filter(Boolean) : []

      expect(parseCommaSeparated('a,b,c')).toEqual(['a', 'b', 'c'])
      expect(parseCommaSeparated('single')).toEqual(['single'])
      expect(parseCommaSeparated('')).toEqual([])
      expect(parseCommaSeparated(null)).toEqual([])
      expect(parseCommaSeparated('a,,b,c,')).toEqual(['a', 'b', 'c']) // Filters empty values
    })

    it('should handle price range parsing', () => {
      const parsePriceRange = (min: string | null, max: string | null) => {
        const minNum = min ? parseInt(min) : undefined
        const maxNum = max ? parseInt(max) : undefined
        
        if (isNaN(minNum!) && isNaN(maxNum!)) return undefined
        if (isNaN(minNum!) || isNaN(maxNum!)) return undefined // Both required for valid range
        
        return { min: minNum, max: maxNum }
      }

      expect(parsePriceRange('10', '50')).toEqual({ min: 10, max: 50 })
      expect(parsePriceRange('0', '100')).toEqual({ min: 0, max: 100 })
      expect(parsePriceRange('not-a-number', '50')).toBeUndefined()
      expect(parsePriceRange('10', 'not-a-number')).toBeUndefined()
      expect(parsePriceRange(null, null)).toBeUndefined()
      expect(parsePriceRange('10', null)).toBeUndefined()
    })
  })

  describe('createQueryString', () => {
    it('should build query string from filter updates', () => {
      const createQueryString = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams()
        
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            params.set(key, value)
          }
        })
        
        return params.toString()
      }

      const updates = {
        types: 't-shirt,sweater',
        materials: 'cotton',
        sizes: null, // Should be excluded
        page: '1'
      }

      const result = createQueryString(updates)
      
      expect(result).toContain('types=t-shirt%2Csweater')
      expect(result).toContain('materials=cotton')
      expect(result).toContain('page=1')
      expect(result).not.toContain('sizes')
    })

    it('should handle empty updates', () => {
      const createQueryString = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams()
        
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            params.set(key, value)
          }
        })
        
        return params.toString()
      }

      expect(createQueryString({})).toBe('')
      expect(createQueryString({ filter: null })).toBe('')
      expect(createQueryString({ filter: '' })).toBe('')
    })
  })
})

// Test filter transformation utilities
describe('Filter Data Transformations', () => {
  describe('normalizeSize', () => {
    it('should normalize size values', () => {
      const normalizeSize = (size: string) => size.toUpperCase().trim()

      expect(normalizeSize('small')).toBe('SMALL')
      expect(normalizeSize('m')).toBe('M')
      expect(normalizeSize(' large ')).toBe('LARGE')
      expect(normalizeSize('xl')).toBe('XL')
    })
  })

  describe('createFriendlyLabel', () => {
    it('should create friendly labels from product handles', () => {
      const typeMapping: Record<string, string> = {
        't-shirt': 'T-Shirt',
        'sweatpants': 'Sweatpants',
        'shorts': 'Shorts',
        'sweatshirt': 'Sweatshirt'
      }

      const createFriendlyLabel = (handle: string, fallbackTitle?: string) => {
        return typeMapping[handle.toLowerCase()] || fallbackTitle || handle
      }

      expect(createFriendlyLabel('t-shirt')).toBe('T-Shirt')
      expect(createFriendlyLabel('custom-item', 'Custom Product')).toBe('Custom Product')
      expect(createFriendlyLabel('unknown')).toBe('unknown')
    })
  })

  describe('sortByCount', () => {
    it('should sort filter options by count descending', () => {
      const sortByCount = (a: [string, { count: number }], b: [string, { count: number }]) => 
        b[1].count - a[1].count

      const filters = [
        ['small', { count: 5 }],
        ['large', { count: 15 }],
        ['medium', { count: 10 }]
      ] as [string, { count: number }][]

      const sorted = filters.sort(sortByCount)

      expect(sorted[0][0]).toBe('large')  // 15 count
      expect(sorted[1][0]).toBe('medium') // 10 count
      expect(sorted[2][0]).toBe('small')  // 5 count
    })
  })
})

// Test filter validation utilities  
describe('Filter Validation', () => {
  describe('validateFilterValue', () => {
    it('should validate filter array values', () => {
      const validateFilterArray = (value: any): string[] => {
        if (!Array.isArray(value)) return []
        return value.filter(v => typeof v === 'string' && v.length > 0)
      }

      expect(validateFilterArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
      expect(validateFilterArray(['a', '', 'c'])).toEqual(['a', 'c'])
      expect(validateFilterArray(['a', null, 'c'])).toEqual(['a', 'c'])
      expect(validateFilterArray([])).toEqual([])
      expect(validateFilterArray('not-array')).toEqual([])
      expect(validateFilterArray(null)).toEqual([])
    })

    it('should validate price range values', () => {
      interface PriceRange {
        min?: number
        max?: number
      }

      const validatePriceRange = (value: any): PriceRange | undefined => {
        if (!value || typeof value !== 'object') return undefined
        
        const { min, max } = value
        const minNum = typeof min === 'number' ? min : parseInt(min)
        const maxNum = typeof max === 'number' ? max : parseInt(max)
        
        if (isNaN(minNum) || isNaN(maxNum)) return undefined
        if (minNum < 0 || maxNum < 0) return undefined
        if (minNum >= maxNum) return undefined
        
        return { min: minNum, max: maxNum }
      }

      expect(validatePriceRange({ min: 10, max: 50 })).toEqual({ min: 10, max: 50 })
      expect(validatePriceRange({ min: '10', max: '50' })).toEqual({ min: 10, max: 50 })
      expect(validatePriceRange({ min: 50, max: 10 })).toBeUndefined() // min >= max
      expect(validatePriceRange({ min: -10, max: 50 })).toBeUndefined() // negative values
      expect(validatePriceRange({ min: 'invalid', max: 50 })).toBeUndefined()
      expect(validatePriceRange(null)).toBeUndefined()
      expect(validatePriceRange('not-object')).toBeUndefined()
    })
  })
})

// Test filter counting utilities
describe('Filter Counting', () => {
  describe('countActiveFilters', () => {
    it('should count active filters correctly', () => {
      interface ActiveFilters {
        types: string[]
        materials: string[]
        sizes: string[]
        tags: string[]
        priceRange?: { min: number; max: number }
      }

      const countActiveFilters = (filters: ActiveFilters): number => {
        let count = 0
        
        count += filters.types.length
        count += filters.materials.length
        count += filters.sizes.length
        count += filters.tags.length
        
        if (filters.priceRange) count += 1
        
        return count
      }

      expect(countActiveFilters({
        types: ['t-shirt'],
        materials: ['cotton', 'wool'],
        sizes: [],
        tags: ['blue'],
        priceRange: { min: 10, max: 50 }
      })).toBe(5) // 1 + 2 + 0 + 1 + 1

      expect(countActiveFilters({
        types: [],
        materials: [],
        sizes: [],
        tags: []
      })).toBe(0)

      expect(countActiveFilters({
        types: ['t-shirt', 'sweater'],
        materials: [],
        sizes: ['M', 'L', 'XL'],
        tags: []
      })).toBe(5) // 2 + 0 + 3 + 0
    })
  })
})

// Test filter merging utilities
describe('Filter Merging', () => {
  describe('mergeFilters', () => {
    it('should merge filter states correctly', () => {
      interface FilterState {
        types: string[]
        materials: string[]
        sizes: string[]
        tags: string[]
      }

      const mergeFilters = (base: FilterState, updates: Partial<FilterState>): FilterState => {
        return {
          ...base,
          ...updates
        }
      }

      const baseFilters = {
        types: ['t-shirt'],
        materials: ['cotton'],
        sizes: [],
        tags: ['blue']
      }

      const updates = {
        materials: ['cotton', 'wool'],
        sizes: ['M', 'L']
      }

      const result = mergeFilters(baseFilters, updates)

      expect(result).toEqual({
        types: ['t-shirt'],
        materials: ['cotton', 'wool'],
        sizes: ['M', 'L'],
        tags: ['blue']
      })
    })
  })

  describe('toggleFilterValue', () => {
    it('should toggle values in filter arrays', () => {
      const toggleFilterValue = (currentValues: string[], valueToToggle: string): string[] => {
        const index = currentValues.indexOf(valueToToggle)
        
        if (index === -1) {
          // Add value
          return [...currentValues, valueToToggle]
        } else {
          // Remove value
          return currentValues.filter(v => v !== valueToToggle)
        }
      }

      expect(toggleFilterValue(['a', 'b'], 'c')).toEqual(['a', 'b', 'c'])
      expect(toggleFilterValue(['a', 'b', 'c'], 'b')).toEqual(['a', 'c'])
      expect(toggleFilterValue([], 'a')).toEqual(['a'])
      expect(toggleFilterValue(['a'], 'a')).toEqual([])
    })
  })
})

// Test error handling utilities
describe('Filter Error Handling', () => {
  describe('safeParseFilters', () => {
    it('should handle malformed filter data gracefully', () => {
      interface SafeFilterResult {
        types: string[]
        materials: string[]
        sizes: string[]
        tags: string[]
        errors: string[]
      }

      const safeParseFilters = (data: any): SafeFilterResult => {
        const result: SafeFilterResult = {
          types: [],
          materials: [],
          sizes: [],
          tags: [],
          errors: []
        }

        try {
          if (data.types && Array.isArray(data.types)) {
            result.types = data.types.filter(v => typeof v === 'string')
          } else if (data.types) {
            result.errors.push('Invalid types format')
          }

          if (data.materials && Array.isArray(data.materials)) {
            result.materials = data.materials.filter(v => typeof v === 'string')
          } else if (data.materials) {
            result.errors.push('Invalid materials format')
          }

          if (data.sizes && Array.isArray(data.sizes)) {
            result.sizes = data.sizes.filter(v => typeof v === 'string')
          } else if (data.sizes) {
            result.errors.push('Invalid sizes format')
          }

          if (data.tags && Array.isArray(data.tags)) {
            result.tags = data.tags.filter(v => typeof v === 'string')
          } else if (data.tags) {
            result.errors.push('Invalid tags format')
          }
        } catch (error) {
          result.errors.push('Parse error')
        }

        return result
      }

      // Valid data
      expect(safeParseFilters({
        types: ['t-shirt'],
        materials: ['cotton']
      })).toEqual({
        types: ['t-shirt'],
        materials: ['cotton'],
        sizes: [],
        tags: [],
        errors: []
      })

      // Invalid data types
      const result = safeParseFilters({
        types: 'not-array',
        materials: ['cotton', 123, 'wool'], // Mixed types
        sizes: null
      })

      expect(result.types).toEqual([])
      expect(result.materials).toEqual(['cotton', 'wool']) // Numbers filtered out
      expect(result.sizes).toEqual([])
      expect(result.errors).toContain('Invalid types format')
    })
  })
})