import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

const AccountNav = () => {
  const { route } = useRouter()

  return (
    <div>
      <div>
        <div className="py-4">
          <h3 className="text-base-semi">Account</h3>
        </div>
        <div className="text-small-regular pl-2">
          <ul className="flex flex-col gap-y-2">
            <li>
              <AccountNavLink href="/account/profile" route={route}>
                Profile
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink href="/account/addresses" route={route}>
                Addresses
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink href="/account/orders" route={route}>
                Orders
              </AccountNavLink>
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
}

const AccountNavLink = ({ href, route, children }: AccountNavLinkProps) => {
  const active = route === href
  return (
    <Link href={href}>
      <a
        className={clsx("text-gray-700", {
          "text-gray-900 font-semibold": active,
        })}
      >
        {children}
      </a>
    </Link>
  )
}

export default AccountNav
