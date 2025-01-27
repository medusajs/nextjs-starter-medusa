"use client"

import { useTranslations } from "next-intl"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const t = useTranslations()

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {t('YOUR_TEST_ORDER_WAS_SUCCESSFUL')}
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t('YOU_CAN_NOW_COMPLETE_SETTING_U')}
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t('COMPLETE_SETUP_IN_ADMIN')}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
