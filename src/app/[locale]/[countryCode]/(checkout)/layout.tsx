import k from "@lib/i18n/translations/keys"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { Suspense } from "react"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations()
  return (
    <Suspense fallback={<></>}>
      <div className="w-full bg-white relative small:min-h-screen">
        <div className="h-16 bg-white border-b ">
          <nav className="flex h-full items-center content-container justify-between">
            <LocalizedClientLink
              href="/cart"
              className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
              data-testid="back-to-cart-link"
            >
              <ChevronDown className="rotate-90" size={16} />
              <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                {t(k.BACK_TO_SHOPPING_CART)}
              </span>
              <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                {t(k.BACK)}
              </span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
              data-testid="store-link"
            >
              {t(k.MEDUSA_STORE)}
            </LocalizedClientLink>
            <div className="flex-1 basis-0" />
          </nav>
        </div>
        <div className="relative" data-testid="checkout-container">{children}</div>
        <div className="py-4 w-full flex items-center justify-center">
          <MedusaCTA />
        </div>
      </div>
    </Suspense>
  )
}
