import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange: () => void
  label: string
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
}) => {
  return (
    <div className="text-base-regular flex items-center gap-x-2">
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        className="border border-gray-900 w-5 h-5 flex items-center justify-center"
      >
        {checked ? "✓" : null}
      </button>
      <span>{label}</span>
    </div>
  )
}

export default Checkbox
