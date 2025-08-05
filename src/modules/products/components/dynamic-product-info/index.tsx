"use client"

import { useState, useEffect } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/config'
import ProductInfo from '@modules/products/templates/product-info'

interface DynamicProductInfoProps {
  productHandle?: string
  productId?: string
  countryCode: string
}

export default function DynamicProductInfo({ 
  productHandle, 
  productId, 
  countryCode 
}: DynamicProductInfoProps) {
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!productHandle && !productId) {
        setError('Either productHandle or productId is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        let queryParams: any = {}
        
        if (productHandle) {
          queryParams.handle = productHandle
        } else if (productId) {
          queryParams.id = productId
        }

        const { response } = await sdk.store.products.list({
          ...queryParams,
          fields: "*variants.calculated_price,*variants.prices,*images",
          region_id: countryCode // This might need adjustment based on your region setup
        })

        if (response.products && response.products.length > 0) {
          setProduct(response.products[0])
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productHandle, productId, countryCode])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-200 rounded">
        Error: {error}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-gray-600 p-4 border border-gray-200 rounded">
        No product found
      </div>
    )
  }

  return <ProductInfo product={product} />
}