"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { ChevronDownIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { isSimpleProduct } from "@/lib/type-guard"
import { getProductPrice } from "@/utils/helpers/math"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/primitives/drawer"
import { Button } from "@/components/ui/primitives/button"
import { Container } from "@/components/ui/react/design-system"
import { OptionSelect } from "@/components/features/product-detail/product-actions/option-select"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

function SmartBar({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}: Props) {
  const t = useTranslations("features.product_detail.product_actions.smart_bar")

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-background flex flex-col gap-y-3 justify-center items-center text-lg p-4 fixed bottom-0 z-50 left-0 h-fit w-full border-t"
          data-testid="mobile-actions"
        >
          <div className="flex items-center gap-x-2">
            <span data-testid="mobile-title">{product.title}</span>
            <span>—</span>
            {selectedPrice ? (
              <div className="flex items-end gap-x-2 text-foreground">
                {selectedPrice.price_type === "sale" && (
                  <p>
                    <span className="line-through text-sm">
                      {selectedPrice.original_price}
                    </span>
                  </p>
                )}
                <span
                  className={cn({
                    "text-primary": selectedPrice.price_type === "sale",
                  })}
                >
                  {selectedPrice.calculated_price}
                </span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div
            className={cn("grid grid-cols-2 w-full gap-x-4", {
              "!grid-cols-1": isSimple,
            })}
          >
            {!isSimple && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full"
                    data-testid="mobile-actions-button"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {variant
                          ? Object.values(options).join(" / ")
                          : "Select Options"}
                      </span>
                      <ChevronDownIcon />
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="border-b">
                    <DrawerTitle>{product.title}</DrawerTitle>
                  </DrawerHeader>
                  <Container className="my-6">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Container>
                </DrawerContent>
              </Drawer>
            )}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant}
              className="w-full"
              isLoading={isAdding}
              data-testid="mobile-cart-button"
            >
              {!variant
                ? t("button.select_variant")
                : !inStock
                  ? t("button.out_of_stock")
                  : t("button.add_cart")}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { SmartBar }
export type { Props as MobileActionsProps }
