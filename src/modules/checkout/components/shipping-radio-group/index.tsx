import { RadioGroup } from "@headlessui/react"
import { useCheckout } from "@lib/context/checkout-context"
import Radio from "@modules/common/components/radio"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ShippingOption = {
  value: string
  label: string
  price: string
}

type ShippingRadioGroupProps = {
  options?: ShippingOption[]
  onChange: (value: string) => void
  value?: string
}

const ShippingRadioGroup: React.FC<ShippingRadioGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  const { addShippingOption } = useCheckout()

  const handleChange = (value: string) => {
    addShippingOption(value)
    onChange(value)
  }

  return (
    <RadioGroup
      value={value}
      onChange={handleChange}
      className="border border-gray-200"
    >
      {options && options.length ? (
        options.map((option, i) => {
          return (
            <RadioGroup.Option
              key={option.value}
              value={option.value}
              className={clsx(
                "flex items-center justify-between text-base-regular cursor-pointer px-4 pt-4 pb-8",
                {
                  "border-t border-gray-200": i !== 0,
                }
              )}
            >
              <div className="flex items-center gap-x-4">
                <Radio checked={value === option.value} />
                <span className="text-base-semi">{option.label}</span>
              </div>
              <span className="justify-self-end text-gray-700">
                {option.price}
              </span>
            </RadioGroup.Option>
          )
        })
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-gray-900">
          <Spinner />
        </div>
      )}
    </RadioGroup>
  )
}

export default ShippingRadioGroup
