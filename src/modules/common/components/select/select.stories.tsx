import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import Select from "."

storiesOf("Modules/Common/Components/Select", module).add("Default", () => {
  const [value, setValue] = useState<unknown | undefined>("value", undefined)

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-4">
      <h1 className="text-xl-semi">Default Example</h1>
      <Select
        options={[
          {
            value: "reg_1",
            label: "Denmark",
          },
          {
            value: "reg_2",
            label: "Germany",
          },
          {
            value: "reg_3",
            label: "Norway",
          },
        ]}
        onChange={(value) => setValue(value)}
        value={value}
        placeholder="Select a country"
      />
      <span className="text-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-gray-200 rounded-lg">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})

storiesOf("Modules/Common/Components/Select", module).add("Custom", () => {
  const [value, setValue] = useState<unknown | undefined>("value", undefined)

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-4">
      <h1 className="text-xl-semi">Custom Styling Example</h1>
      <Select
        options={[
          {
            value: "reg_1",
            label: "Denmark",
          },
          {
            value: "reg_2",
            label: "Germany",
          },
          {
            value: "reg_3",
            label: "Norway",
          },
        ]}
        onChange={(value) => setValue(value)}
        value={value}
        placeholder="Select a country"
        className="bg-gray-200"
      />
      <span className="text-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-gray-200 rounded-lg">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})
