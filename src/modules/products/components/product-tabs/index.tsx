"use client"

import { useTranslations } from "next-intl"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const t = useTranslations()

  const tabs = [
    {
      label: t('PRODUCT_INFORMATION'),
      component: <ProductInfoTab product={product} />,
    },
    {
      label: t('SHIPPING_RETURNS'),
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
  const t = useTranslations()

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t('MATERIAL')}</span>
            <p>{product.material ? product.material : t('_5')}</p>
          </div>
          <div>
            <span className="font-semibold">{t('COUNTRY_OF_ORIGIN')}</span>
            <p>{product.origin_country ? product.origin_country : t('_5')}</p>
          </div>
          <div>
            <span className="font-semibold">{t('TYPE')}</span>
            <p>{product.type ? product.type.value : t('_5')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t('WEIGHT')}</span>
            <p>{product.weight ? `${product.weight} g` : t('_5')}</p>
          </div>
          <div>
            <span className="font-semibold">{t('DIMENSIONS')}</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}${t('L_X')} ${product.width}${t('W_X')} ${
                    product.height
                  }${t('H')}`
                : t('_5')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const t = useTranslations()

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{t('FAST_DELIVERY')}</span>
            <p className="max-w-sm">
              {t('YOUR_PACKAGE_WILL_ARRIVE_IN')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">{t('SIMPLE_EXCHANGES')}</span>
            <p className="max-w-sm">
              {t('IS_THE_FIT_NOT_QUITE_RIGHT_NO')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">{t('EASY_RETURNS')}</span>
            <p className="max-w-sm">
              {t('IS_THE_FIT_NOT_QUITE_RIGHT_NO')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
