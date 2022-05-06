import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { Product } from "types/medusa"
import ProductDetails from "."
import TestProducts from "../../../../../test-data/product-array.json"

export default {
  title: "Modules/Products/Components/ProductDetails",
  component: ProductDetails,
} as ComponentMeta<typeof ProductDetails>

const Template: ComponentStory<typeof ProductDetails> = (args) => (
  <div className="max-w-[440px]">
    <ProductDetails {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  product: { ...(TestProducts[0] as unknown as Product) },
}
