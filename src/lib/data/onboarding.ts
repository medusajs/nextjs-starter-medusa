"use server"
import { cookies as nextCookies } from "next/headers"
import { redirect } from "@lib/i18n/navigation"

export async function resetOnboardingState(orderId: string) {
  const cookies = await nextCookies()
  cookies.set("_medusa_onboarding", "false", { maxAge: -1 })
  redirect(`http://localhost:7001/a/orders/${orderId}`)
}
