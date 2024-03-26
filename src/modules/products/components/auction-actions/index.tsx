"use client"

import { Customer, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button, Input, Text } from "@medusajs/ui"
import { FormEvent, Suspense, useRef, useState } from "react"

import { formatAmount } from "@lib/util/prices"
import Divider from "@modules/common/components/divider"
import { placeBid } from "@modules/products/actions"
import { Auction } from "types/global"
import AuctionBids from "../auction-bids"
import AuctionCountdown from "../auction-countdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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

  const maxBid =
    auction?.bids.length > 0
      ? auction?.bids?.reduce((a, b) => {
          if (a.amount > b.amount) return a
          return b
        })
      : { amount: auction?.starting_price, customer_id: "" }

  const currentBid = formatAmount({
    amount: maxBid?.amount,
    region,
  })

  const minNextBid = formatAmount({
    amount: maxBid ? maxBid?.amount + 500 : auction?.starting_price + 500,
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

    if (amount * 100 < (maxBid?.amount + 500 || auction.starting_price + 500)) {
      setIsLoading(false)
      setError("Please enter an amount higher than " + minNextBid)
      return
    }

    await placeBid({
      auctionId: auction.id,
      amount: amount * 100 || 0,
      customerId: customer.id,
    })
      .then((res) => {
        if (res.message && res.highestBid) {
          const message =
            "Please enter an amount higher than " +
            formatAmount({ amount: res.highestBid, region })
          setError(message)
        }
      })
      .catch((e) => {
        setError(e)
      })

    setAmount(undefined)
    formRef.current?.reset()
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-10">
      {!auction && <p>No active auction. </p>}

      {auction && (
        <>
          <div className="flex flex-col gap-2">
            <Suspense>
              <AuctionCountdown targetDate={new Date(auction.ends_at)} />
            </Suspense>

            <Divider />
          </div>
          <div className="flex flex-col gap-y-3">
            <Text as="span" className="txt-compact-small text-ui-fg-subtle">
              Current bid:
            </Text>
            <Text as="span" className="text-3xl ">
              {currentBid}
            </Text>
            {maxBid.customer_id === customer?.id && (
              <Text className="text-ui-fg-subtle txt-compact-xsmall">
                You are the highest bidder!
              </Text>
            )}
          </div>
          {!customer ? (
            <Text className="text-ui-fg-subtle txt-compact-medium">
              <LocalizedClientLink
                href="/account"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Sign in
              </LocalizedClientLink>{" "}
              to place a bid
            </Text>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={handlePlaceBid}
              ref={formRef}
            >
              <div>
                <Input
                  min={minNextBid}
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
          )}
          <div className="flex flex-col gap-y-2">
            <div>
              <div className="flex flex-col gap-y-4">
                <Divider />
                <Suspense>
                  <AuctionBids
                    bids={auction.bids}
                    region={region}
                    customer={customer}
                  />
                </Suspense>
              </div>
            </div>
            <Suspense>
              <Text
                className="text-ui-fg-muted text-right"
                suppressHydrationWarning
              >
                Ends at: {new Date(auction.ends_at).toDateString()}
              </Text>
            </Suspense>
          </div>
        </>
      )}
    </div>
  )
}
