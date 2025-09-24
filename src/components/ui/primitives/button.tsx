import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center z-0 after:absolute after:inset-0 after:rounded-inherit after:-z-10 relative after:transition-all justify-center relative cursor-pointer gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "items-center justify-center after:bg-primary text-primary-foreground after:bg-primary hover:after:scale-105",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "hover:text-accent-foreground after:border after:border-border hover:after:bg-accent hover:after:scale-105",
        secondary:
          "text-secondary-foreground after:bg-secondary after:border after:border-border hover:after:scale-105",
        ghost:
          "hover:text-accent-foreground after:bg-transparent hover:after:bg-accent hover:after:scale-105",
        transparent: "",
        link: "text-foreground text-sm hover:underline underline-offset-4 [&_svg:not([class*='size-'])]:size-4",
      },
      size: {
        default:
          "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4 font-bold",
        xl: "h-12 px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-8 [&_svg:not([class*='size-'])]:size-4",
        clear: "",
      },
      shape: {
        circle: "rounded-full after:rounded-full after:rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "circle",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

function Button({
  className,
  variant,
  children,
  shape,
  size,
  asChild = false,
  isLoading,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-loading={isLoading ? "active" : "inactive"}
      className={cn(buttonVariants({ variant, size, className, shape }))}
      {...props}
    >
      {isLoading ? <LoaderCircleIcon className="animate-spin" /> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
