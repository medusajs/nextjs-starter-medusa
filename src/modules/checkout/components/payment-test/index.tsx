import { Badge } from "@medusajs/ui"

import k from "@lib/i18n/translations/keys"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

const PaymentTest = ({ className }: { className?: string }) => {
  const t = useSafeTranslations()

  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{t(k.ATTENTION)}</span>{" "}
      {t(k.FOR_TESTING_PURPOSES_ONL)}
    </Badge>
  )
}

export default PaymentTest
