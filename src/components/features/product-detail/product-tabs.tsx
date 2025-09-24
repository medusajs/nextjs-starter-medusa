"use client"

import { useTranslations } from "next-intl"

import { Package2Icon, RefreshCcwIcon, RotateCcwIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives/accordion"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
}

function ProductTabs({ product }: Props) {
  const t = useTranslations("features.product_detail.product_tabs.label")
  const tabs = [
    {
      label: t("product_info"),
      component: <ProductInfoTab product={product} />,
    },
    {
      label: t("shipping_returns"),
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <AccordionItem key={i} title={tab.label} value={tab.label}>
            <AccordionTrigger>{tab.label}</AccordionTrigger>
            <AccordionContent>{tab.component}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function ProductInfoTab({ product }: Props) {
  const t = useTranslations(
    "features.product_detail.product_tabs.content.product_info_tab"
  )
  return (
    <div className="text-sm py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t("material")}</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("country")}</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("type")}</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t("weight")}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("dimensions")}</span>
            <p>
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

function ShippingInfoTab() {
  const t = useTranslations(
    "features.product_detail.product_tabs.content.shipping_info_tab"
  )
  return (
    <div className="text-sm py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <Package2Icon className="size-4 mt-0.5" />
          <div>
            <span className="font-semibold">{t("fast_delivery.title")}</span>
            <p className="max-w-sm">{t("fast_delivery.description")}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <RefreshCcwIcon className="size-4 mt-0.5" />
          <div>
            <span className="font-semibold">{t("simple_exchanges.title")}</span>
            <p className="max-w-sm">{t("simple_exchanges.description")}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <RotateCcwIcon className="size-4 mt-0.5" />
          <div>
            <span className="font-semibold">{t("easy_returns.title")}</span>
            <p className="max-w-sm">{t("easy_returns.description")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProductTabs, ProductInfoTab, ShippingInfoTab }
export type { Props as ProductTabsProps }
