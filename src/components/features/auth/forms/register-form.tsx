"use client"

import { signup } from "@/utils/data/customer"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/utils/validations/auth"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { SubmitButton } from "@/components/ui/forms/submit-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/primitives/form"

import type { RegisterFormType } from "@/utils/validations/auth"

function RegisterForm() {
  const t = useTranslations("features.auth.forms.register_form")

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
    },
  })

  async function onSubmit(data: RegisterFormType) {
    const formData = new FormData()

    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("first_name", data.first_name)
    formData.append("last_name", data.last_name)
    formData.append("phone", data.phone)

    try {
      await signup(null, formData)
      toast.success(t("success_message"))
    } catch (e) {
      toast.error(t("error_message"))
    }
  }

  const agreement = t.rich("agreement", {
    privacy_policy: (chunks) => (
      <LocalizedClientLink href="/content/privacy-policy">
        <Button variant="link" size="clear">
          {chunks}
        </Button>
      </LocalizedClientLink>
    ),
    terms_of_use: (chunks) => (
      <LocalizedClientLink href="/content/terms-of-use">
        <Button variant="link" size="clear">
          {chunks}
        </Button>
      </LocalizedClientLink>
    ),
  })

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-y-2">
          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("first_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="given-name"
                    data-testid="first-name-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("last_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="family-name"
                    data-testid="last-name-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    data-testid="email-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    autoComplete="tel"
                    data-testid="phone-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    data-testid="password-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-center text-foreground text-sm mt-6">{agreement}</p>
        <SubmitButton
          loading={form.formState.isSubmitting}
          data-testid="register-button"
          className="mt-6"
        >
          {t("submit")}
        </SubmitButton>
      </form>
    </Form>
  )
}

export { RegisterForm }
