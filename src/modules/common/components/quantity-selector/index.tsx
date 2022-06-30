import Minus from "@modules/common/icons/minus"
import Plus from "@modules/common/icons/plus"
import clsx from "clsx"
import React from "react"

type QuantitySelectorProps = {
  quantity: number
  increase: () => void
  decrease: () => void
  size?: "small" | "large"
  className?: React.HTMLAttributes<HTMLDivElement>["className"]
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
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center text-base-regular text-small-regular border border-gray-700 justify-between px-4 py-[10px] mt-4 mb-3",
        className
      )}
    >
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
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center text-base-regular border border-gray-700 justify-between px-2 py-1 max-w-[75px] gap-x-2",
        className
      )}
    >
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
