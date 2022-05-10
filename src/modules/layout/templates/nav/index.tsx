import { useScrollListenser } from "@lib/hooks/use-scroll.listener"
import Hamburger from "@modules/common/components/hamburger"
import User from "@modules/common/icons/user"
import CartPopover from "@modules/layout/components/cart-popover"
import DesktopMenu from "@modules/layout/components/desktop-menu"
import MobileMenu from "@modules/layout/components/mobile-menu"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { SiteProps } from "types/global"

const Nav: React.FC<SiteProps> = ({ site }) => {
  const showNav = useScrollListenser()
  const router = useRouter()
  const [fixate, setFixate] = useState(false)

  useEffect(() => {
    setFixate(/\/account.*/g.test(router.pathname))
  }, [router])

  const [open, setOpen] = useState(false)
  return (
    <div
      className={clsx(
        {
          "sticky inset-x-0 z-50 transition-all duration-300": !fixate,
        },
        {
          "top-0": showNav && !fixate,
          "-top-16": !showNav && !fixate,
        }
      )}
    >
      <header className="relative h-16">
        <nav className="text-gray-900 flex items-center justify-between w-full h-full px-8 mx-auto bg-white">
          <Hamburger open={open} setOpen={() => setOpen(!open)} />
          <div className="flex items-center h-full">
            <Link href="/">
              <a className="text-2xl-semi">ACME</a>
            </Link>
            <DesktopMenu site={site} />
          </div>

          <div className="flex items-center gap-x-6 h-full">
            {process.env.FEATURE_CUSTOMERAUTH_ENABLED && (
              <Link href="/account">
                <a>
                  <User size={20} className="lg:block hidden" />
                </a>
              </Link>
            )}
            <CartPopover />
          </div>
        </nav>
        <MobileMenu open={open} onClose={() => setOpen(false)} site={site} />
      </header>
    </div>
  )
}

export default Nav
