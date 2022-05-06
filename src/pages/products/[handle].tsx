import { medusaClient } from "@lib/config"
import { getProductData } from "@lib/data"
import { getProductHandles } from "@lib/util/get-product-handles"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import ProductTemplate from "@modules/products/templates"
import {} from "medusa-react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { StoreProps } from "types/global"
import { Product } from "types/medusa"

interface Params extends ParsedUrlQuery {
  handle: string
}

const fetchInventory = async (id: string) =>
  medusaClient.products.retrieve(id).then((data) => {
    return data.product.variants.map((v) => ({
      id: v.id,
      inventory_quantity: v.inventory_quantity,
      allow_backorder: v.allow_backorder,
    }))
  })

const ProductPage: NextPage<StoreProps<Product, Product[]>> = ({
  page,
  site,
}) => {
  const { data, additionalData } = page

  const [product, setProduct] = useState(data)

  const { data: inventory } = useQuery(
    ["inventory", product.id],
    async () => await fetchInventory(product.id)
  )

  // rehydrate product after inventory is fetched
  useEffect(() => {
    if (data && inventory) {
      setProduct({
        ...data,
        variants: [
          ...data.variants.map((variant) => {
            const newInventory = inventory.find(
              (update) => update.id === variant.id
            )
            return newInventory ? { ...variant, ...newInventory } : variant
          }),
        ],
      })
    }
  }, [data, inventory])

  return (
    <Layout site={site}>
      <Head
        description={product.description}
        title={product.title}
        image={product.thumbnail}
      />
      <ProductTemplate product={product} relatedProducts={additionalData} />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await getProductHandles()
  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  StoreProps<Product, Product[]>,
  Params
> = async (context) => {
  const handle = context.params?.handle

  if (!handle) {
    throw new Error("No handle provided")
  }

  const data = await getProductData(handle)

  return {
    props: {
      ...data,
    },
  }
}

export default ProductPage
