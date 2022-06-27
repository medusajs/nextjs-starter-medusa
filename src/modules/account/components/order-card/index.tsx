import { Order } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount } from "medusa-react"
import Link from "next/link"
import { useMemo } from "react"

type OrderCardProps = {
  order: Omit<Order, "beforeInsert">
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfItems = useMemo(() => {
    return order.items.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  }, [order])

  return (
    <div className="bg-white flex flex-col">
      <div className="uppercase text-large-semi mb-1">#{order.display_id}</div>
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
        <span className="pl-2">{`${numberOfItems} ${
          numberOfItems > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className="grid grid-cols-4 gap-x-2 my-4">
        {order.items.map((i) => {
          return (
            <div key={i.id} className="flex flex-col gap-y-2">
              <Thumbnail
                thumbnail={order.items[0].thumbnail}
                images={[]}
                size="full"
              />
              <div className="flex items-center text-small-regular text-gray-700">
                <span className="text-gray-900 font-semibold">{i.title}</span>
                <span className="ml-2">x</span>
                <span>{i.quantity}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end">
        <Link href={`/account/orders/details?order=${order.id}`}>
          <a>
            <Button variant="secondary">See details</Button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default OrderCard
