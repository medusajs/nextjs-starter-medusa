"use client"

import { Customer, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { FormEvent, useRef, useState } from "react"

import Divider from "@modules/common/components/divider"
import { placeBid } from "@modules/products/actions"
import { formatAmount } from "@lib/util/prices"
import { Auction } from "types/global"
import AuctionCountdown from "../auction-countdown"
import User from "@modules/common/icons/user"
import AuctionTimeAgo from "../auction-time-ago"

type AuctionsActionsProps = {
  product: PricedProduct
  region: Region
  auction: Auction
  customer?: Omit<Customer, "password_hash"> | null
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function AuctionsActions({
  region,
  auction,
  customer,
}: AuctionsActionsProps) {
  const [amount, setAmount] = useState<number | undefined>()
  const [isloading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxBid = auction.bids?.reduce((a, b) => {
    return Math.max(a, b.amount)
  }, 0)

  const currentBid = formatAmount({
    amount: maxBid || auction.starting_price,
    region,
  })

  const minNextBid = formatAmount({
    amount: maxBid + 500 || auction.starting_price + 500,
    region,
  })

  const formRef = useRef<HTMLFormElement>(null)

  const handlePlaceBid = async (e: FormEvent) => {
    e.preventDefault()

    setError(null)
    setIsLoading(true)

    if (!customer) {
      setIsLoading(false)
      setError("Please sign in to place a bid")
      return
    }

    if (!amount) {
      setIsLoading(false)
      setError("Please enter a valid amount")
      return
    }

    if (amount * 100 < (maxBid || auction.starting_price)) {
      setIsLoading(false)
      setError("Please enter an amount higher than the current bid")
      return
    }

    await placeBid({
      auctionId: auction.id,
      amount: amount * 100 || 0,
      customerId: customer.id,
    }).catch((e) => {
      setError(e)
    })

    setAmount(undefined)
    formRef.current?.reset()
    setIsLoading(false)
  }

  if (!customer)
    return (
      <div>
        <p>Sign in to place a bid</p>
      </div>
    )

  return (
    <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-10">
      <div className="flex flex-col gap-2">
        <AuctionCountdown targetDate={new Date(auction.ends_at)} />

        <Divider />
      </div>
      <div className="txt-compact-small flex flex-col gap-y-3">
        <span className="text-ui-fg-subtle">Current bid:</span>
        <span className=" text-3xl ">{currentBid}</span>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={handlePlaceBid}
        ref={formRef}
      >
        <div>
          <Input
            min={currentBid || auction.starting_price}
            type="number"
            placeholder={`Enter your bid (min: ${minNextBid})`}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />

          {error && <Text className="text-ui-fg-error">{error}</Text>}
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full h-10"
          isLoading={isloading}
        >
          Place bid
        </Button>
      </form>

      <div className="flex flex-col gap-y-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <Divider />
            <Heading>
              {auction.bids.length ? "All bids" : "No bids yet"}
            </Heading>
            <div>
              {auction.bids?.map((bid, idx) => {
                const bidder = bid.customer_id.slice(-4)
                return (
                  <Text
                    key={idx}
                    className="flex justify-between text-ui-fg-subtle"
                  >
                    <span className="flex justify-between text-ui-fg-subtle items-center gap-1">
                      <User /> {bidder}
                    </span>
                    <span className="w-16 jusitfy-end text-right">
                      {formatAmount({ amount: bid.amount, region })}
                    </span>
                    <AuctionTimeAgo bid={bid} />
                  </Text>
                )
              })}
            </div>
          </div>
        </div>
        <div>
          <Text className="text-ui-fg-muted text-right">
            Ends at: {new Date(auction.ends_at).toDateString()}
          </Text>
        </div>
      </div>
    </div>
  )
}
