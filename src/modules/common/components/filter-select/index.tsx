import { Label, Checkbox, Text, clx } from "@medusajs/ui"

type FilterSelectProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  selected: Set<string>
  handleChange: (...args: any[]) => void
}

const FilterSelect = ({
  title,
  items,
  selected,
  handleChange,
}: FilterSelectProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <Text className="txt-compact-small-plus text-ui-fg-muted">{title}</Text>
      <div className="flex flex-col gap-y-2 ml-[-1.675rem]">
        {items?.map((i) => (
          <div key={i.value} className={clx("flex gap-x-2 items-center")}>
            <Checkbox
              onCheckedChange={(e) => handleChange(e, i.value)}
              checked={selected.has(i.value)}
              className="peer"
              id={i.value}
              value={i.value}
            />
            <Label
              placeholder={i.label}
              htmlFor={i.value}
              className={clx(
                "!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer",
                {
                  "text-ui-fg-base": selected.has(i.value),
                }
              )}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterSelect
