/**
 * @jest-environment node
 */

// Mock the SDK and other dependencies before importing
jest.mock('../../../src/lib/config', () => ({
  sdk: {
    client: {
      fetch: jest.fn()
    }
  }
}))

jest.mock('../../../src/lib/data/regions', () => ({
  getRegion: jest.fn(),
  retrieveRegion: jest.fn()
}))

jest.mock('../../../src/lib/data/cookies', () => ({
  getAuthHeaders: jest.fn(),
  getCacheOptions: jest.fn()
}))

import { getProductFilters } from '../../../src/lib/data/products'
import { HttpTypes } from '@medusajs/types'

// Mock product data for testing
const mockProducts: HttpTypes.StoreProduct[] = [
  {
    id: 'prod_1',
    title: 'Cotton T-Shirt',
    handle: 't-shirt',
    material: 'cotton',
    type: null,
    type_id: null,
    tags: [
      { id: 'tag_1', value: 'blue' },
      { id: 'tag_2', value: 'casual' }
    ],
    metadata: { brand: 'TestBrand' },
    collection_id: 'col_1',
    categories: [{ id: 'cat_1', name: 'Clothing' }],
    variants: [
      {
        id: 'var_1',
        title: 'Small',
        options: [{ id: 'opt_1', value: 'S' }],
        calculated_price: { calculated_amount: 2000 }
      },
      {
        id: 'var_2', 
        title: 'Medium',
        options: [{ id: 'opt_2', value: 'M' }],
        calculated_price: { calculated_amount: 2000 }
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'Polyester Sweatshirt',
    handle: 'sweatshirt',
    material: 'polyester',
    type: null,
    type_id: null,
    tags: [
      { id: 'tag_3', value: 'red' },
      { id: 'tag_4', value: 'warm' }
    ],
    metadata: { brand: 'TestBrand' },
    collection_id: 'col_2',
    categories: [{ id: 'cat_1', name: 'Clothing' }],
    variants: [
      {
        id: 'var_3',
        title: 'Large',
        options: [{ id: 'opt_3', value: 'L' }],
        calculated_price: { calculated_amount: 3500 }
      }
    ]
  },
  {
    id: 'prod_3',
    title: 'Denim Jeans',
    handle: 'jeans',
    material: null,
    type: null,
    type_id: null,
    tags: [],
    metadata: null,
    collection_id: null,
    categories: [],
    variants: [
      {
        id: 'var_4',
        title: 'Medium',
        options: [{ id: 'opt_4', value: 'M' }],
        calculated_price: { calculated_amount: 4000 }
      },
      {
        id: 'var_5',
        title: 'Large', 
        options: [{ id: 'opt_5', value: 'L' }],
        calculated_price: { calculated_amount: 4000 }
      }
    ]
  }
] as any

describe('getProductFilters', () => {
  const { sdk } = require('../../../src/lib/config')
  const { getRegion } = require('../../../src/lib/data/regions')
  const { getAuthHeaders, getCacheOptions } = require('../../../src/lib/data/cookies')

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default mocks
    getRegion.mockResolvedValue({
      id: 'reg_1',
      name: 'US',
      currency_code: 'usd'
    })
    
    getAuthHeaders.mockResolvedValue({})
    getCacheOptions.mockResolvedValue({})
    
    sdk.client.fetch.mockResolvedValue({
      products: mockProducts,
      count: mockProducts.length
    })
  })

  it('should extract filter options from product data', async () => {
    const result = await getProductFilters({
      countryCode: 'us'
    })

    expect(result).toEqual({
      tags: expect.arrayContaining([
        expect.objectContaining({ id: 'tag_1', label: 'blue', count: 1 }),
        expect.objectContaining({ id: 'tag_3', label: 'red', count: 1 }),
        expect.objectContaining({ id: 'tag_2', label: 'casual', count: 1 }),
        expect.objectContaining({ id: 'tag_4', label: 'warm', count: 1 })
      ]),
      types: expect.arrayContaining([
        expect.objectContaining({ id: 't-shirt', label: 'T-Shirt', count: 1 }),
        expect.objectContaining({ id: 'sweatshirt', label: 'Sweatshirt', count: 1 }),
        expect.objectContaining({ id: 'jeans', label: 'Denim Jeans', count: 1 })
      ]),
      materials: expect.arrayContaining([
        expect.objectContaining({ id: 'cotton', label: 'cotton', count: 1 }),
        expect.objectContaining({ id: 'polyester', label: 'polyester', count: 1 })
      ]),
      sizes: expect.arrayContaining([
        expect.objectContaining({ id: 'S', label: 'S', count: 1 }),
        expect.objectContaining({ id: 'M', label: 'M', count: 2 }),
        expect.objectContaining({ id: 'L', label: 'L', count: 2 })
      ]),
      collections: expect.arrayContaining([
        expect.objectContaining({ id: 'col_1', count: 1 }),
        expect.objectContaining({ id: 'col_2', count: 1 })
      ]),
      categories: expect.arrayContaining([
        expect.objectContaining({ id: 'cat_1', label: 'Clothing', count: 2 })
      ]),
      priceRange: {
        min: 2000,
        max: 4000
      }
    })
  })

  it('should handle products with missing data gracefully', async () => {
    const incompleteProducts = [
      {
        id: 'prod_incomplete',
        title: 'Incomplete Product',
        handle: 'incomplete',
        material: null,
        type: null,
        tags: [],
        metadata: null,
        variants: []
      }
    ] as any

    sdk.client.fetch.mockResolvedValue({
      products: incompleteProducts,
      count: 1
    })

    const result = await getProductFilters({
      countryCode: 'us'
    })

    expect(result.tags).toEqual([])
    expect(result.materials).toEqual([])
    expect(result.sizes).toEqual([])
    expect(result.types).toHaveLength(1)
    expect(result.types[0]).toEqual(
      expect.objectContaining({ 
        id: 'incomplete', 
        label: 'Incomplete Product', 
        count: 1 
      })
    )
  })

  it('should sort filters by count (most popular first)', async () => {
    const result = await getProductFilters({
      countryCode: 'us'
    })

    // Sizes: M and L appear twice (count: 2), S appears once (count: 1)  
    expect(result.sizes[0].count).toBeGreaterThanOrEqual(result.sizes[1].count)
    expect(result.sizes[1].count).toBeGreaterThanOrEqual(result.sizes[2].count)
  })

  it('should handle collection and category filtering', async () => {
    const result = await getProductFilters({
      countryCode: 'us',
      collectionId: 'col_1'
    })

    // Should still return filters but collection filtering affects the API call
    expect(sdk.client.fetch).toHaveBeenCalledWith(
      '/store/products',
      expect.objectContaining({
        query: expect.objectContaining({
          collection_id: ['col_1']
        })
      })
    )
  })

  it('should handle region not found', async () => {
    getRegion.mockResolvedValue(null)

    const result = await getProductFilters({
      countryCode: 'invalid'
    })

    expect(result).toEqual({
      tags: [],
      types: [],
      materials: [],
      collections: [],
      categories: [],
      priceRange: { min: 0, max: 0 },
    })
  })
})

describe('Filter Data Processing', () => {
  const { sdk } = require('../../../src/lib/config')
  const { getRegion } = require('../../../src/lib/data/regions')
  const { getAuthHeaders, getCacheOptions } = require('../../../src/lib/data/cookies')

  beforeEach(() => {
    jest.clearAllMocks()
    
    getRegion.mockResolvedValue({
      id: 'reg_1',
      name: 'US',
      currency_code: 'usd'
    })
    
    getAuthHeaders.mockResolvedValue({})
    getCacheOptions.mockResolvedValue({})
  })

  it('should normalize size values to uppercase', async () => {
    const productsWithLowercaseSizes = [
      {
        id: 'prod_lowercase',
        title: 'Test Product',
        handle: 'test',
        variants: [
          {
            id: 'var_1',
            options: [{ id: 'opt_1', value: 'small' }]
          },
          {
            id: 'var_2', 
            options: [{ id: 'opt_2', value: 'medium' }]
          }
        ]
      }
    ] as any

    sdk.client.fetch.mockResolvedValue({
      products: productsWithLowercaseSizes,
      count: 1
    })

    const result = await getProductFilters({ countryCode: 'us' })

    expect(result.sizes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'SMALL', label: 'SMALL' }),
        expect.objectContaining({ id: 'MEDIUM', label: 'MEDIUM' })
      ])
    )
  })

  it('should create friendly type labels from handles', async () => {
    const productsWithHandles = [
      { id: '1', title: 'Test T-Shirt', handle: 't-shirt', variants: [] },
      { id: '2', title: 'Test Sweatpants', handle: 'sweatpants', variants: [] },
      { id: '3', title: 'Test Shorts', handle: 'shorts', variants: [] },
      { id: '4', title: 'Custom Product', handle: 'custom-item', variants: [] }
    ] as any

    sdk.client.fetch.mockResolvedValue({
      products: productsWithHandles,
      count: 4
    })

    const result = await getProductFilters({ countryCode: 'us' })

    expect(result.types).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 't-shirt', label: 'T-Shirt' }),
        expect.objectContaining({ id: 'sweatpants', label: 'Sweatpants' }),
        expect.objectContaining({ id: 'shorts', label: 'Shorts' }),
        expect.objectContaining({ id: 'custom-item', label: 'Custom Product' })
      ])
    )
  })
})