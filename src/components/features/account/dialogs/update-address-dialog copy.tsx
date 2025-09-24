"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { UpdateAddressForm } from "@/components/features/account/forms/update-address-form"
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

function UpdateAddressDialog({
  region,
  address,
  ...props
}: ComponentProps<typeof DialogTrigger> &
  ComponentProps<typeof UpdateAddressForm>) {
  const t = useTranslations("features.account.dialogs.update_address_dialog")
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
          <UpdateAddressForm
            region={region}
            onFinish={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            address={address}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { UpdateAddressDialog }
