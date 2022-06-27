import { useScrollListenser } from "@lib/hooks/use-scroll.listener"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import MobileMenu from "@modules/layout/components/mobile-menu"
import SearchDropdown from "@modules/layout/components/search-dropdown"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const Nav: React.FC = () => {
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
      <header className="relative h-16 px-8 mx-auto bg-white border-b border-gray-200">
        <nav className="text-gray-900 flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0">
            <Hamburger open={open} setOpen={() => setOpen(!open)} />
          </div>

          <div className="flex items-center h-full">
            <Link href="/">
              <a className="text-xl-semi uppercase">Acme</a>
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {process.env.FEATURE_SEARCH_ENABLED && <SearchDropdown />}
            {process.env.FEATURE_CUSTOMERAUTH_ENABLED && (
              <Link href="/account">
                <a>Account</a>
              </Link>
            )}
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </header>
    </div>
  )
}

export default Nav
