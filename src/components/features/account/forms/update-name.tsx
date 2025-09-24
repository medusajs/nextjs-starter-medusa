"use client"

import React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { updateCustomer } from "@/utils/data/customer"
import { updateProfileNameSchema } from "@/utils/validations/auth"

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
import type { UpdateProfileNameFormType } from "@/utils/validations/auth"

type Props = {
  customer: HttpTypes.StoreCustomer
}

function UpdateProfileNameForm({ customer }: Props) {
  const t = useTranslations("features.account.forms.update_name_form")

  const form = useForm<UpdateProfileNameFormType>({
    resolver: zodResolver(updateProfileNameSchema),
    defaultValues: {
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
    },
  })

  async function onSubmit(values: UpdateProfileNameFormType) {
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
        className="w-full grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.first_name")}
                  data-testid="first-name-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.last_name")}
                  data-testid="last-name-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div />
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

export { UpdateProfileNameForm }
export type { Props as UpdateProfileNameFormProps }
