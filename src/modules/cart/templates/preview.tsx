"use client"

import repeat from "@lib/util/repeat"
import { LineItem } from "@medusajs/medusa"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: Omit<LineItem, "beforeInsert">[]
}

const ItemsPreviewTemplate = ({ items }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {items
            ? items
                .sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1
                })
                .map((item) => {
                  return <Item key={item.id} item={item} type="preview" />
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
