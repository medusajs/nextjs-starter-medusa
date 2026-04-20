import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        "group/item border-t-[0.5px] border-solid border-[#D4D2CF] last:mb-0 last:border-b-[0.5px] last:border-solid last:border-[#D4D2CF]",
        className
      )}
    >
      <AccordionPrimitive.Header className="flex flex-col px-0">
        <AccordionPrimitive.Trigger
          className={clx(
            "group flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-5 text-left outline-none",
            /* RH PDP accordion row: body-scale caps, light gray label */
            "font-sans text-[13px] font-normal uppercase leading-[1.15] tracking-[0.08em] text-[#898886]",
            "transition-colors duration-300 hover:text-qw-charcoal",
            "data-[state=open]:text-qw-charcoal",
            "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-qw-charcoal"
          )}
        >
          <span className="flex-1 pr-2">{title}</span>
          {customTrigger || <MorphingTrigger />}
        </AccordionPrimitive.Trigger>
        {subtitle ? (
          <Text as="span" size="small" className="mt-1 pb-2">
            {subtitle}
          </Text>
        ) : null}
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none px-0"
        )}
      >
        <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
          {description && <Text>{description}</Text>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <span className="relative flex h-4 w-[13px] shrink-0 items-center justify-center text-inherit">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="absolute block w-[13px] group-data-[state=open]:hidden"
        aria-hidden
      >
        <path
          d="M2 8.67969H14"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <path
          d="M8 2.67969L8 14.6797"
          stroke="currentColor"
          strokeWidth="0.7"
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="absolute hidden w-[13px] group-data-[state=open]:block"
        aria-hidden
      >
        <path
          d="M2 8.67969H14"
          stroke="currentColor"
          strokeWidth="0.7"
        />
      </svg>
    </span>
  )
}

export default Accordion
