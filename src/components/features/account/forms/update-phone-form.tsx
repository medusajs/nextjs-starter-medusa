"use client"

import React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { updateCustomer } from "@/utils/data/customer"
import { updatePhoneSchema } from "@/utils/validations/auth"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/primitives/form"
import { Button } from "@/components/ui/primitives/button"
import { FloatingInput } from "@/components/ui/primitives/floating-input"

import type { HttpTypes } from "@medusajs/types"
import type { UpdatePhoneFormType } from "@/utils/validations/auth"

type Props = {
  customer: HttpTypes.StoreCustomer
}

function UpdatePhoneForm({ customer }: Props) {
  const t = useTranslations("features.account.forms.update_phone_form")

  const form = useForm<UpdatePhoneFormType>({
    resolver: zodResolver(updatePhoneSchema),
    defaultValues: {
      phone: customer.phone || "",
    },
  })

  async function onSubmit(values: UpdatePhoneFormType) {
    try {
      await updateCustomer(values)
      toast.success(t("message.success"))
    } catch {
      toast.error(t("message.error"))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label")}
                  data-testid="phone-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
          className="w-fit ml-auto"
        >
          {t("submit")}
        </Button>
      </form>
    </Form>
  )
}

export { UpdatePhoneForm }
export type { Props as UpdatePhoneFormProps }
