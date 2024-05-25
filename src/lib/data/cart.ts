"use server"

import { sdk } from "@lib/config"
import { getRegion } from "./regions"
import { revalidateTag } from "next/cache"
import { getProductsById } from "./products"
import { omit } from "lodash"
import medusaError from "@lib/util/medusa-error"
import { redirect } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCartId, removeCartId, setCartId } from "./cookies"

export async function retrieveCart() {
  const cartId = getCartId()

  if (!cartId) {
    return null
  }

  try {
    const { cart } = await sdk.store.cart.retrieve(
      cartId,
      {},
      { next: { tags: ["cart"] }, ...getAuthHeaders() }
    )

    return cart
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getOrSetCart(countryCode: string) {
  let cart = await retrieveCart()
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const region_id = region.id

  if (!cart) {
    const cartResp = await sdk.store.cart.create({ region_id: region.id })
    cart = cartResp.cart
    setCartId(cart.id)
    revalidateTag("cart")
  }

  if (cart && cart?.region_id !== region_id) {
    await sdk.store.cart.update(cart.id, { region_id }, {}, getAuthHeaders())
    revalidateTag("cart")
  }

  return cart
}

export async function updateCart(data: any) {
  const cartId = getCartId()
  if (!cartId) {
    return "Missing cart ID"
  }

  return sdk.store.cart
    .update(cartId, data, {}, getAuthHeaders())
    .then(({ cart }) => cart)
    .catch((err) => medusaError(err))
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    return "Missing product variant ID"
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    return "Missing cart ID"
  }

  try {
    await sdk.store.cart.createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      getAuthHeaders()
    )
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
  if (!lineId) {
    return "Missing lineItem ID"
  }

  const cartId = getCartId()
  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await sdk.store.cart.updateLineItem(
      cartId,
      lineId,
      { quantity },
      {},
      getAuthHeaders()
    )
    revalidateTag("cart")
  } catch (e: any) {
    return e.toString()
  }
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    return "Missing lineItem ID"
  }

  const cartId = getCartId()
  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await sdk.store.cart.deleteLineItem(cartId, lineId, getAuthHeaders())
    revalidateTag("cart")
  } catch (e) {
    return "Error deleting line item"
  }
}

export async function enrichLineItems(
  lineItems:
    | HttpTypes.StoreCartLineItem[]
    | HttpTypes.StoreOrderLineItem[]
    | null,
  currencyCode: string
) {
  if (!lineItems) return []

  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    currencyCode: currencyCode,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)
  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p: any) => p.id === item.product_id)
    const variant = product?.variants?.find(
      (v: any) => v.id === item.variant_id
    )

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
  }) as HttpTypes.StoreCartLineItem[]

  return enrichedItems
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  return sdk.store.cart
    .addShippingMethod(
      cartId,
      { option_id: shippingMethodId },
      {},
      getAuthHeaders()
    )
    .then(() => {
      revalidateTag("cart")
    })
    .catch((err) => medusaError(err))
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: {
    provider_id: string
  }
) {
  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, getAuthHeaders())
    .then(() => {
      revalidateTag("cart")
    })
    .catch((err) => {
      medusaError(err)
    })
}

export async function applyDiscount(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { discounts: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitDiscountForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyDiscount(code).catch(async (err) => {
      await applyGiftCard(code)
    })
    return null
  } catch (error: any) {
    return error.toString()
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  if (!formData) return "No form data received"
  const cartId = getCartId()
  if (!cartId) return { message: "No cartId cookie found" }

  const data = {
    shipping_address: {
      first_name: formData.get("shipping_address.first_name"),
      last_name: formData.get("shipping_address.last_name"),
      address_1: formData.get("shipping_address.address_1"),
      address_2: "",
      company: formData.get("shipping_address.company"),
      postal_code: formData.get("shipping_address.postal_code"),
      city: formData.get("shipping_address.city"),
      country_code: formData.get("shipping_address.country_code"),
      province: formData.get("shipping_address.province"),
      phone: formData.get("shipping_address.phone"),
    },
    email: formData.get("email"),
  } as any

  const sameAsBilling = formData.get("same_as_billing")
  if (sameAsBilling === "on") data.billing_address = data.shipping_address

  if (sameAsBilling !== "on")
    data.billing_address = {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      address_1: formData.get("billing_address.address_1"),
      address_2: "",
      company: formData.get("billing_address.company"),
      postal_code: formData.get("billing_address.postal_code"),
      city: formData.get("billing_address.city"),
      country_code: formData.get("billing_address.country_code"),
      province: formData.get("billing_address.province"),
      phone: formData.get("billing_address.phone"),
    }
  try {
    await updateCart(data)
    revalidateTag("cart")
  } catch (error: any) {
    return error.toString()
  }
  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

export async function placeOrder() {
  const cartId = getCartId()
  if (!cartId) throw new Error("No cartId cookie found")
  let cart
  try {
    cart = await sdk.store.cart.complete(cartId, {}, getAuthHeaders())
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }

  if (cart?.type === "order") {
    const countryCode = cart.order.shipping_address?.country_code?.toLowerCase()
    removeCartId()
    redirect(`/${countryCode}/order/confirmed/${cart?.order.id}`)
  }
  return cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  try {
    if (cartId) {
      await updateCart({ region_id: region.id })
      revalidateTag("cart")
    }

    revalidateTag("regions")
    revalidateTag("products")
  } catch (e) {
    return "Error updating region"
  }

  redirect(`/${countryCode}${currentPath}`)
}
