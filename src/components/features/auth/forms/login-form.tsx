"use client"

import { login } from "@/utils/data/customer"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/utils/validations/auth"

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

import type { LoginFormType } from "@/utils/validations/auth"

function LoginForm() {
  const t = useTranslations("features.auth.forms.login_form")
  const router = useRouter()
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormType) {
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    try {
      await login(null, formData)
      toast.success(t("success_message"))
      router.refresh()
    } catch (error) {
      toast.error(t("error_message"))
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-y-2">
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
                    placeholder={t("email")}
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
                    placeholder={t("password")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton
          loading={form.formState.isSubmitting}
          data-testid="login-button"
        >
          {t("submit")}
        </SubmitButton>
      </form>
    </Form>
  )
}

export { LoginForm }
