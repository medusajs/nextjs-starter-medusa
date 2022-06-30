import Overview from "@modules/account/components/overview"
import { useCart, useCustomerOrders, useMeCustomer } from "medusa-react"

const OverviewTemplate = () => {
  const { orders } = useCustomerOrders()
  const { customer } = useMeCustomer()
  const { cart } = useCart()

  return <Overview orders={orders} customer={customer} cart={cart} />
}

export default OverviewTemplate
