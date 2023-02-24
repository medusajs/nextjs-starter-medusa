import { ProductVariant, SetRelation } from "@medusajs/client-types"

type ProductVariantWithOptionsWithProduct = SetRelation<ProductVariant, "product">

type LineItemOptionsProps = { variant: ProductVariantWithOptionsWithProduct }

const LineItemOptions = ({ variant }: LineItemOptionsProps) => {
  return (
    <div className="text-small-regular text-gray-700">
      {(variant.options ?? []).map((option) => {
        const optionName =
          variant.product?.options?.find((opt) => opt.id === option.option_id)
            ?.title || "Option"
        return (
          <div key={option.id}>
            <span>
              {optionName}: {option.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default LineItemOptions
