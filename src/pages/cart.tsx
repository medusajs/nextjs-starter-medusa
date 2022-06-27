import CartTemplate from "@modules/cart/templates"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const Cart: NextPageWithLayout = () => {
  return <CartTemplate />
}

Cart.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default Cart
