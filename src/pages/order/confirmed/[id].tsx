import { medusaClient } from "@lib/config"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout } from "types/global"

const fetchOrder = async (id: string) => {
  return await medusaClient.orders.retrieve(id).then(({ order }) => order)
}

const Confirmed: NextPageWithLayout = () => {
  const router = useRouter()

  const id = typeof router.query?.id === "string" ? router.query.id : ""

  const { isSuccess, data, isLoading, isError } = useQuery(
    ["get_order_confirmed", id],
    () => fetchOrder(id),
    {
      enabled: id.length > 0,
      staleTime: Infinity,
    }
  )

  if (isSuccess) {
    return (
      <>
        <Head
          title="Order Confirmed"
          description="You purchase was successful"
        />

        <OrderCompletedTemplate order={data} />
      </>
    )
  }

  if (isLoading) {
    return <div className="center">Loading...</div>
  }

  if (isError) {
    return (
      <div className="center">
        We couldn&aspos;t find your pokemon{" "}
        <span role="img" aria-label="sad">
          😢
        </span>
      </div>
    )
  }

  return <></>
}

Confirmed.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(["get_order_confirmed", id], () =>
    fetchOrder(id)
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Confirmed
