import { onlyUnique } from "@lib/util/only-unique"
import { ProductOption } from "@medusajs/medusa"
import Select from "@modules/common/components/select"
import React from "react"

type OptionSelectProps = {
  option: ProductOption
  current: string
  updateOption: (option: Record<string, string>) => void
  title: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
}) => {
  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique)
  return (
    <Select
      value={current}
      options={filteredOptions.map((f) => ({ label: f, value: f }))}
      onChange={(v) => updateOption({ [option.id]: v as string })}
      placeholder={title}
    />
  )
}

export default OptionSelect
