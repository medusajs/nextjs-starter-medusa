import Link from "next/link"
import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
}

const InteractiveLink = ({
  href,
  children,
  ...props
}: InteractiveLinkProps) => {
  return (
    <Link className="flex gap-x-1 items-center group" href={href} {...props}>
      <Text className="text-ui-fg-interactive">{children}</Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        color="var(--fg-interactive)"
      />
    </Link>
  )
}

export default InteractiveLink
