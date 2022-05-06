import Checkbox from "@modules/common/components/checkbox"
import React, { useState } from "react"

const DiscountCode = () => {
  const [show, setShow] = useState(false)
  return (
    <div className="px-4 text-base-regular">
      <Checkbox
        label="Discount code"
        checked={show}
        onChange={() => setShow(!show)}
      />
      {show && (
        <div className="w-full flex items-center gap-x-2">
          <input
            type="text"
            className="flex-1 pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b border-dashed appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 border-gray-200"
          />
          <button className="uppercase bg-gray-900 text-white px-4 py-2">
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export default DiscountCode
