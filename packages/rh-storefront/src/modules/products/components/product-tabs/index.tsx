"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-6 text-[13px] font-sans font-normal leading-relaxed text-qw-charcoal">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Material
            </span>
            <p className="mt-1 text-qw-charcoal">{product.material ?? "-"}</p>
          </div>
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Country of origin
            </span>
            <p className="mt-1 text-qw-charcoal">{product.origin_country ?? "-"}</p>
          </div>
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Type
            </span>
            <p className="mt-1 text-qw-charcoal">{product.type?.value ?? "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Weight
            </span>
            <p className="mt-1 text-qw-charcoal">{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Dimensions
            </span>
            <p className="mt-1 text-qw-charcoal">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-6 text-[13px] font-sans font-normal leading-relaxed text-qw-charcoal">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Fast delivery
            </span>
            <p className="mt-1 max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Simple exchanges
            </span>
            <p className="mt-1 max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-sans font-light uppercase tracking-[0.14em] text-qw-medium-grey text-[11px] leading-4">
              Easy returns
            </span>
            <p className="mt-1 max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
