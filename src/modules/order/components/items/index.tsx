import { LineItem, Region } from "@medusajs/medusa"
import { formatAmount } from "medusa-react"
import Image from "next/image"
import React from "react"

type ItemsProps = {
  items: LineItem[]
  region: Region
}

const Items: React.FC<ItemsProps> = ({ items, region }) => {
  return (
    <div className="p-10 border-b border-gray-200 gap-y-4 flex flex-col">
      {items.map((i) => {
        return (
          <div key={i.id} className="flex items-center w-full h-24">
            <div className="relative h-full aspect-[29/35]">
              <Image
                src={i.thumbnail}
                alt={i.title}
                layout="fill"
                className="absolute inset-0"
              />
            </div>
            <div className="flex flex-col flex-1 p-4 justify-between !h-full">
              <span className="text-large-regular">{i.title}</span>
              <span className="text-small-regular text-gray-700">
                {i.variant.title}
              </span>
            </div>
            <div className="flex flex-col py-4 justify-between h-full text-right">
              <span className="text-left">
                {formatAmount({
                  amount: i.unit_price * i.quantity,
                  region: region,
                })}
              </span>
              <span className="text-small-regular text-gray-700">
                Qty: {i.quantity}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Items
