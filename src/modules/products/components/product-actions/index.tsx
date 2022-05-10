import { useProductActions } from "@lib/context/product-context"
import Button from "@modules/common/components/button"
import QuantitySelector from "@modules/common/components/quantity-selector"
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
      <h3 className="text-xl-regular">{product.title}</h3>
      <span className="text-large-regular">{formattedPrice}</span>
      <p className="text-small-regular text-gray-700 mt-4">
        {product.description}
      </p>
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

      <Button onClick={addToCart} disabled={disabled}>
        {!inStock ? (
          "Out of stock"
        ) : disabled ? (
          "Select variant"
        ) : (
          <div className="flex items-center gap-x-2">
            <span>Add to cart</span>
          </div>
        )}
      </Button>

      <QuantitySelector
        size="large"
        quantity={quantity}
        increase={increaseQuantity}
        decrease={decreaseQuantity}
      />
    </div>
  )
}

export default ProductActions
