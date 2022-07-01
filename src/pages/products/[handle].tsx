import { medusaClient } from "@lib/config"
import { getProductHandles } from "@lib/util/get-product-handles"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import ProductTemplate from "@modules/products/templates"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "types/global"

interface Params extends ParsedUrlQuery {
  handle: string
}

/**
 * At runtime we refetch the products variant data to get the latest inventory data, and customer specific pricing.
 */
const fetchVariants = async ({
  productId,
  cartId,
}: {
  productId: string
  cartId: string
}) => {
  const request = await medusaClient.products.list({
    id: productId,
    cart_id: cartId,
  })

  return request.products[0].variants
}

const fetchProduct = async (handle: string) => {
  return await medusaClient.products
    .list({ handle })
    .then(({ products }) => products[0])
}

const ProductPage: NextPageWithLayout<PrefetchedPageProps> = ({ notFound }) => {
  const { query, isFallback, replace } = useRouter()
  const handle = typeof query.handle === "string" ? query.handle : ""

  const { data, isError, isLoading, isSuccess } = useQuery(
    [`get_product`, handle],
    () => fetchProduct(handle),
    {
      enabled: handle.length > 0,
      keepPreviousData: true,
    }
  )

  // const [product, setProduct] = useState(data!)

  // const { data: rehydratedVariants } = useQuery(
  //   [`rehydrated_variants_${data?.id}`, product?.id, cart?.id],
  //   async () =>
  //     await fetchVariants({ productId: product?.id || "", cartId: cart?.id! }),
  //   {
  //     enabled: !!cart?.id,
  //   }
  // )

  // // /**
  // //  * Rehydrate the product variants with the latest inventory and pricing data.
  // //  */
  // // useEffect(() => {
  // //   if (data && rehydratedVariants) {
  // //     // @ts-ignore - ignore ts as product variant type is erroneously typed
  // //     setProduct({
  // //       ...data,
  // //       variants: rehydratedVariants,
  // //     })
  // //   }
  // // }, [data, rehydratedVariants])

  if (notFound) {
    return <div>error</div>
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonProductPage />
  }

  if (isError) {
    replace("/404")
  }

  if (isSuccess) {
    return (
      <>
        <Head
          description={data.description}
          title={data.title}
          image={data.thumbnail}
        />
        <ProductTemplate product={data} />
      </>
    )
  }

  return <></>
}

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await getProductHandles()
  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const handle = context.params?.handle as string

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery([`get_product`, handle], () =>
    fetchProduct(handle)
  )

  const queryData = await queryClient.getQueryData([`get_product`, handle])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      notFound: false,
    },
  }
}

export default ProductPage
