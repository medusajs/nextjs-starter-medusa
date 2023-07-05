"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import { useState } from "react"

const StoreTemplate = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6">
      <RefinementList refinementList={params} setRefinementList={setParams} />
      <InfiniteProducts params={params} />
    </div>
  )
}

export default StoreTemplate
