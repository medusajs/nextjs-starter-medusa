import { getSiteData } from "@lib/data"
import LoadingPage from "@modules/common/components/loading-page"
import Layout from "@modules/layout/templates"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { useOrder } from "medusa-react"
import { GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { SiteProps } from "types/global"

const Confirmed: NextPage<SiteProps> = ({ site }) => {
  const router = useRouter()

  const { id } = router.query

  const { order, isLoading } = useOrder(id as string, {
    enabled: !!id,
  })

  return (
    <Layout site={site}>
      {isLoading ? (
        <LoadingPage />
      ) : !order ? (
        <div>Order not found</div>
      ) : (
        <OrderCompletedTemplate order={order} />
      )}
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

export default Confirmed
