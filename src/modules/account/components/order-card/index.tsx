import { Order } from "@medusajs/medusa"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount } from "medusa-react"
import Link from "next/link"
import React from "react"

type OrderCardProps = {
  order: Omit<Order, "beforeInsert">
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white p-10">
      <div className="uppercase text-large-semi mb-1">
        Your order #{order.display_id}
      </div>
      <div className="flex items-center divide-x divide-gray-200 text-small-regular text-gray-700">
        <span className="pr-2">
          {new Date(order.created_at).toDateString()}
        </span>
        <span className="px-2">
          {formatAmount({
            amount: order.total,
            region: order.region,
            includeTaxes: false,
          })}
        </span>
        <span className="pl-2">{`${order.items.length} ${
          order.items.length > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <Thumbnail
            thumbnail={order.items[0].thumbnail}
            images={[]}
            size="small"
          />
        </div>
        <div>
          <Link href={`/account/orders/details?order=${order.id}`} passHref>
            <button className="bg-gray-900 py-4 px-6 text-white text-base-semi uppercase">
              See details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
