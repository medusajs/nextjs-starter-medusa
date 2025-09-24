"use client"

import { useTranslations } from "next-intl"

import { AUTH_VIEW } from "@/components/features/auth/templates/auth-template"
import { RegisterForm } from "@/components/features/auth/forms/register-form"
import { Button } from "@/components/ui/primitives/button"

type Props = {
  setCurrentView: (view: AUTH_VIEW) => void
}

function RegisterView({ setCurrentView }: Props) {
  const t = useTranslations("features.auth.views.register_view")
  return (
    <div
      className="max-w-sm mx-auto flex flex-col items-center"
      data-testid="register-page"
    >
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-medium uppercase mb-6">{t("title")}</h1>
        <p className="text-center text-base text-foreground mb-4">
          {t("description")}
        </p>
      </div>
      <RegisterForm />
      <span className="text-center text-foreground text-sm mt-6">
        {t("have_account")}{" "}
        <Button
          onClick={() => setCurrentView(AUTH_VIEW.SIGN_IN)}
          variant="link"
          size="clear"
        >
          {t("login")}
        </Button>
        .
      </span>
    </div>
  )
}

export { RegisterView }
