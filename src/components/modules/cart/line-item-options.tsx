"use client"

import { useTranslations } from "next-intl"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

function LineItemOptions({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: Props) {
  const t = useTranslations("modules.cart.line_item_options")
  return (
    <span
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block font-medium text-muted-foreground text-sm w-full overflow-hidden text-ellipsis"
    >
      {t("label")}: <span className="text-foreground">{variant?.title}</span>
    </span>
  )
}

export { LineItemOptions }
export type { Props as LineItemOptionsProps }
