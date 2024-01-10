"use server"

import { LineItem } from "@medusajs/medusa"
import { omit } from "lodash"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import {
  addItem,
  createCart,
  getCart,
  getProductsById,
  removeItem,
  updateCart,
  updateItem,
} from "@lib/data"

/**
 * Retrieves the cart based on the cartId cookie
 *
 * @returns {Promise<Cart>} The cart
 * @example
 * const cart = await getOrSetCart()
 */
export async function getOrSetCart() {
  const cartId = cookies().get("_medusa_cart_id")?.value
  let cart

  if (cartId) {
    cart = await getCart(cartId).then((cart) => cart)
  }

  const regionCookie = cookies().get("_medusa_region")?.value
  const { regionId } = regionCookie && JSON.parse(regionCookie)

  if (!cart) {
    cart = await createCart({ region_id: regionId }).then((res) => res)
    cart && cookies().set("_medusa_cart_id", cart.id)
    revalidateTag("cart")
  }

  return cart
}

/**
 * Updates the cart region
 * @param regionId
 */
export async function updateCartRegion(regionId: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await updateCart(cartId, { region_id: regionId })
    revalidateTag("cart")
  } catch (e) {
    return "Error updating cart region"
  }
}

export async function retrieveCart() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  try {
    const cart = await getCart(cartId).then((cart) => cart)
    return cart
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
}) {
  const cart = await getOrSetCart().then((cart) => cart)

  if (!cart) {
    return "Missing cart ID"
  }

  if (!variantId) {
    return "Missing product variant ID"
  }

  try {
    await addItem({ cartId: cart.id, variantId, quantity })
    revalidateTag("cart")
  } catch (e) {
    return "Error adding item to cart"
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return "Missing cart ID"
  }

  if (!lineId) {
    return "Missing lineItem ID"
  }

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await updateItem({ cartId, lineId, quantity })
    revalidateTag("cart")
  } catch (e: any) {
    return e.toString()
  }
}

export async function deleteLineItem(lineId: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return "Missing cart ID"
  }

  if (!lineId) {
    return "Missing lineItem ID"
  }

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await removeItem({ cartId, lineId })
    revalidateTag("cart")
  } catch (e) {
    return "Error deleting line item"
  }
}

export async function enrichLineItems(
  lineItems: LineItem[],
  regionId: string
): Promise<
  | Omit<LineItem, "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad">[]
  | undefined
> {
  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.variant.product_id),
    regionId: regionId,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)

  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information

  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p) => p.id === item.variant.product_id)
    const variant = product?.variants.find((v) => v.id === item.variant_id)

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, "variants"),
      },
    }
  }) as LineItem[]

  return enrichedItems
}
