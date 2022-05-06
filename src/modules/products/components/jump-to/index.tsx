import { Transition } from "@headlessui/react"
import { useProductActions } from "@lib/context/product-context"
import clsx from "clsx"
import React, { Fragment } from "react"
import { Product } from "types/medusa"

type JumpToProps = {
  product: Product
  show: boolean
}

const JumpTo: React.FC<JumpToProps> = ({ product, show }) => {
  const { formattedPrice } = useProductActions()

  const jumpToInfo = () => {
    const info = document.getElementById("product-info")
    if (info) {
      info.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      })
    }
  }

  return (
    <div className={clsx("lg:hidden sticky inset-x-0 bottom-0 h-32 -mt-32")}>
      <Transition
        as={Fragment}
        show={show}
        enter="ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-white bg-opacity-90 flex flex-col gap-y-3 justify-center items-center text-base-regular py-[10px] h-full w-full border-t border-gray-200 ">
          <div className="flex items-center gap-x-2">
            <span>{product.title}</span>
            <span>—</span>
            <span>{formattedPrice}</span>
          </div>
          <button
            onClick={jumpToInfo}
            className="bg-gray-900 text-small-regular w-full text-white py-[10px] max-w-sm uppercase"
          >
            Select Variant
          </button>
        </div>
      </Transition>
    </div>
  )
}

export default JumpTo
