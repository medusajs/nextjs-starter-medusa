"use client"

import { repeat } from "@/lib/utils"

import { CartItem } from "@/components/features/cart/cart-item"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/primitives/table"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  cart: HttpTypes.StoreCart
}

function ItemsPreviewTemplate({ cart }: Props) {
  const items = cart.items
  const hasOverflow = items && items.length > 4

  return (
    <Table className={hasOverflow ? "overflow-y-auto" : "!overflow-hidden"}>
      <TableBody data-testid="items-table">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <CartItem
                    key={item.id}
                    item={item}
                    type="preview"
                    currencyCode={cart.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return (
                <TableRow key={i} className="w-full m-4">
                  <TableCell className="!pl-0 p-4 w-24">
                    <div className="flex w-24 h-24 p-4 bg-muted rounded-large animate-pulse" />
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col gap-y-2">
                      <div className="w-32 h-4 bg-muted animate-pulse" />
                      <div className="w-24 h-4 bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-8 bg-muted animate-pulse" />
                      <div className="w-14 h-10 bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="w-12 h-6 bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell className="!pr-0 text-right">
                    <div className="flex gap-2 justify-end">
                      <div className="w-12 h-6 bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
      </TableBody>
    </Table>
  )
}

export { ItemsPreviewTemplate }
export type { Props as ItemsPreviewTemplateProps }
