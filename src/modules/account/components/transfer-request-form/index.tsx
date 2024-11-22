"use client"

import { useFormState } from "react-dom"
import { createTransferRequest } from "@lib/data/orders"
import { Text, Heading, Input } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"

export default function TransferRequestForm() {
  const [state, formAction] = useFormState(createTransferRequest, {
    success: false,
    error: null,
  })

  return (
    <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Heading level="h3" className="text-lg text-neutral-950">
          Order transfers
        </Heading>
        <Text className="text-base-regular text-neutral-500">
          Can&apos;t find the order you are looking for?
          <br /> Connect an order to your account.
        </Text>
      </div>
      <form action={formAction} className="flex flex-col gap-y-1 sm:items-end">
        <div className="flex gap-x-2">
          <Input name="order_id" placeholder="Order ID" />
          <SubmitButton variant="secondary" className="w-fit whitespace-nowrap">
            Request transfer
          </SubmitButton>
        </div>
        {!state.success && state.error && (
          <Text className="text-base-regular text-rose-500">{state.error}</Text>
        )}
      </form>
    </div>
  )
}
