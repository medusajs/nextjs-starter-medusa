import ArrowRight from "@modules/common/icons/arrow-right"
import clsx from "clsx"
import React from "react"

type SlideButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: "prev" | "next"
}

const SlideButton: React.FC<SlideButtonProps> = ({
  direction,
  className,
  ...attributes
}) => {
  return (
    <button
      disabled={attributes.disabled}
      {...attributes}
      className={clsx(
        "w-9 h-9 rounded-full border border-gray-300 text-gray-300 flex items-center justify-center disabled:border-gray-200 disabled:text-gray-200",
        {
          "transform rotate-180": direction === "prev",
        },
        className
      )}
    >
      <span className="sr-only">
        {direction === "prev" ? "Previous" : "Next"}
      </span>
      <ArrowRight size={16} />
    </button>
  )
}

export default SlideButton
