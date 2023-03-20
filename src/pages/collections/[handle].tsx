import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import { getCollectionIds } from "@lib/util/get-collection-ids"
import CollectionTemplate from "@modules/collections/templates"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import SkeletonCollectionPage from "@modules/skeletons/templates/skeleton-collection-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "../../types/global"

interface Params extends ParsedUrlQuery {
  handle: string
}

const fetchCollection = async (id: string) => {
  return await medusaClient.collections.retrieve(id).then(({ collection }) => ({
    id: collection.id,
    title: collection.title,
  }))
}

const fetchCollectionByHandle = async (handle: string) => {
  return await medusaClient.collections.list({
    handle: [handle],
  }).then(({ collections }) => {
    return {
      id: collections[0].id,
      title: collections[0].title,
    }
  }
  )
}

export const fetchCollectionProducts = async ({
  pageParam = 0,
  id,
  cartId,
}: {
  pageParam?: number
  id: string
  cartId?: string
}) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    collection_id: [id],
    cart_id: cartId,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}

const CollectionPage: NextPageWithLayout<PrefetchedPageProps> = ({
  notFound,
}) => {
  const { query, isFallback, replace } = useRouter()
  const handle = typeof query.handle === "string" ? query.handle : ""

  const { data, isError, isSuccess, isLoading } = useQuery(
    ["get_collection_by_handle", handle],
    () => fetchCollection(handle)
  )

  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return <SkeletonCollectionPage />
  }

  if (isError) {
    replace("/404")
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonCollectionPage />
  }

  if (isSuccess) {
    return (
      <>
        <Head title={data.title} description={`${data.title} collection`} />
        <CollectionTemplate collection={data} />
      </>
    )
  }

  return <></>
}

const getCollectionHandles = async (): Promise<string[]> => {
  const data = await medusaClient.collections
    .list({ limit: 100 })
    .then(({ collections }) => {
      return collections.map(({ handle }) => handle)
    })
  return data
}

CollectionPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await getCollectionHandles()

  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient()
  const handle = context.params?.handle as string

  await queryClient.prefetchQuery(["get_collection_by_handle", handle], () =>
    fetchCollectionByHandle(handle)
  )

  const queryData: { id: string, title: string } | undefined = await queryClient.getQueryData([`get_collection_by_handle`, handle])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  const id = queryData.id

  await queryClient.prefetchInfiniteQuery(
    ["get_collection_products", id],
    ({ pageParam }) => fetchCollectionProducts({ pageParam, id }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  return {
    props: {
      // Work around see – https://github.com/TanStack/query/issues/1458#issuecomment-747716357
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      notFound: false,
    },
  }
}

export default CollectionPage
