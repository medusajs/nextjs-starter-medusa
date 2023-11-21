"use client"

import { Heading, Text } from "@medusajs/ui"
import { Spinner } from "@medusajs/icons"
import { useCart } from "medusa-react"

const SubmitSpinner = () => {
  const {
    completeCheckout: { isLoading },
  } = useCart()

  if (isLoading) {
    return (
      <div className="w-full h-full bg-white z-[9999] fixed flex flex-col items-center justify-center overflow-hidden ">
        <div className="flex flex-col items-center justify-center gap-y-6">
          <div className="flex items-center gap-x-3">
            <Spinner className="animate-spin" />
            <Heading className="text-gray-900 text-2xl font-medium">
              Please wait...
            </Heading>
          </div>
          <Text>
            Your order is processing. Do not press back or refresh until your
            order is complete.
          </Text>
        </div>
      </div>
    )
  }

  return null
}

export default SubmitSpinner
