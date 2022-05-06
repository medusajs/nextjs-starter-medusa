import clsx from "clsx"
import React from "react"

const Radio = ({ checked }: { checked: boolean }) => {
  return (
    <div
      className={clsx(
        "h-5 w-5 rounded-full border border-gray-200 flex items-center justify-center",
        {
          "border-gray-900": checked,
        }
      )}
    >
      {checked && <div className="w-3.5 h-3.5 rounded-full bg-gray-900" />}
    </div>
  )
}

export default Radio
