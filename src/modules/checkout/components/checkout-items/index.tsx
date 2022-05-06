import { LineItem as MedusaLineItem } from "@medusajs/medusa"
import LineItem from "@modules/common/components/line-item"
import React from "react"
import { Region } from "types/medusa"

type CheckoutItemsProps = {
  items?: Omit<MedusaLineItem, "beforeInsert">[]
  region?: Region
}

const CheckoutItems: React.FC<CheckoutItemsProps> = ({ items, region }) => {
  return (
    <div className="flex flex-col px-4 py-8 gap-y-4 border-b border-gray-200 w-full">
      {items?.length && region ? (
        items
          .sort((a, b) => {
            return a.created_at > b.created_at ? -1 : 1
          })
          .map((i) => {
            return <LineItem key={i.id} item={i} region={region} />
          })
      ) : (
        <div className="text-base-regular text-gray-700">
          Your shopping cart is empty
        </div>
      )}
    </div>
  )
}

export default CheckoutItems
