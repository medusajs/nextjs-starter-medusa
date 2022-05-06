import { useProductActions } from "@lib/context/product-context"
import QuantitySelector from "@modules/common/components/quantity-selector"
import Plus from "@modules/common/icons/plus"
import OptionSelect from "@modules/products/components/option-select"
import React from "react"
import { Product } from "types/medusa"
import BreadCrumbs from "../bread-crumbs"

type ProductActionsProps = {
  product: Product
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const {
    formattedPrice,
    updateOptions,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    quantity,
    options,
    disabled,
    inStock,
  } = useProductActions()

  return (
    <div>
      <BreadCrumbs collection={product.collection} className="mb-3" />
      <h3 className="text-2xl-semi">{product.title}</h3>
      <span className="text-base-regular text-gray-700">{formattedPrice}</span>
      <p className="text-base-regular mt-8">{product.description}</p>
      <div className="mt-8">
        {product.options.map((option) => {
          return (
            <div key={option.id} className="mb-2 last:mb-4">
              <OptionSelect
                option={option}
                current={options[option.id]}
                updateOption={updateOptions}
                title={option.title}
              />
            </div>
          )
        })}
      </div>

      <QuantitySelector
        size="large"
        quantity={quantity}
        increase={increaseQuantity}
        decrease={decreaseQuantity}
      />

      <button
        onClick={addToCart}
        className="bg-gray-900 text-white py-3 flex items-center justify-center text-small-regular disabled:opacity-50 w-full uppercase"
        disabled={disabled}
      >
        {!inStock ? (
          "Out of stock"
        ) : disabled ? (
          "Select variant"
        ) : (
          <div className="flex items-center gap-x-2">
            <span>Add to cart</span>
            <Plus size={16} />
          </div>
        )}
      </button>
    </div>
  )
}

export default ProductActions
