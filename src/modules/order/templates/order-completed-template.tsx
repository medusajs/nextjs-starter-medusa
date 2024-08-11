import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { cookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import PickUpInfo from "../components/pick-up-info"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import OrderConfirmed from "../components/order-confirmed"

type OrderCompletedTemplateProps = {
  order: Order
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"


  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl content-container gap-y-10">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div className="flex flex-col w-full h-full max-w-4xl gap-4 py-10 bg-white" data-testid="order-complete-container">
{/* TODO rename component - OrderConfirmationDetails? */}
          <OrderConfirmed order={order} />

          <Heading level="h2" className="flex flex-row mt-4 text-2xl-regular">
            Order summary
          </Heading>
          <Items items={order.items} region={order.region} />
          <CartTotals data={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
