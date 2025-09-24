import React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

function OptionSelect({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}: Props) {
  const t = useTranslations(
    "features.product_detail.product_actions.option_select"
  )
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">{t("label", { title })}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={cn(
                "border-2 text-sm h-10 rounded-full p-2 flex-1 cursor-pointer transition-all",
                {
                  "border-primary bg-primary/10": v === current,
                  "transition-shadow ease-in-out duration-150 hover:ring-2 hover:ring-ring":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { OptionSelect }
export type { Props as OptionSelectProps }
