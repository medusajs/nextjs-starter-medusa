"use client"

import { useScopedI18n } from "../../../../locales/client"

import { Button, Container, Text } from "@medusajs/ui"
import { resetOnboardingState } from "app/actions"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const t = useScopedI18n("order")

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">{t("testorder")} 🎉</Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t("testordercomplete")}
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t("testcomplete")}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
