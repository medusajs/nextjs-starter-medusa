import k from "@lib/i18n/translations/keys"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"
import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  const t = useSafeTranslations()

  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t(k.CART)}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {t(k.YOU_DON_T_HAVE_ANYTHING_IN_YOU)}
      </Text>
      <div>
        <InteractiveLink href="/store">{t(k.EXPLORE_PRODUCTS)}</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
