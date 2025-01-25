"use client"

import k from "@lib/i18n/translations/keys"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const t = useSafeTranslations()

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {t(k.YOUR_TEST_ORDER_WAS_SUCCESSFUL)}
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t(k.YOU_CAN_NOW_COMPLETE_SETTING_U)}
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t(k.COMPLETE_SETUP_IN_ADMIN)}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
