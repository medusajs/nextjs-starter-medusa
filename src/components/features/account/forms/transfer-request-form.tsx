"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createTransferRequest } from "@/utils/data/orders"
import {
  TransferOrderFormType,
  transferOrderSchema,
} from "@/utils/validations/order"

import { Input } from "@/components/ui/primitives/input"
import { SubmitButton } from "@/components/ui/forms/submit-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/primitives/form"

function TransferRequestForm() {
  const t = useTranslations("features.account.forms.transfer_request_form")

  const form = useForm<TransferOrderFormType>({
    resolver: zodResolver(transferOrderSchema),
    defaultValues: {
      id: "",
    },
  })

  async function onSubmit(values: TransferOrderFormType) {
    try {
      await createTransferRequest(values.id)
      toast.success(t("message.success"))
    } catch {
      toast.error(t("message.error"))
    }
  }

  return (
    <div className="grid sm:grid-cols-2 items-start gap-x-8 gap-y-4 w-full">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-lg text-foreground">{t("title")}</h3>
        <p className="text-base text-muted-foreground">{t("description")}</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2 sm:items-end"
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder={t("label")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton loading={form.formState.isSubmitting}>
            {t("submit")}
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export { TransferRequestForm }
