import { getCollectionData } from "@lib/data"
import { getCollectionIds } from "@lib/util/get-collection-ids"
import { ProductCollection } from "@medusajs/medusa/dist"
import CollectionTemplate from "@modules/collections/templates"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import React from "react"
import { Product } from "types/medusa"
import { StoreProps } from "../../types/global"

interface Params extends ParsedUrlQuery {
  id: string
}

interface AdditionalData {
  initialProducts: Product[]
  count: number
  hasMore: boolean
}

const ProductPage: NextPage<StoreProps<ProductCollection, AdditionalData>> = ({
  page,
  site,
}) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout site={site}>
      <Head
        title={page.data.title}
        description={`${page.data.title} collection`}
      />
      <CollectionTemplate
        collection={page.data}
        inititalProducts={page.additionalData.initialProducts}
        count={page.additionalData.count}
        hasMore={page.additionalData.hasMore}
      />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const ids = await getCollectionIds()
  return {
    paths: ids.map((id) => ({ params: { id } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  StoreProps<ProductCollection, AdditionalData>,
  Params
> = async (context) => {
  const id = context.params?.id

  if (!id) {
    throw new Error("No id provided")
  }

  const data = await getCollectionData(id)

  return {
    props: {
      ...data,
    },
  }
}

export default ProductPage
