import "server-only"
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export const getAuthHeaders = (): { authorization: string } | {} => {
  const token = (cookies() as unknown as UnsafeUnwrappedCookies).get("_medusa_jwt")?.value

  if (token) {
    return { authorization: `Bearer ${token}` }
  }

  return {}
}

export const setAuthToken = (token: string) => {
  (cookies() as unknown as UnsafeUnwrappedCookies).set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = () => {
  (cookies() as unknown as UnsafeUnwrappedCookies).set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = () => {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get("_medusa_cart_id")?.value;
}

export const setCartId = (cartId: string) => {
  (cookies() as unknown as UnsafeUnwrappedCookies).set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = () => {
  (cookies() as unknown as UnsafeUnwrappedCookies).set("_medusa_cart_id", "", { maxAge: -1 })
}
