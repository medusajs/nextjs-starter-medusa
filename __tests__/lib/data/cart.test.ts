/**
 * @jest-environment node
 */

import { HttpTypes } from '@medusajs/types'

// Mock all dependencies before importing
jest.mock('../../../src/lib/config', () => ({
  sdk: {
    client: {
      fetch: jest.fn()
    },
    store: {
      cart: {
        create: jest.fn(),
        update: jest.fn(),
        createLineItem: jest.fn(),
        updateLineItem: jest.fn(),
        deleteLineItem: jest.fn(),
        complete: jest.fn(),
        addShippingMethod: jest.fn()
      },
      payment: {
        initiatePaymentSession: jest.fn()
      }
    }
  }
}))

jest.mock('../../../src/lib/data/regions', () => ({
  getRegion: jest.fn()
}))

jest.mock('../../../src/lib/data/cookies', () => ({
  getAuthHeaders: jest.fn(),
  getCacheOptions: jest.fn(),
  getCacheTag: jest.fn(),
  getCartId: jest.fn(),
  setCartId: jest.fn(),
  removeCartId: jest.fn()
}))

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn()
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

// Import functions to test
import {
  retrieveCart,
  getOrSetCart,
  updateCart,
  addToCart,
  updateLineItem,
  deleteLineItem,
  setShippingMethod,
  initiatePaymentSession,
  applyPromotions,
  placeOrder,
  updateRegion,
  listCartOptions
} from '../../../src/lib/data/cart'

// Import mocked dependencies
const { sdk } = require('../../../src/lib/config')
const { getRegion } = require('../../../src/lib/data/regions')
const { 
  getAuthHeaders, 
  getCacheOptions, 
  getCacheTag,
  getCartId,
  setCartId,
  removeCartId 
} = require('../../../src/lib/data/cookies')
const { revalidateTag } = require('next/cache')
const { redirect } = require('next/navigation')

// Mock cart data
const mockCart: HttpTypes.StoreCart = {
  id: 'cart_123',
  region_id: 'reg_123',
  currency_code: 'usd',
  subtotal: 2000,
  total: 2000,
  items: [
    {
      id: 'item_123',
      title: 'Test Product',
      quantity: 1,
      unit_price: 2000,
      total: 2000,
      variant_id: 'variant_123',
      product_handle: 'test-product',
      thumbnail: 'test-image.jpg'
    }
  ]
} as any

const mockRegion = {
  id: 'reg_123',
  name: 'US',
  currency_code: 'usd'
}

describe('Cart Data Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default mocks
    getAuthHeaders.mockResolvedValue({})
    getCacheOptions.mockResolvedValue({})
    getCacheTag.mockResolvedValue('cart-tag')
    getRegion.mockResolvedValue(mockRegion)
    revalidateTag.mockResolvedValue(undefined)
  })

  describe('retrieveCart', () => {
    test('should retrieve cart by ID successfully', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.client.fetch.mockResolvedValue({ cart: mockCart })

      const result = await retrieveCart()

      expect(result).toEqual(mockCart)
      expect(sdk.client.fetch).toHaveBeenCalledWith(
        '/store/carts/cart_123',
        expect.objectContaining({
          method: 'GET',
          query: expect.objectContaining({
            fields: expect.stringContaining('*items')
          }),
          cache: 'force-cache'
        })
      )
    })

    test('should return null when no cart ID exists', async () => {
      getCartId.mockResolvedValue(null)

      const result = await retrieveCart()

      expect(result).toBeNull()
      expect(sdk.client.fetch).not.toHaveBeenCalled()
    })

    test('should return null when cart fetch fails', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.client.fetch.mockRejectedValue(new Error('Cart not found'))

      const result = await retrieveCart()

      expect(result).toBeNull()
    })

    test('should use provided cart ID when given', async () => {
      sdk.client.fetch.mockResolvedValue({ cart: mockCart })

      const result = await retrieveCart('custom_cart_123')

      expect(result).toEqual(mockCart)
      expect(sdk.client.fetch).toHaveBeenCalledWith(
        '/store/carts/custom_cart_123',
        expect.any(Object)
      )
    })
  })

  describe('getOrSetCart', () => {
    test('should return existing cart when available', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.client.fetch.mockResolvedValue({ cart: mockCart })

      const result = await getOrSetCart('us')

      expect(result).toEqual(mockCart)
      expect(sdk.store.cart.create).not.toHaveBeenCalled()
    })

    test('should create new cart when none exists', async () => {
      getCartId.mockResolvedValue(null)
      sdk.client.fetch.mockResolvedValue({ cart: null })
      sdk.store.cart.create.mockResolvedValue({ cart: mockCart })

      const result = await getOrSetCart('us')

      expect(result).toEqual(mockCart)
      expect(sdk.store.cart.create).toHaveBeenCalledWith(
        { region_id: 'reg_123' },
        {},
        {}
      )
      expect(setCartId).toHaveBeenCalledWith('cart_123')
      expect(revalidateTag).toHaveBeenCalled()
    })

    test('should update cart region when different', async () => {
      const cartWithDifferentRegion = { ...mockCart, region_id: 'reg_456' }
      getCartId.mockResolvedValue('cart_123')
      sdk.client.fetch.mockResolvedValue({ cart: cartWithDifferentRegion })
      sdk.store.cart.update.mockResolvedValue({ cart: mockCart })

      const result = await getOrSetCart('us')

      expect(sdk.store.cart.update).toHaveBeenCalledWith(
        'cart_123',
        { region_id: 'reg_123' },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalled()
    })

    test('should throw error when region not found', async () => {
      getRegion.mockResolvedValue(null)

      await expect(getOrSetCart('invalid')).rejects.toThrow(
        'Region not found for country code: invalid'
      )
    })
  })

  describe('updateCart', () => {
    test('should update cart successfully', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.update.mockResolvedValue({ cart: mockCart })

      const updateData = { email: 'test@example.com' }
      const result = await updateCart(updateData)

      expect(result).toEqual(mockCart)
      expect(sdk.store.cart.update).toHaveBeenCalledWith(
        'cart_123',
        updateData,
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalledTimes(2) // cart and fulfillment tags
    })

    test('should throw error when no cart ID exists', async () => {
      getCartId.mockResolvedValue(null)

      await expect(updateCart({})).rejects.toThrow(
        'No existing cart found, please create one before updating'
      )
    })
  })

  describe('addToCart', () => {
    test('should add item to cart successfully', async () => {
      getCartId.mockResolvedValue(null) // No existing cart
      sdk.client.fetch.mockResolvedValue({ cart: null })
      sdk.store.cart.create.mockResolvedValue({ cart: mockCart })
      sdk.store.cart.createLineItem.mockResolvedValue({ cart: mockCart })

      await addToCart({
        variantId: 'variant_123',
        quantity: 2,
        countryCode: 'us'
      })

      expect(sdk.store.cart.createLineItem).toHaveBeenCalledWith(
        'cart_123',
        {
          variant_id: 'variant_123',
          quantity: 2
        },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalled()
    })

    test('should throw error when variant ID is missing', async () => {
      await expect(addToCart({
        variantId: '',
        quantity: 1,
        countryCode: 'us'
      })).rejects.toThrow('Missing variant ID when adding to cart')
    })

    test('should throw error when cart creation fails', async () => {
      getCartId.mockResolvedValue(null)
      sdk.client.fetch.mockResolvedValue({ cart: null })
      sdk.store.cart.create.mockRejectedValue(new Error('Cart creation failed'))

      await expect(addToCart({
        variantId: 'variant_123',
        quantity: 1,
        countryCode: 'us'
      })).rejects.toThrow()
    })
  })

  describe('updateLineItem', () => {
    test('should update line item successfully', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.updateLineItem.mockResolvedValue({ cart: mockCart })

      await updateLineItem({
        lineId: 'item_123',
        quantity: 3
      })

      expect(sdk.store.cart.updateLineItem).toHaveBeenCalledWith(
        'cart_123',
        'item_123',
        { quantity: 3 },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalledTimes(2)
    })

    test('should throw error when line ID is missing', async () => {
      await expect(updateLineItem({
        lineId: '',
        quantity: 1
      })).rejects.toThrow('Missing lineItem ID when updating line item')
    })

    test('should throw error when cart ID is missing', async () => {
      getCartId.mockResolvedValue(null)

      await expect(updateLineItem({
        lineId: 'item_123',
        quantity: 1
      })).rejects.toThrow('Missing cart ID when updating line item')
    })
  })

  describe('deleteLineItem', () => {
    test('should delete line item successfully', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.deleteLineItem.mockResolvedValue({ cart: mockCart })

      await deleteLineItem('item_123')

      expect(sdk.store.cart.deleteLineItem).toHaveBeenCalledWith(
        'cart_123',
        'item_123',
        {}
      )
      expect(revalidateTag).toHaveBeenCalledTimes(2)
    })

    test('should throw error when line ID is missing', async () => {
      await expect(deleteLineItem('')).rejects.toThrow(
        'Missing lineItem ID when deleting line item'
      )
    })
  })

  describe('setShippingMethod', () => {
    test('should set shipping method successfully', async () => {
      sdk.store.cart.addShippingMethod.mockResolvedValue({ cart: mockCart })

      await setShippingMethod({
        cartId: 'cart_123',
        shippingMethodId: 'ship_123'
      })

      expect(sdk.store.cart.addShippingMethod).toHaveBeenCalledWith(
        'cart_123',
        { option_id: 'ship_123' },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalled()
    })
  })

  describe('initiatePaymentSession', () => {
    test('should initiate payment session successfully', async () => {
      const paymentData = { provider_id: 'stripe' }
      sdk.store.payment.initiatePaymentSession.mockResolvedValue({ 
        payment_session: { id: 'ps_123' } 
      })

      const result = await initiatePaymentSession(mockCart, paymentData)

      expect(sdk.store.payment.initiatePaymentSession).toHaveBeenCalledWith(
        mockCart,
        paymentData,
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalled()
    })
  })

  describe('applyPromotions', () => {
    test('should apply promotion codes successfully', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.update.mockResolvedValue({ cart: mockCart })

      await applyPromotions(['SAVE10', 'FREESHIP'])

      expect(sdk.store.cart.update).toHaveBeenCalledWith(
        'cart_123',
        { promo_codes: ['SAVE10', 'FREESHIP'] },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalledTimes(2)
    })

    test('should throw error when no cart exists', async () => {
      getCartId.mockResolvedValue(null)

      await expect(applyPromotions(['SAVE10'])).rejects.toThrow(
        'No existing cart found'
      )
    })
  })

  describe('placeOrder', () => {
    test('should place order successfully and redirect', async () => {
      getCartId.mockResolvedValue('cart_123')
      const orderResult = {
        type: 'order',
        order: {
          id: 'order_123',
          shipping_address: { country_code: 'us' }
        }
      }
      sdk.store.cart.complete.mockResolvedValue(orderResult)

      await placeOrder()

      expect(sdk.store.cart.complete).toHaveBeenCalledWith('cart_123', {}, {})
      expect(removeCartId).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/us/order/order_123/confirmed')
      expect(revalidateTag).toHaveBeenCalledTimes(2) // cart and orders
    })

    test('should return cart when order completion fails', async () => {
      getCartId.mockResolvedValue('cart_123')
      const cartResult = { type: 'cart', cart: mockCart }
      sdk.store.cart.complete.mockResolvedValue(cartResult)

      const result = await placeOrder()

      expect(result).toEqual(mockCart)
      expect(redirect).not.toHaveBeenCalled()
      expect(removeCartId).not.toHaveBeenCalled()
    })

    test('should throw error when no cart ID exists', async () => {
      getCartId.mockResolvedValue(null)

      await expect(placeOrder()).rejects.toThrow(
        'No existing cart found when placing an order'
      )
    })
  })

  describe('updateRegion', () => {
    test('should update region and redirect', async () => {
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.update.mockResolvedValue({ cart: mockCart })

      await updateRegion('ca', '/products')

      expect(sdk.store.cart.update).toHaveBeenCalledWith(
        'cart_123',
        { region_id: 'reg_123' },
        {},
        {}
      )
      expect(revalidateTag).toHaveBeenCalled() // cart, regions, products
      expect(redirect).toHaveBeenCalledWith('/ca/products')
    })

    test('should work without existing cart', async () => {
      getCartId.mockResolvedValue(null)

      await updateRegion('ca', '/products')

      expect(sdk.store.cart.update).not.toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/ca/products')
    })

    test('should throw error when region not found', async () => {
      getRegion.mockResolvedValue(null)

      await expect(updateRegion('invalid', '/products')).rejects.toThrow(
        'Region not found for country code: invalid'
      )
    })
  })

  describe('listCartOptions', () => {
    test('should list cart shipping options', async () => {
      getCartId.mockResolvedValue('cart_123')
      const shippingOptions = {
        shipping_options: [
          { id: 'opt_1', name: 'Standard Shipping' },
          { id: 'opt_2', name: 'Express Shipping' }
        ]
      }
      sdk.client.fetch.mockResolvedValue(shippingOptions)

      const result = await listCartOptions()

      expect(result).toEqual(shippingOptions)
      expect(sdk.client.fetch).toHaveBeenCalledWith(
        '/store/shipping-options',
        expect.objectContaining({
          query: { cart_id: 'cart_123' },
          cache: 'force-cache'
        })
      )
    })
  })

  describe('Error Handling', () => {
    test('should handle medusaError properly in addToCart', async () => {
      const mockError = new Error('API Error')
      mockError.response = {
        status: 400,
        data: { message: 'invalid variant' }
      }

      getCartId.mockResolvedValue('cart_123')
      sdk.client.fetch.mockResolvedValue({ cart: mockCart })
      sdk.store.cart.createLineItem.mockRejectedValue(mockError)

      await expect(addToCart({
        variantId: 'variant_123',
        quantity: 1,
        countryCode: 'us'
      })).rejects.toThrow()
    })

    test('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error')
      networkError.request = {}

      sdk.client.fetch.mockRejectedValue(networkError)

      const result = await retrieveCart('cart_123')
      expect(result).toBeNull()
    })
  })

  describe('Performance', () => {
    test('should use proper caching headers', async () => {
      getCartId.mockResolvedValue('cart_123')
      getCacheOptions.mockResolvedValue({ next: { revalidate: 3600 } })
      sdk.client.fetch.mockResolvedValue({ cart: mockCart })

      await retrieveCart()

      expect(sdk.client.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'force-cache'
        })
      )
    })

    test('should revalidate appropriate cache tags', async () => {
      getCacheTag.mockImplementation((tag) => `${tag}-tag`)
      getCartId.mockResolvedValue('cart_123')
      sdk.store.cart.createLineItem.mockResolvedValue({ cart: mockCart })

      await addToCart({
        variantId: 'variant_123',
        quantity: 1,
        countryCode: 'us'
      })

      expect(revalidateTag).toHaveBeenCalledWith('carts-tag')
      expect(revalidateTag).toHaveBeenCalledWith('fulfillment-tag')
    })
  })
})