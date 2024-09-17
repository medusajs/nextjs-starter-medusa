"use client"

import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import { useScopedI18n } from "../../../../locales/client"

const EmptyCartMessage = () => {
  const t = useScopedI18n("cart")

  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t("cart")}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {t("empty_prompt1")}
      </Text>
      <div>
        <InteractiveLink href="/store">{t("empty_prompt2")}</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
