import React from "react"
import { Product } from "types/medusa"

type ProductDetailsProps = {
  product: Pick<
    Product,
    "material" | "weight" | "width" | "height" | "length" | "origin_country"
  >
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="flex flex-col gap-y-5">
      <span className="text-gray-900 text-base-semi">Product details</span>
      <div className="grid grid-cols-2 gap-y-4">
        <Detail title="Material" info={product.material} />
        <Detail title="Height" info={product.height} unit="cm" />
        <Detail title="Weight" info={product.weight} unit="g" />
        <Detail title="Length" info={product.length} unit="cm" />
        <Detail title="Width" info={product.width} unit="cm" />
        <Detail title="Country of origin" info={product.origin_country} />
      </div>
    </div>
  )
}

const Detail = ({
  title,
  info,
  unit,
}: {
  title: string
  info: string | number
  unit?: string
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-small-semi text-gray-900">{title}</span>
      <span className="text-xsmall-regular text-gray-700">
        {info ? `${info} ${unit}` : "–"}
      </span>
    </div>
  )
}

export default ProductDetails
