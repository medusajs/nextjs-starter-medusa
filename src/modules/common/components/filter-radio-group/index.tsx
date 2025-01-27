import k, { TranslationDef } from "@lib/i18n/translations/keys"
import { useTranslations } from "next-intl"

import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  const t = useTranslations()

  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <Text className="txt-compact-small-plus text-ui-fg-muted">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center", {
              "ml-[-23px]": i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer",
                {
                  "text-ui-fg-base": i.value === value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {t(i.label)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
