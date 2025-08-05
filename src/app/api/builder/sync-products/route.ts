import { NextRequest, NextResponse } from 'next/server'
import { builder } from '@lib/builder'
import { sdk } from '@lib/config'

// This endpoint can be called by Medusa webhooks to sync product data to Builder.io
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Verify this is a product-related webhook
    if (!type?.startsWith('product.')) {
      return NextResponse.json({ message: 'Not a product webhook' }, { status: 200 })
    }

    // Handle different product events
    switch (type) {
      case 'product.created':
      case 'product.updated':
        await syncProductToBuilder(data)
        break
      case 'product.deleted':
        await deleteProductFromBuilder(data.id)
        break
      default:
        console.log(`Unhandled webhook type: ${type}`)
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function syncProductToBuilder(productData: any) {
  try {
    // Fetch full product data from Medusa
    const { response } = await sdk.store.products.list({
      id: productData.id,
      fields: "*variants.calculated_price,*variants.prices,*images"
    })

    const product = response.products?.[0]
    if (!product) {
      console.error('Product not found:', productData.id)
      return
    }

    // Create or update product data in Builder.io
    const builderData = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      status: product.status,
      thumbnail: product.thumbnail,
      images: product.images?.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt_text
      })) || [],
      variants: product.variants?.map(variant => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        prices: variant.prices?.map(price => ({
          amount: price.amount,
          currency_code: price.currency_code,
          region_id: price.region_id
        })) || []
      })) || [],
      tags: product.tags?.map(tag => tag.value) || [],
      type: product.type?.value,
      collection: product.collection?.handle,
      created_at: product.created_at,
      updated_at: product.updated_at
    }

    // Check if product already exists in Builder
    const existingEntry = await builder.get('product-data', {
      query: {
        'data.id': product.id
      }
    }).toPromise()

    if (existingEntry) {
      // Update existing entry
      await builder.patch('product-data', existingEntry.id!, {
        data: builderData
      }).toPromise()
      console.log(`Updated product in Builder: ${product.handle}`)
    } else {
      // Create new entry
      await builder.create('product-data', {
        name: `Product: ${product.title}`,
        data: builderData
      }).toPromise()
      console.log(`Created product in Builder: ${product.handle}`)
    }
  } catch (error) {
    console.error('Error syncing product to Builder:', error)
  }
}

async function deleteProductFromBuilder(productId: string) {
  try {
    // Find the product in Builder
    const existingEntry = await builder.get('product-data', {
      query: {
        'data.id': productId
      }
    }).toPromise()

    if (existingEntry) {
      // Delete the entry
      await builder.delete('product-data', existingEntry.id!).toPromise()
      console.log(`Deleted product from Builder: ${productId}`)
    }
  } catch (error) {
    console.error('Error deleting product from Builder:', error)
  }
}

// Optional: Manual sync endpoint for development/testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  const action = searchParams.get('action') || 'sync'

  if (!productId) {
    return NextResponse.json({ error: 'productId parameter is required' }, { status: 400 })
  }

  try {
    if (action === 'sync') {
      await syncProductToBuilder({ id: productId })
      return NextResponse.json({ message: `Product ${productId} synced successfully` })
    } else if (action === 'delete') {
      await deleteProductFromBuilder(productId)
      return NextResponse.json({ message: `Product ${productId} deleted successfully` })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in manual sync:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}