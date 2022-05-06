import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import QuantitySelector from "."

storiesOf("Modules/Common/Components/QuantitySelector", module).add(
  "Small",
  () => {
    const [quantity, setQuantity] = useState<number>("quantity", 1)

    const increment = () => {
      setQuantity(quantity + 1)
    }

    const decrement = () => {
      setQuantity(quantity - 1)
    }

    return (
      <div className="max-w-xl flex-1 flex flex-col gap-y-4">
        <h1 className="text-xl-semi">Small Example</h1>
        <QuantitySelector
          quantity={quantity}
          increase={increment}
          decrease={decrement}
        />
        <span className="text-base-regular">
          Current quantity:{" "}
          <span className="px-2 py-1 bg-gray-200 rounded-lg">{quantity}</span>
        </span>
      </div>
    )
  }
)

storiesOf("Modules/Common/Components/QuantitySelector", module).add(
  "Large",
  () => {
    const [quantity, setQuantity] = useState<number>("quantity", 1)

    const increment = () => {
      setQuantity(quantity + 1)
    }

    const decrement = () => {
      setQuantity(quantity - 1)
    }

    return (
      <div className="max-w-xl flex-1 flex flex-col gap-y-4">
        <h1 className="text-xl-semi">Small Example</h1>
        <QuantitySelector
          quantity={quantity}
          increase={increment}
          decrease={decrement}
          size="large"
        />
        <span className="text-base-regular">
          Current quantity:{" "}
          <span className="px-2 py-1 bg-gray-200 rounded-lg">{quantity}</span>
        </span>
      </div>
    )
  }
)
