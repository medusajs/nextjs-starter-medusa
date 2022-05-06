import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import SiteInfo from "."

export default {
  title: "Modules/Common/Components/SiteInfo",
  component: SiteInfo,
} as ComponentMeta<typeof SiteInfo>

const Template: ComponentStory<typeof SiteInfo> = (args) => (
  <SiteInfo {...args} />
)

export const Default = Template.bind({})
