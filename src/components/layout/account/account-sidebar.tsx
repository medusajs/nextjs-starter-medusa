"use client"

import { Fragment } from "react"
import { useParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EarthIcon,
  EyeIcon,
  LogOutIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react"

import { signout } from "@/utils/data/customer"
import { cn } from "@/lib/utils"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Separator } from "@/components/ui/primitives/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/primitives/alert-dialog"

import type { ComponentProps } from "react"
import type { HttpTypes } from "@medusajs/types"

const items = [
  {
    langKey: "overview",
    icon: <EyeIcon />,
    href: "/account",
  },
  {
    langKey: "profile",
    icon: <UserIcon />,
    href: "/account/profile",
  },
  {
    langKey: "addresses",
    icon: <MapPinIcon />,
    href: "/account/addresses",
  },
  {
    langKey: "orders",
    icon: <PackageIcon />,
    href: "/account/orders",
  },
  {
    langKey: "region",
    icon: <EarthIcon />,
    href: "/account/region",
  },
]

function LogoutDialog(props: ComponentProps<typeof AlertDialogTrigger>) {
  const t = useTranslations("layout.account.sidebar.dialog.logout")
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel> {t("cancel_button")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            {t("action_button")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AccountSidebar({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) {
  const t = useTranslations("layout.account.sidebar")
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  return (
    <aside className="lg:sticky lg:top-25">
      <div className="lg:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-1 bg-secondary text-base py-4 container"
            data-testid="account-main-link"
          >
            <Fragment>
              <ChevronLeftIcon className="size-5" />
              <span>{t("label.account")}</span>
            </Fragment>
          </LocalizedClientLink>
        ) : (
          <Fragment>
            <div className="text-base font-medium mb-4 container bg-secondary py-4">
              {t("label.welcome", { name: customer?.first_name || "" })}
            </div>
            <div className="text-sm">
              <ul>
                {items
                  .filter((item) => item.langKey !== "overview")
                  .map((item, idx) => (
                    <li key={idx}>
                      <LocalizedClientLink
                        href={item.href}
                        className="flex py-4 border-b"
                        data-testid={`${item.langKey}-link`}
                      >
                        <div className="container flex items-center justify-between w-full">
                          <div className="flex items-center gap-x-2 [&>svg]:size-4">
                            {item.icon}
                            <span>{t(`item.${item.langKey}`)}</span>
                          </div>
                          <ChevronRightIcon className="size-4" />
                        </div>
                      </LocalizedClientLink>
                    </li>
                  ))}

                <li>
                  <LogoutDialog asChild>
                    <button
                      type="button"
                      className="flex py-4"
                      data-testid="logout-button"
                    >
                      <div className="container flex items-center justify-between w-full">
                        <div className="flex items-center gap-x-2 [&>svg]:size-4">
                          <LogOutIcon />
                          <span>{t("item.logout")}</span>
                        </div>
                        <ChevronRightIcon className="size-4" />
                      </div>
                    </button>
                  </LogoutDialog>
                </li>
              </ul>
            </div>
          </Fragment>
        )}
      </div>
      <div
        className="hidden lg:block group/account-nav"
        data-testid="account-nav"
      >
        <div>
          <div className="p-2">
            <h3 className="text-sm">{t("label.account")}</h3>
          </div>
          <div className="text-sm w-full">
            <ul className="flex mb-0 justify-start items-start flex-col w-full [&>li]:w-full">
              {items.map((item, idx) => (
                <li key={idx}>
                  <AccountSidebarLink
                    href={item.href}
                    route={route!}
                    data-testid={`${item.langKey}-link`}
                  >
                    {item.icon}
                    {t(`item.${item.langKey}`)}
                  </AccountSidebarLink>
                </li>
              ))}
              <Separator className="my-3" />
              <li>
                <LogoutDialog asChild>
                  <AccountSidebarLink>
                    <LogOutIcon /> {t("item.logout")}
                  </AccountSidebarLink>
                </LogoutDialog>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}

type AccountSidebarLinkProps = {
  href?: string
  route?: string
  children: React.ReactNode
  onClick?: () => void
  "data-testid"?: string
}

function AccountSidebarLink({
  href,
  route,
  onClick,
  children,
  "data-testid": dataTestId,
}: AccountSidebarLinkProps) {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route ? route?.split(countryCode)[1] === href : false

  const classnames = cn(
    "flex items-center transition-all z-10 text-sm gap-2 [&_svg]:size-5 p-2 w-full cursor-pointer before:transition-all hover:before:bg-accent before:absolute before:inset-0 before:rounded-full before:scale-95 hover:before:scale-105 before:-z-10 relative hover:text-accent-foreground text-muted-foreground",
    {
      "text-foreground before:bg-accent before:scale-105 pointer-events-none":
        active,
    }
  )

  return href ? (
    <LocalizedClientLink
      href={href}
      className={classnames}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={classnames}
      data-testid={dataTestId}
    >
      {children}
    </button>
  )
}

export { AccountSidebar, AccountSidebarLink }
