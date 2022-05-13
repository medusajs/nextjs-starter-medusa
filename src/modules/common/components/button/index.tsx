import clsx from "clsx"
import React from "react"

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "w-full uppercase flex items-center justify-center text-white min-h-[60px] bg-gray-900 px-5 py-[10px] text-small-regular border border-gray-900 hover:bg-white hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-gray-900 disabled:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
