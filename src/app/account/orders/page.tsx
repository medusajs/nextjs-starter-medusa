import OrdersTemplate from "@modules/account/templates/orders-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders..",
}

export default function Orders() {
  return <OrdersTemplate />
}
