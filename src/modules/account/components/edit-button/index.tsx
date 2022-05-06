import React from "react"

const EditButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  return (
    <div>
      <button
        className="underline text-small-semi text-gray-700 uppercase"
        {...props}
      >
        Edit
      </button>
    </div>
  )
}

export default EditButton
