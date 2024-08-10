import { Order } from "@medusajs/medusa"
import { Text, Heading } from "@medusajs/ui"

type PickUpInfoProps = {
  order: Order
}

const PickUpInfo = ({ order }: PickUpInfoProps) => {

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <Heading level="h2" className="flex flex-row text-3xl-regular">
          Pick up instructions
        </Heading>

        <Text>Thanks for ordering at your local food Coop! Your food bag(s) will be ready for you to pick up on:</Text>
        <div className="flex flex-col items-center sm:items-start">
          <Text weight="plus">Thursday 25 July </Text>
          <Text weight="plus">Between 9:00am - 2:30pm</Text>
          <Text weight="plus">At the Karori Community Centre</Text>
          <a href="https://maps.app.goo.gl/zgzzBAuoWW3hTyYz7?g_st=com.google.maps.preview.copy" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Click for directions</a>
        </div>
      </div>
    </div>
  )
}

export default PickUpInfo
