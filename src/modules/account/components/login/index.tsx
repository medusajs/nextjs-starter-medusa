import { useTranslations } from "next-intl"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  
  const t = useTranslations()

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t('WELCOME_BACK')}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t('SIGN_IN_TO_ACCESS_AN_ENHANCED')}test
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t('EMAIL')}
            name="email"
            type="email"
            title={t('ENTER_VALID_EMAIL')}
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={t('PASS')}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          {t('SIGN_IN')}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t('NOT_A_MEMBER')}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          {t('JOIN_US')}
        </button>
        {t('_')}
      </span>
    </div>
  )
}

export default Login
