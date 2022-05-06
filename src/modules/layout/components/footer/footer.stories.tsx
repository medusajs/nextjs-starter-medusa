import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import { Region } from "types/medusa"
import Footer from "."

const Regions: Pick<Region, "id" | "currency_code" | "name">[] = [
  {
    id: "test-region-dkk",
    name: "Denmark",
    currency_code: "dkk",
  },
  {
    id: "test-region-na",
    name: "North America",
    currency_code: "usd",
  },
]

storiesOf("Modules/Common/Components/Footer", module).add("Default", () => {
  const [cartRegion, setCartRegion] = useState<string | undefined>(
    "cartRegion",
    undefined
  )

  return (
    <div className="gap-y-4 flex flex-col">
      <Footer
        regions={Regions}
        onChange={setCartRegion}
        currentRegion={cartRegion}
      />
      <span>
        Current region{" "}
        {Regions.find((r) => r.id === cartRegion)?.name || "undefined"}
      </span>
    </div>
  )
})
