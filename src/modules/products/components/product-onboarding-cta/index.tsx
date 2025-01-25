import k from "@lib/i18n/translations/keys"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

import { Button, Container, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  const t = useSafeTranslations()

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full p-8">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-ui-fg-base text-xl">
          {t(k.YOUR_DEMO_PRODUCT_WAS_SUCCESSF)}
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t(k.YOU_CAN_NOW_CONTINUE_SETTING_U)}
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">{t(k.CONTINUE_SETUP_IN_ADMIN)}</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
