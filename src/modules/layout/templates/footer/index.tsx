import { Text, clx } from "@medusajs/ui"

import { getCategoriesList, getCollectionsList } from "@lib/data"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PoweredByLogos from "@modules/layout/components/powered-by-logos"
import Image from "next/image"

export default async function Footer() {
  const { collections } = await getCollectionsList(0, 6)
  const { product_categories } = await getCategoriesList(0, 6)

  return (
    <footer className="w-full border-t border-ui-border-base">
      <div className="flex flex-col w-full content-container">
        <div className="flex flex-col items-start justify-between py-10 gap-y-6 xsmall:flex-row">
          <div>
            <LocalizedClientLink
              href="/"
              className="flex items-center uppercase gap-x-2 txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base"
            >
              <Image src="/coshop-logo.png" alt="" width={32} height={32} />
              <span>Powered by CoShop</span>
            </LocalizedClientLink>
          </div>
        </div>
        <div className="flex justify-between w-full mb-16 text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} CoShop™
          </Text>
          {/* <PoweredByLogos /> */}
        </div>
      </div>
    </footer>
  )
}
