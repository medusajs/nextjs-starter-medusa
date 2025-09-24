import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  value,
  size = "default",
  ...props
}: { size?: "default" | "lg" } & Omit<React.ComponentProps<"input">, "size">) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size || "default"}
      {...(value !== undefined
        ? {
            value,
            ...(props.onChange ? {} : { readOnly: true }),
          }
        : {})}
      className={cn(
        "flex data-[size=default]:h-9 data-[size=lg]:h-10 w-full min-w-0 bg-background rounded-md border border-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
