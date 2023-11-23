import { getProductsList, getCollectionsList } from "@lib/data"
import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { ProductCollection, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useQuery } from "@tanstack/react-query"
import { formatAmount, useCart } from "medusa-react"
import { ProductPreviewType } from "types/global"
import { CalculatedVariant } from "types/medusa"

type LayoutCollection = {
  handle: string
  title: string
}

const fetchCollectionData = async (): Promise<LayoutCollection[]> => {
  let collections: ProductCollection[] = []
  let offset = 0
  let count = 1

  do {
    await getCollectionsList(offset)
      .then((res) => res)
      .then(({ collections: newCollections, count: newCount }) => {
        collections = [...collections, ...newCollections]
        count = newCount
        offset = collections.length
      })
      .catch((_) => {
        count = 0
      })
  } while (collections.length < count)

  return collections.map((c) => ({
    handle: c.handle,
    title: c.title,
  }))
}

export const useNavigationCollections = () => {
  const queryResults = useQuery({
    queryFn: fetchCollectionData,
    queryKey: ["navigation_collections"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return queryResults
}

const fetchFeaturedProducts = async (
  cartId: string,
  region: Region,
  collectionId?: string
): Promise<ProductPreviewType[]> => {
  const products: PricedProduct[] = await getProductsList({
    pageParam: 0,
    queryParams: {
      limit: 3,
      cart_id: cartId,
      region_id: region.id,
      currency_code: region.currency_code,
      collection_id: collectionId ? [collectionId] : [],
    },
  })
    .then((res) => res.response)
    .then(({ products }) => products)
    .catch((_) => [] as PricedProduct[])

  return products
    .filter((p) => !!p.variants)
    .map((p) => {
      const variants = p.variants as unknown as CalculatedVariant[]

      const cheapestVariant = variants.reduce((acc, curr) => {
        if (acc.calculated_price > curr.calculated_price) {
          return curr
        }
        return acc
      }, variants[0])

      return {
        id: p.id!,
        title: p.title!,
        handle: p.handle!,
        thumbnail: p.thumbnail!,
        price: cheapestVariant
          ? {
              calculated_price: formatAmount({
                amount: cheapestVariant.calculated_price,
                region: region,
                includeTaxes: false,
              }),
              original_price: formatAmount({
                amount: cheapestVariant.original_price,
                region: region,
                includeTaxes: false,
              }),
              difference: getPercentageDiff(
                cheapestVariant.original_price,
                cheapestVariant.calculated_price
              ),
              price_type: cheapestVariant.calculated_price_type,
            }
          : {
              calculated_price: "N/A",
              original_price: "N/A",
              difference: "N/A",
              price_type: "default",
            },
      }
    })
}

export const useFeaturedProductsQuery = (collectionId?: string) => {
  const { cart } = useCart()

  const queryResults = useQuery(
    ["layout_featured_products", cart?.id, cart?.region, collectionId],
    () =>
      fetchFeaturedProducts(
        cart?.id!,
        cart?.region!,
        collectionId && collectionId
      ),
    {
      enabled: !!cart?.id && !!cart?.region,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  )

  return queryResults
}
