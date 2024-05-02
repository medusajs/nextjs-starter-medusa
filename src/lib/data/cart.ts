"use server"

import { newClient } from "@lib/config"
import { cookies } from "next/headers"
import { getRegion } from "./regions"
import { revalidateTag } from "next/cache"
import { GiftCard, LineItem } from "@medusajs/medusa"
import { getProductsById } from "./products"
import { omit } from "lodash"
import medusaError from "@lib/util/medusa-error"
import { redirect } from "next/navigation"

export async function retrieveCart() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  try {
    const { cart } = await newClient.store.cart.retrieve(
      cartId,
      {},
      { next: { tags: ["cart"] } }
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
    const cartResp = await newClient.store.cart.create({ region_id: region.id })
    cart = cartResp.cart
    cookies().set("_medusa_cart_id", cart.id, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    revalidateTag("cart")
  }

  if (cart && cart?.region_id !== region_id) {
    await newClient.store.cart.update(cart.id, { region_id })
    revalidateTag("cart")
  }

  return cart
}

export async function updateCart(data: any) {
  const cartId = cookies().get("_medusa_cart_id")?.value
  if (!cartId) {
    return "Missing cart ID"
  }

  return newClient.store.cart
    .update(cartId, data)
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
    await newClient.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity,
    })
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

  const cartId = cookies().get("_medusa_cart_id")?.value
  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await newClient.store.cart.updateLineItem(cartId, lineId, { quantity })
    revalidateTag("cart")
  } catch (e: any) {
    return e.toString()
  }
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    return "Missing lineItem ID"
  }

  const cartId = cookies().get("_medusa_cart_id")?.value
  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await newClient.store.cart.deleteLineItem(cartId, lineId)
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
    ids: lineItems.map((lineItem) => lineItem.product_id!),
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
    const product = products.find((p: any) => p.id === item.product_id)
    const variant = product?.variants.find((v: any) => v.id === item.variant_id)

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

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  return newClient.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId })
    .then(({ cart }) => cart)
    .catch((err) => medusaError(err))
}

// export async function deleteDiscount(cartId: string, code: string) {
//   const headers = getMedusaHeaders(["cart"])

//   return newClient.carts
//     .deleteDiscount(cartId, code, headers)
//     .then(({ cart }) => cart)
//     .catch((err) => {
//       console.log(err)
//       return null
//     })
// }

export async function createPaymentSessions(cartId: string) {
  // return newClient.store.cart
  //   .createPaymentSessions(cartId, headers)
  //   .then(({ cart }) => cart)
  //   .catch((err) => {
  //     console.log(err)
  //     return null
  //   })
}

// export async function setPaymentSession({
//   cartId,
//   providerId,
// }: {
//   cartId: string
//   providerId: string
// }) {
//   const headers = getMedusaHeaders(["cart"])

//   return newClient.carts
//     .setPaymentSession(cartId, { provider_id: providerId }, headers)
//     .then(({ cart }) => cart)
//     .catch((err) => medusaError(err))
// }

// export async function completeCart(cartId: string) {
//   return newClient.carts
//     .complete(cartId, headers)
//     .then((res) => res)
//     .catch((err) => medusaError(err))
// }

export async function applyDiscount(code: string) {
  //   const cartId = cookies().get("_medusa_cart_id")?.value
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
  //   const cartId = cookies().get("_medusa_cart_id")?.value
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
  // const cartId = cookies().get("_medusa_cart_id")?.value
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
  giftCards: GiftCard[]
) {
  //   const cartId = cookies().get("_medusa_cart_id")?.value
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
  const cartId = cookies().get("_medusa_cart_id")?.value
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

export async function setPaymentMethod(providerId: string) {
  //   const cartId = cookies().get("_medusa_cart_id")?.value
  //   if (!cartId) throw new Error("No cartId cookie found")
  //   try {
  //     const cart = await setPaymentSession({ cartId, providerId })
  //     revalidateTag("cart")
  //     return cart
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function placeOrder() {
  //   const cartId = cookies().get("_medusa_cart_id")?.value
  //   if (!cartId) throw new Error("No cartId cookie found")
  //   let cart
  //   try {
  //     cart = await completeCart(cartId)
  //     revalidateTag("cart")
  //   } catch (error: any) {
  //     throw error
  //   }
  //   if (cart?.type === "order") {
  //     const countryCode = cart.data.shipping_address?.country_code?.toLowerCase()
  //     cookies().set("_medusa_cart_id", "", { maxAge: -1 })
  //     redirect(`/${countryCode}/order/confirmed/${cart?.data.id}`)
  //   }
  //   return cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value
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
