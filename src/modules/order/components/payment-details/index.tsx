import { Order } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

import { paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"

type PaymentDetailsProps = {
  order: Order
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payments[0]
  return (
    <div>
      <Heading level="h2" className="flex flex-row my-6 sr-only text-3xl-regular">
        Payment
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start w-full gap-x-1">
            <div className="flex flex-col w-1/3">
              <Heading className="mb-1 txt-large-plus text-ui-fg-base">
                Payment method
              </Heading>
              <Text className="txt-medium text-ui-fg-subtle" data-testid="payment-method">
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex flex-col w-2/3">
              <Heading className="mb-1 txt-large-plus text-ui-fg-base">
                Payment details
              </Heading>
              <div className="flex items-center gap-2 txt-medium text-ui-fg-subtle">
                <Container className="flex items-center p-2 h-7 w-fit bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                {/* TODO check if we need the option to show the last four digits of stripe card - looks like we never get here with stripe payments anyway? */}
                <Text data-testid="payment-amount">
                  {payment.provider_id === "manual" ?
                    `Awaiting bank transfer`
                    : payment.provider_id === "stripe" && payment.data.card_last4
                      ? `**** **** **** ${payment.data.card_last4}`
                      : `${formatAmount({
                        amount: payment.amount,
                        region: order.region,
                        includeTaxes: true,
                      })} paid at ${new Date(payment.created_at).toString()}`
                  }
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
