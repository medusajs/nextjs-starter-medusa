"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { transferCart } from "@/utils/data/customer"

import { Button } from "@/components/ui/primitives/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/primitives/dialog"

import type { StoreCart, StoreCustomer } from "@medusajs/types"

type Props = {
  customer: StoreCustomer
  cart: StoreCart
}

function CartMismatchAlert(props: Props) {
  const { customer, cart } = props

  const t = useTranslations("layout.cart.cart_mismatch_alert")

  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(true)
  const [actionText, setActionText] = useState(t("transfer_button"))

  if (!customer || !!cart.customer_id) {
    return
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setActionText(t("transferring_button"))
      await transferCart()
      setOpen(false)
    } catch {
      setOpen(true)
      setActionText(t("transfer_button"))
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Button size="xl" disabled={isPending} onClick={handleSubmit}>
          {actionText}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export { CartMismatchAlert }
export type { Props as CartMismatchAlertProps }
