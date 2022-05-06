import { formatAmount } from "medusa-react"
import React from "react"
import { Region } from "types/medusa"

type CheckoutTotalsProps = {
  region?: Region
  subtotal?: number
  shippingTotal?: number
  taxTotal?: number | null
  total?: number
}

const CheckoutTotals: React.FC<CheckoutTotalsProps> = ({
  subtotal = 0,
  shippingTotal = 0,
  taxTotal = 0,
  total = 0,
  region,
}) => {
  return (
    <div className="px-4 py-8">
      {region && (
        <div className="flex flex-col gap-y-8 text-base-regular">
          <div className="flex flex-col gap-y-4">
            <TotalContainer>
              <span>Subtotal</span>
              <span>
                {formatAmount({
                  amount: subtotal,
                  region: region,
                  includeTaxes: true,
                })}
              </span>
            </TotalContainer>
            <TotalContainer>
              <span>Shipping</span>
              <span>
                {formatAmount({
                  amount: shippingTotal,
                  region: region,
                  includeTaxes: false,
                })}
              </span>
            </TotalContainer>
          </div>
          <TotalContainer>
            <div className="flex flex-col">
              <span className="text-large-semi">Total</span>
              <span className="text-small-regular text-gray-700">
                {`Including ${formatAmount({
                  amount: taxTotal || 0,
                  region: region,
                  includeTaxes: false,
                })} in taxes`}
              </span>
            </div>
            <span className="text-large-semi">
              {formatAmount({
                amount: total,
                region: region,
                includeTaxes: false,
              })}
            </span>
          </TotalContainer>
        </div>
      )}
    </div>
  )
}

const TotalContainer: React.FC = ({ children }) => {
  return <div className="flex items-start justify-between">{children}</div>
}

export default CheckoutTotals
