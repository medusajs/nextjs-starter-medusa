"use client"

import React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { updatePasswordSchema } from "@/utils/validations/auth"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/primitives/form"
import { Button } from "@/components/ui/primitives/button"
import { FloatingInput } from "@/components/ui/primitives/floating-input"

import type { UpdatePasswordFormType } from "@/utils/validations/auth"

function UpdatePasswordForm() {
  const t = useTranslations("features.account.forms.update_password_form")

  const form = useForm<UpdatePasswordFormType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  async function onSubmit(values: UpdatePasswordFormType) {
    try {
      //    await updateCustomer(values)
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
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.old_password")}
                  data-testid="old-password-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.new_password")}
                  data-testid="new-password-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.confirm_password")}
                  data-testid="confirm-password-input"
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

export { UpdatePasswordForm }
