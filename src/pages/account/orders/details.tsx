import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import OrderDetailsTemplate from "@modules/account/templates/order-details-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps, NextPage } from "next"
import React from "react"
import { SiteProps } from "types/global"

const OrderDetails: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <AccountLayout>
        <OrderDetailsTemplate />
      </AccountLayout>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<SiteProps> = async () => {
  const data = await getSiteData()

  return {
    props: {
      ...data,
    },
  }
}

export default OrderDetails
