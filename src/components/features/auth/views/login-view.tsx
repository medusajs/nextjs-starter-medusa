"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/primitives/button"
import { LoginForm } from "@/components/features/auth/forms/login-form"
import { AUTH_VIEW } from "@/components/features/auth/templates/auth-template"

type Props = {
  setCurrentView: (view: AUTH_VIEW) => void
}

const LoginView = ({ setCurrentView }: Props) => {
  const t = useTranslations("features.auth.views.login_view")
  return (
    <div
      className="max-w-sm mx-auto w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-lg font-medium uppercase mb-6">{t("title")}</h1>
      <p className="text-center text-base text-foreground mb-8">
        {t("description")}
      </p>
      <LoginForm />
      <span className="text-center text-foreground text-sm mt-6">
        {t("no_account")}{" "}
        <Button
          onClick={() => setCurrentView(AUTH_VIEW.REGISTER)}
          data-testid="register-button"
          variant="link"
          size="clear"
        >
          {t("register")}
        </Button>
      </span>
    </div>
  )
}

export { LoginView }
