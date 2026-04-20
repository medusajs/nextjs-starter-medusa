import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { Text } from "@medusajs/ui"
import type { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterColumns from "./footer-columns"
import FooterEmailSignup from "./footer-email-signup"
import FooterRegionLocale from "./footer-region-locale"

export default async function Footer() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((items: StoreRegion[]) => items),
    listLocales(),
    getLocale(),
  ])

  return (
    <footer className="border-t border-qw-pale-grey bg-qw-white w-full">
      <div className="content-container">
        <div className="border-b border-qw-pale-grey py-14 small:py-20">
          <FooterEmailSignup />
        </div>

        <div className="py-9 small:py-14">
          <FooterColumns />
        </div>

        <div className="border-t border-qw-pale-grey py-7 small:py-9">
          <div className="flex flex-col items-center gap-4">
            <FooterRegionLocale
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
            <Text className="text-[10px] tracking-[0.04em] text-qw-grey">
              © {new Date().getFullYear()} QW. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}
