import { AccountProvider } from "@lib/context/account-context"
import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import Layout from "@modules/layout/templates"
import { useOrder } from "medusa-react"
import { GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { SiteProps } from "types/global"

const OrderDetails: NextPage<SiteProps> = ({ site }) => {
  const router = useRouter()

  const { order } = router.query

  const { order: details, isLoading } = useOrder(order as string, {
    enabled: !!order
  })
  
  return (
    <Layout site={site}>
      <AccountProvider>
        <AccountLayout>
          {details && JSON.stringify(details, null, 2)}
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

export default OrderDetails