import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-ui-fg-interactive">{children}</Text>
      <span className="group-hover:rotate-45 ease-in-out duration-150 text-ui-fg-interactive">
        →
      </span>
    </LocalizedClientLink>
  )
}

export default InteractiveLink
