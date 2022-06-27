import { useProductActions } from "@lib/context/product-context"
import Button from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/option-select"
import React from "react"
import { Product } from "types/medusa"

type ProductActionsProps = {
  product: Product
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const {
    formattedPrice,
    updateOptions,
    addToCart,
    options,
    disabled,
    maxQuantityMet,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    inStock,
  } = useProductActions()

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-xl-regular">{product.title}</h3>

      {product.variants.length > 1 && (
        <div className="my-8 flex flex-col gap-y-6">
          {product.options.map((option) => {
            return (
              <div key={option.id}>
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
      )}

      <div className="mb-4">
        <span className="text-xl-semi">{formattedPrice}</span>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between text-base-semi">
          <span>Select Quantity</span>
          <div className="flex items-center text-base-semi">
            <button
              onClick={decreaseQuantity}
              disabled={quantity === 1}
              className="disabled:text-gray-400"
            >
              –
            </button>
            <div className="w-12 flex justify-center">
              <span>{quantity}</span>
            </div>
            <button
              onClick={increaseQuantity}
              disabled={maxQuantityMet}
              className="disabled:text-gray-400"
            >
              +
            </button>
          </div>
        </div>
        <Button onClick={addToCart}>
          {!inStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  )
}

export default ProductActions
