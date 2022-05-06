import { useStore } from "@lib/context/store-context"
import { LineItem as MedusaLineItem, Region } from "@medusajs/medusa"
import QuantitySelector from "@modules/common/components/quantity-selector"
import { formatAmount } from "medusa-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type LineItemProps = {
  item: Omit<MedusaLineItem, "beforeInsert">
  region: Omit<Region, "beforeInsert">
}

const LineItem: React.FC<LineItemProps> = ({ item, region }) => {
  const { deleteItem, updateItem } = useStore()

  const updateQuantity = (update: number) => {
    updateItem({ lineId: item.id, quantity: item.quantity + update })
  }

  return (
    <div className="flex">
      <div className="h-[170px] w-[135px] flex-shrink-0 overflow-hidden relative mr-4">
        <Image
          src={item.variant.product?.thumbnail}
          alt={item.variant.title}
          layout="fill"
          className="h-full w-full object-cover object-center absolute inset-0"
        />
      </div>
      <div>
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3>
              <Link href={`/products/${item.variant.product?.handle}`}>
                <a className="text-base-semi">{item.variant.product?.title}</a>
              </Link>
            </h3>
            <p className="text-small-regular mt-0.5 text-gray-700">
              {item.variant.title}
            </p>
          </div>
          <QuantitySelector
            size="small"
            quantity={item.quantity}
            increase={() => updateQuantity(1)}
            decrease={() => updateQuantity(-1)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-end justify-between text-small-regular">
        <p className="text-gray-700">
          {formatAmount({
            amount: item.unit_price * item.quantity,
            region: region,
          })}
        </p>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-900 underline underline-offset-2"
          onClick={() => deleteItem(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default LineItem
