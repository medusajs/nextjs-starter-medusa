import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { retrieveCart } from "@/utils/data/cart"
import { retrieveCustomer } from "@/utils/data/customer"
import { generateMeta } from "@/utils/meta/generate-meta"

import { PaymentWrapper } from "@/components/features/checkout/wrapper/payment-wrapper"
import { CheckoutForm } from "@/components/features/checkout/checkout-form"
import { Separator } from "@/components/ui/primitives/separator"
import { CartTotals } from "@/components/features/cart/cart-totals"
import { ItemsPreviewTemplate } from "@/components/features/cart/cart-items-preview"
import {
  DiscountCode,
  DiscountCodeProps,
} from "@/components/modules/cart/discount-code"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.checkout.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "checkout"],
  })
}

export default async function Checkout({}) {
  const cart = await retrieveCart()
  const t = await getTranslations("pages.checkout")

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] container gap-20 my-10">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <div className="sticky top-26 self-start flex flex-col w-full gap-10">
        <div className="w-full flex flex-col bg-secondary h-fit p-6 gap-4 rounded-xl">
          <h2 className="text-xl">{t("label.summary")}</h2>
          <Separator />
          <CartTotals totals={cart} />
          <Separator />
          <DiscountCode cart={cart as DiscountCodeProps["cart"]} />
        </div>
        <Separator />
        <ItemsPreviewTemplate cart={cart} />
      </div>
    </div>
  )
}
