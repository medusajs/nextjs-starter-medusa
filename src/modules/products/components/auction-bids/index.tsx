import { formatAmount } from "@lib/util/prices"
import { User } from "@medusajs/icons"
import { Customer, Region } from "@medusajs/medusa"
import { Heading, Text, clx } from "@medusajs/ui"
import { Bid } from "types/global"
import AuctionTimeAgo from "../auction-time-ago"

const AuctionBids = ({
  bids,
  region,
  customer,
}: {
  bids: Bid[]
  region: Region
  customer?: Omit<Customer, "password_hash"> | null
}) => {
  return (
    <>
      <Heading>{bids.length ? "All bids" : "No bids yet"}</Heading>
      <div>
        {bids?.slice(0, 8).map((bid, idx) => {
          const bidder =
            bid.customer_id === customer?.id ? "You" : bid.customer_id.slice(-4)

          return (
            <Text
              key={idx}
              className={clx("flex justify-between text-ui-fg-subtle", {
                "font-medium ": bid.customer_id === customer?.id,
              })}
            >
              <span className="flex items-center gap-1 w-16">
                <User /> {bidder}
              </span>
              <span className="w-fit justify-end text-right">
                {formatAmount({ amount: bid.amount, region })}
              </span>
              <AuctionTimeAgo bid={bid} />
            </Text>
          )
        })}
      </div>

      {bids.length > 8 && (
        <Text className="text-ui-fg-subtle text-right">
          ...and {bids.length - 8} more
        </Text>
      )}
    </>
  )
}

export default AuctionBids
