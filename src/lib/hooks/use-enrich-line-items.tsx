import { LineItem } from "@medusajs/medusa"
import omit from "lodash/omit"
import { useCart, useProducts } from "medusa-react"
import { useMemo } from "react"

/**
 * A hook that returns an array of enriched line items.
 * If you pass an array of line items, it will return those line items with enriched data.
 * Otherwise it will return the line items from the current cart.
 */
const useEnrichedLineItems = (lineItems?: LineItem[], cartId?: string) => {
  const { cart } = useCart()

  const queryParams = useMemo(() => {
    if (lineItems) {
      return {
        id: lineItems.map((lineItem) => lineItem.variant.product_id),
        cart_id: cartId,
      }
    }

    return {
      id: cart?.items.map((lineItem) => lineItem.variant.product_id),
      cart_id: cart?.id,
    }
  }, [lineItems, cart?.items, cart?.id, cartId])

  const { products } = useProducts(queryParams, {
    enabled: !!lineItems || !!cart?.items?.length,
    keepPreviousData: true,
  })

  // We enrich the line items with the product and variant information
  const items = useMemo(() => {
    const currItems = lineItems || cart?.items

    if (!currItems?.length || !products) {
      return []
    }

    const enrichedItems: Omit<LineItem, "beforeInsert">[] = []

    for (const item of currItems) {
      const product = products.find((p) => p.id === item.variant.product_id)

      if (!product) {
        enrichedItems.push(item)
        return
      }

      const variant = product.variants.find((v) => v.id === item.variant_id)

      if (!variant) {
        enrichedItems.push(item)
        return
      }

      enrichedItems.push({
        ...item,
        // @ts-ignore
        variant: {
          ...variant,
          // @ts-ignore
          product: omit(product, "variants"),
        },
      })
    }

    return enrichedItems
  }, [cart?.items, lineItems, products])

  return items
}

export default useEnrichedLineItems
