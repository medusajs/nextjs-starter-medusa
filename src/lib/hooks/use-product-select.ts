import isEqual from "lodash/isEqual"
import React from "react"
import { Product } from "types/medusa"

export const useProductSelect = (
  product: Pick<Product, "options" | "variants">
) => {
  const [options, setOptions] = React.useState<Record<string, string>>({})
  const [quantity, setQuantity] = React.useState(1)
  const { variants } = product

  React.useEffect(() => {
    const optionObj: Record<string, string> = {}
    for (const option of product.options) {
      Object.assign(optionObj, { [option.id]: undefined })
    }
    setOptions(optionObj)
  }, [product])

  const variantMap = React.useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      const tmp: Record<string, string> = {}

      for (const option of variant.options) {
        tmp[option.option_id] = option.value
      }

      map[variant.id] = tmp
    }

    return map
  }, [variants])

  const variant = React.useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantMap)) {
      if (isEqual(variantMap[key], options)) {
        variantId = key
      }
    }

    return product.variants.find((v) => v.id === variantId)
  }, [options, variantMap, product.variants])

  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity - 1 > 0) {
      setQuantity(quantity - 1)
    }
  }

  const resetOptions = () => {
    const optionObj = {}
    for (const option of product.options) {
      Object.assign(optionObj, { [option.id]: undefined })
    }
    setOptions(optionObj)
    setQuantity(1)
  }

  return {
    variant,
    options,
    quantity,
    actions: {
      updateOptions,
      increaseQuantity,
      decreaseQuantity,
      resetOptions,
    },
  }
}
