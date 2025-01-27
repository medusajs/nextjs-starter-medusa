import { Badge } from "@medusajs/ui"

import { useTranslations } from "next-intl"

const PaymentTest = ({ className }: { className?: string }) => {
  const t = useTranslations()

  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{t('ATTENTION')}</span>{" "}
      {t('FOR_TESTING_PURPOSES_ONL')}
    </Badge>
  )
}

export default PaymentTest
