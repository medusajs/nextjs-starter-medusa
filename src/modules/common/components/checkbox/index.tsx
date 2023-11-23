import React from "react"
import { Checkbox, Label } from "@medusajs/ui"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id="checkbox"
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
      />
      <Label htmlFor="checkbox">{label}</Label>
    </div>
  )
}

export default CheckboxWithLabel
