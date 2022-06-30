import { getSiteData } from "@lib/data"
import Layout from "@modules/layout/templates"
import { useOrder } from "medusa-react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { NextPageWithLayout, SiteProps } from "types/global"

const Details: NextPageWithLayout = () => {
  const router = useRouter()

  const { id } = router.query

  const { order, isLoading } = useOrder(id as string, {
    enabled: !!id,
  })

  return <div>{JSON.stringify(order, null, 2)}</div>
}

Details.getLayout = (page: ReactElement) => {
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

export default Details
