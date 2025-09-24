"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { AddAddressForm } from "@/components/features/account/forms/add-address-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog"
import { ScrollArea } from "@/components/ui/primitives/scroll-area"

import type { ComponentProps } from "react"

function AddAddressDialog({
  region,
  addresses,
  ...props
}: ComponentProps<typeof DialogTrigger> &
  ComponentProps<typeof AddAddressForm>) {
  const t = useTranslations("features.account.dialogs.add_address_dialog")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <AddAddressForm
            region={region}
            onFinish={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            addresses={addresses}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { AddAddressDialog }
