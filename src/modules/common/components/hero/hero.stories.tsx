import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Hero from "."

export default {
  title: "Modules/Common/Components/Hero",
  component: Hero,
} as ComponentMeta<typeof Hero>

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />

export const Default = Template.bind({})
Default.args = {
  image: {
    src: "https://images.unsplash.com/photo-1507297448044-a99b358cd06e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1568&q=80",
    alt: "",
  },
  copy: {
    headline: "Spring is here",
    subline: "New collection",
    text: "It's time to pack your winter clothes away and get ready for the new season.",
  },
  callToAction: {
    text: "Shop Now",
    link: "",
  },
}
