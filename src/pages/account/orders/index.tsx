import { AccountProvider } from "@lib/context/account-context"
import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import OrdersTemplate from "@modules/account/templates/orders-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps, NextPage } from "next"
import React from "react"
import { SiteProps } from "types/global"

const Orders: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <AccountProvider>
        <AccountLayout>
          <OrdersTemplate />
        </AccountLayout>
      </AccountProvider>
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

export default Orders
