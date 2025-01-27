import { useTranslations } from "next-intl"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  const t = useTranslations()

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t('ALREADY_HAVE_AN_ACCOUNT')}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t('SIGN_IN_FOR_A_BETTER_EXPERIENC')}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {t('SIGN_IN')}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
