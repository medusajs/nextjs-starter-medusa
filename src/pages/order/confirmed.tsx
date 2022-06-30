import { getSiteData } from "@lib/data"
import LoadingPage from "@modules/common/components/loading-page"
import Layout from "@modules/layout/templates"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { useOrder } from "medusa-react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { NextPageWithLayout, SiteProps } from "types/global"

const Confirmed: NextPageWithLayout = () => {
  const router = useRouter()

  const { id } = router.query

  const { order, isLoading } = useOrder(id as string, {
    enabled: !!id,
  })

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !order ? (
        <div>Order not found</div>
      ) : (
        <OrderCompletedTemplate order={order} />
      )}
    </>
  )
}

Confirmed.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
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
