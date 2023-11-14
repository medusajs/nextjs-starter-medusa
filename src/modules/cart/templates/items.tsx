import { LineItem, Region } from "@medusajs/medusa"
import { Heading, Table } from "@medusajs/ui"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: Omit<LineItem, "beforeInsert">[]
  region?: Region
}

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="txt-xxl">Cart</Heading>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {items && region
          ? items
              .sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1
              })
              .map((item) => {
                return <Item key={item.id} item={item} region={region} />
              })
          : Array.from(Array(5).keys()).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </Table>
    </div>
  )
}

export default ItemsTemplate
