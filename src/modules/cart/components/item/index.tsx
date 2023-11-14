import { useStore } from "@lib/context/store-context"
import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text } from "@medusajs/ui"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import NativeSelect from "@modules/common/components/native-select"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
}

const Item = ({ item, region }: ItemProps) => {
  const { updateItem, deleteItem } = useStore()
  const { handle } = item.variant.product

  return (
    <Table.Row className="w-full m-4">
      <Table.Cell className="!pl-0 p-4 w-24">
        <Link href={`/products/${handle}`} className="flex w-24">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </Link>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text className="txt-medium-plus text-ui-fg-base">{item.title}</Text>
        <LineItemOptions variant={item.variant} />
      </Table.Cell>

      <Table.Cell>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-x-"
            onClick={() => deleteItem(item.id)}
          >
            <Trash size={18} />
          </button>
          <NativeSelect
            value={item.quantity}
            onChange={(value) =>
              updateItem({
                lineId: item.id,
                quantity: parseInt(value.target.value),
              })
            }
            className="w-14 h-10 p-4"
          >
            {Array.from(
              [
                ...Array(
                  item.variant.inventory_quantity > 0
                    ? item.variant.inventory_quantity
                    : 10
                ),
              ].keys()
            )
              .slice(0, 10)
              .map((i) => {
                const value = i + 1
                return (
                  <option value={value} key={i}>
                    {value}
                  </option>
                )
              })}
          </NativeSelect>
        </div>
      </Table.Cell>

      <Table.Cell>
        <LineItemUnitPrice item={item} region={region} />
      </Table.Cell>

      <Table.Cell className="!pr-0 text-right">
        <LineItemPrice item={item} region={region} />
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
