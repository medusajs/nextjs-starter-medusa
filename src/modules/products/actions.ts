"use server"

import { createBid } from "@lib/data"
import { revalidateTag } from "next/cache"

export async function placeBid({
  auctionId,
  amount,
  customerId,
}: {
  auctionId: string
  amount: number
  customerId: string
}) {
  try {
    const res = await createBid(auctionId, amount, customerId)
    revalidateTag("auctions")
    return res
  } catch (error: any) {
    return error.toString()
  }
}
