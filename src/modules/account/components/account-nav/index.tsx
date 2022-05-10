import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const AccountNav = () => {
  const { asPath } = useRouter()
  return (
    <div className="sticky top-0 flex items-center justify-center gap-x-6 border-b border-gray-200 bg-white z-20">
      <NavLink href="/account" asPath={asPath} text="Account" />
      <NavLink href="/account/orders" asPath={asPath} text="Orders" />
      <NavLink href="/account/wishlist" asPath={asPath} text="Wishlist" />
    </div>
  )
}

const NavLink = ({
  href,
  asPath,
  text,
}: {
  href: string
  asPath: string
  text: string
}) => {
  return (
    <Link href={href}>
      <a
        className={clsx(
          "h-full px-2 py-4 text-small-regular text-gray-700 hover:text-gray-900 transition-colors uppercase",
          {
            "border-b-2 border-gray-900 text-gray-900 text-small-semi":
              asPath === href,
          }
        )}
      >
        {text}
      </a>
    </Link>
  )
}

export default AccountNav
