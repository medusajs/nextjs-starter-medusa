"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { TrashIcon } from "lucide-react"

import { deleteLineItem } from "@/utils/data/cart"

import { Button } from "@/components/ui/primitives/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/primitives/alert-dialog"

import type { ComponentProps } from "react"

function DeleteButton({
  id,
  ...props
}: ComponentProps<typeof Button> & {
  id: string
}) {
  const t = useTranslations("modules.cart.delete_button")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    await deleteLineItem(id).catch((err) => {
      setIsLoading(false)
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          id={id}
          variant="ghost"
          size="icon"
          data-testid="cart-item-remove-button"
          isLoading={isLoading}
          {...props}
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {t("cancel_button")}
          </AlertDialogCancel>
          <AlertDialogAction isLoading={isLoading} onClick={handleDelete}>
            {t("confirm_button")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteButton }
