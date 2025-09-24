"use client"

import { useState } from "react"
import Image from "next/image"
import { LoaderCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { updateLineItem } from "@/utils/data/cart"

import { LineItemUnitPrice } from "@/components/modules/cart/line-item-unit-price"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select"
import { DeleteButton } from "@/components/modules/cart/delete-button"
import { ErrorMessage } from "@/components/ui/forms/error-message"
import { LineItemOptions } from "@/components/modules/cart/line-item-options"
import { LineItemPrice } from "@/components/modules/cart/line-item-price"
import { LocalizedClientLink } from "@/components/i18n/client-link"
import { TableCell, TableRow } from "@/components/ui/primitives/table"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

function CartItem({ item, type = "full", currencyCode }: Props) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={cn("flex", {
            "w-16": type === "preview",
            "lg:w-24 w-12": type === "full",
          })}
        >
          <Image
            src={item.thumbnail || ""}
            alt={item.title}
            width={74}
            className="border rounded-lg object-cover"
            height={74}
          />
        </LocalizedClientLink>
      </TableCell>

      <TableCell className="text-left">
        <p className="font-medium text-foreground" data-testid="product-title">
          {item.product_title}
        </p>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </TableCell>

      {type === "full" && (
        <TableCell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <Select
              onValueChange={(value) => changeQuantity(parseInt(value))}
              value={item.quantity.toString()}
            >
              <SelectTrigger disabled={updating} className="w-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <SelectItem value={(i + 1).toString()} key={i}>
                      {i + 1}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {updating && <LoaderCircleIcon className="animate-spin" />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </TableCell>
      )}

      {type === "full" && (
        <TableCell className="hidden lg:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </TableCell>
      )}

      <TableCell>
        <span
          className={cn({
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <p className="text-muted-foreground">{item.quantity}x </p>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </TableCell>
    </TableRow>
  )
}

export { CartItem }
