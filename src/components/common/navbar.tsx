import { ShoppingCartIcon, UserIcon } from "lucide-react"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Nav } from "@/components/ui/react/design-system"

import type { PropsWithChildren } from "react"

function NavbarItem({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <LocalizedClientLink
      href={href}
      className="size-10 [&>svg]:size-5 hover:text-accent-foreground flex items-center justify-center before:absolute before:inset-0 before:rounded-inherit before:-z-10 before:rounded-lg hover:before:bg-accent before:transition-all hover:before:scale-105 relative"
    >
      {children}
    </LocalizedClientLink>
  )
}

async function Navbar() {
  return (
    <Nav
      className="sticky top-0 z-50 w-full bg-background border-b"
      containerClassName="flex items-center justify-between h-16"
    >
      <div className="flex items-center h-full">
        <LocalizedClientLink
          href="/"
          className="txt-compact-xlarge-plus hover:text-foreground uppercase"
          data-testid="nav-store-link"
        >
          Medusa Store
        </LocalizedClientLink>
      </div>

      <div className="flex items-center h-full flex-1 basis-0 justify-end">
        <NavbarItem href="/account">
          <UserIcon />
        </NavbarItem>
        <NavbarItem href="/cart">
          <ShoppingCartIcon />
        </NavbarItem>
      </div>
    </Nav>
  )
}

export { Navbar }
