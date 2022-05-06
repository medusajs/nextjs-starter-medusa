import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Input from "."

export default {
  title: "Modules/Checkout/Components/Input",
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => (
  <div className="max-w-[440px]">
    <Input {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  label: "Email",
  name: "email",
  errors: {},
}

export const Error = Template.bind({})
Error.args = {
  label: "Email",
  name: "email",
  errors: {
    email: {
      type: "required",
      message: "Email is required",
    },
  },
}
