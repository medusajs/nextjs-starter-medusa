import { timeAgo } from "@lib/util/time-ago"
import { Bid } from "types/global"

const AuctionTimeAgo = ({ bid }: { bid: Bid }) => (
  <span className="w-24 text-right" suppressHydrationWarning>
    {timeAgo(new Date(bid.created_at))}
  </span>
)

export default AuctionTimeAgo
