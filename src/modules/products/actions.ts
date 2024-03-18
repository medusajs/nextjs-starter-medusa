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
    await createBid(auctionId, amount, customerId)
    revalidateTag("auctions")
  } catch (error: any) {
    return error.toString()
  }
}
