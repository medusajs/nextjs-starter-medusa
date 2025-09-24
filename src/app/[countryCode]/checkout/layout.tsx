import { ChevronDownIcon, CloudCheckIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Nav } from "@/components/ui/react/design-system"
import { Button } from "@/components/ui/primitives/button"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("layout.checkout")

  return (
    <div className="w-full bg-background relative lg:min-h-screen">
      <Nav
        className="bg-background border-b w-full h-16 sticky top-0 z-50"
        containerClassName="flex items-center h-full justify-between"
      >
        <LocalizedClientLink href="/cart" data-testid="back-to-cart-link">
          <Button variant="ghost">
            <ChevronDownIcon className="rotate-90" size={16} />
            <span className="sr-only lg:not-sr-only">
              {t("desktop_back_button")}
            </span>
            <span className="not-sr-only lg:sr-only">
              {t("mobile_back_button")}
            </span>
          </Button>
        </LocalizedClientLink>
        <p className="flex items-center gap-2 text-green-500 font-semibold">
          <CloudCheckIcon />
          {t("safety")}
        </p>
      </Nav>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
