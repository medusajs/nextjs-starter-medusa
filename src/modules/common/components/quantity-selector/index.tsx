import Minus from "@modules/common/icons/minus"
import Plus from "@modules/common/icons/plus"
import React from "react"

type QuantitySelectorProps = {
  quantity: number
  increase: () => void
  decrease: () => void
  size?: "small" | "large"
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  size,
  ...componentProps
}) => {
  if (size === "large") {
    return <Large {...componentProps} />
  } else {
    return <Small {...componentProps} />
  }
}

const Large: React.FC<Omit<QuantitySelectorProps, "size">> = ({
  quantity,
  increase,
  decrease,
}) => {
  return (
    <div className="flex items-center text-base-regular text-small-regular border border-gray-200 justify-between px-4 py-[10px] mt-4 mb-3">
      <button onClick={decrease}>
        <Minus size={16} />
      </button>
      <span>{quantity}</span>
      <button onClick={increase}>
        <Plus size={16} />
      </button>
    </div>
  )
}

const Small: React.FC<Omit<QuantitySelectorProps, "size">> = ({
  quantity,
  increase,
  decrease,
}) => {
  return (
    <div className="flex items-center text-base-regular border border-gray-200 justify-between px-2 py-1 max-w-[75px]">
      <button onClick={decrease}>
        <Minus size={10} />
      </button>
      <span>{quantity}</span>
      <button onClick={increase}>
        <Plus size={10} />
      </button>
    </div>
  )
}

export default QuantitySelector
