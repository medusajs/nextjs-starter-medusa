import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { Product } from "types/medusa"
import RelatedProducts from "."
import TestProducts from "../../../../../test-data/product-array.json"

export default {
  title: "Modules/Products/Components/RelatedProducts",
  component: RelatedProducts,
} as ComponentMeta<typeof RelatedProducts>

const Template: ComponentStory<typeof RelatedProducts> = (args) => (
  <RelatedProducts {...args} />
)

export const Default = Template.bind({})
Default.args = {
  heading: "You might also like",
  products: TestProducts as unknown as Product[],
}
