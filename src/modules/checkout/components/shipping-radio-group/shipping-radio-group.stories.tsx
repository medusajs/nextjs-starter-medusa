import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import ShippingRadioGroup from "."

storiesOf("Modules/Checkout/Components/ShippingRadioGroup", module).add(
  "Default",
  () => {
    const [value, setValue] = useState<string | undefined>("value", undefined)

    return (
      <div className="max-w-xl flex-1 flex flex-col gap-y-4">
        <ShippingRadioGroup
          options={[
            {
              value: "OPT_1",
              label: "PostFake",
              price: "35.00 kr",
            },
            {
              value: "OPT_2",
              label: "PostFake Express",
              price: "55.00 kr",
            },
          ]}
          onChange={(value) => setValue(value)}
          value={value}
        />
        <span className="text-base-regular">
          Current value:{" "}
          <span className="px-2 py-1 bg-gray-200 rounded-lg">
            {value ? JSON.stringify(value, null, 2) : "undefined"}
          </span>
        </span>
      </div>
    )
  }
)

storiesOf("Modules/Checkout/Components/ShippingRadioGroup", module).add(
  "NoOptions",
  () => {
    const [value, setValue] = useState<string | undefined>("value", undefined)

    return (
      <div className="max-w-xl flex-1 flex flex-col gap-y-4">
        <ShippingRadioGroup
          onChange={(value) => setValue(value)}
          value={value}
        />
        <span className="text-base-regular">
          Current value:{" "}
          <span className="px-2 py-1 bg-gray-200 rounded-lg">
            {value ? JSON.stringify(value, null, 2) : "undefined"}
          </span>
        </span>
      </div>
    )
  }
)
