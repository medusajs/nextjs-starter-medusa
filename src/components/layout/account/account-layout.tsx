import React from "react"

import { cn } from "@/lib/utils"
import { listProducts } from "@/utils/data/products"
import { getRegion } from "@/utils/data/regions"

import { AccountSidebar } from "@/components/layout/account/account-sidebar"
import { ProductPreview } from "@/components/modules/product/product-preview"
import { Separator } from "@/components/ui/primitives/separator"

import type { HttpTypes } from "@medusajs/types"

interface Props {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
  countryCode: string
}

async function FeaturedProducts({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)

  if (!region) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields: "*variants.calculated_price",
    },
  })

  return (
    <div className="flex flex-col mt-5">
      <h1 className="text-lg mb-4">Öne Çıkan Ürünler</h1>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products &&
          products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}

async function AccountLayout({ customer, children, countryCode }: Props) {
  return (
    <div data-testid="account-page" className="lg:container">
      <div
        className={cn(
          "grid grid-cols-1 my-5 lg:my-8 gap-10",
          customer ? "lg:grid-cols-[240px_1fr]" : ""
        )}
      >
        <div>{customer && <AccountSidebar customer={customer} />}</div>
        <div className="flex-1 max-lg:container">
          {children}
          <Separator className="my-10" />
          <FeaturedProducts countryCode={countryCode} />
        </div>
      </div>
    </div>
  )
}

export { AccountLayout }
export type { Props as AccountLayoutProps }
