"use client"

import { Fragment, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { CircleCheckIcon, LoaderCircleIcon } from "lucide-react"

import { setShippingMethod } from "@/utils/data/cart"
import { calculatePriceForShippingOption } from "@/utils/data/fulfillment"
import { convertToLocale } from "@/utils/helpers/math"
import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/primitives/separator"
import { ErrorMessage } from "@/components/ui/forms/error-message"
import { Button } from "@/components/ui/primitives/button"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/primitives/radio-group"
import { Label } from "@/components/ui/primitives/label"

import type { HttpTypes } from "@medusajs/types"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type Props = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: any[]
}

function formatAddress(address: any | null) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

function Shipping({ cart, availableShippingMethods }: Props) {
  const t = useTranslations("features.checkout.shipping")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn(
            "flex text-xl lg:text-2xl font-medium gap-x-2 items-center",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          2. {t("summary.title")}
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CircleCheckIcon className="size-5 mt-0.5" />
          )}
        </h2>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <p>
              <Button
                onClick={handleEdit}
                variant="secondary"
                data-testid="edit-delivery-button"
              >
                {t("button.edit")}
              </Button>
            </p>
          )}
      </div>
      {isOpen ? (
        <Fragment>
          <div className="grid">
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {t("label.shipping_method")}
              </span>
              <span className="mb-4 text-muted-foreground font-medium">
                {t("label.sub_shipping_method")}
              </span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onValueChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between text-sm cursor-pointer py-4 border rounded-rounded px-8 mb-2",
                        {
                          "border-primary":
                            showPickupOptions === PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <RadioGroupItem
                          value={PICKUP_OPTION_ON}
                          id={PICKUP_OPTION_ON}
                          data-testid="delivery-option-radio"
                        />
                        <Label htmlFor={PICKUP_OPTION_ON} className="text-base">
                          {t("label.pick_up")}
                        </Label>
                      </div>
                      <span className="justify-self-end text-foreground">
                        -
                      </span>
                    </div>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId || ""}
                  onValueChange={(v) => handleSetShippingMethod(v, "shipping")}
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center justify-between text-sm cursor-pointer py-4 border rounded-rounded px-8 mb-2",
                          {
                            "border-primary": option.id === shippingMethodId,
                            "hover:shadow-brders-none cursor-not-allowed":
                              isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <RadioGroupItem
                            disabled={isDisabled}
                            value={option.id}
                            id={option.id}
                            data-testid="delivery-option-radio"
                          />
                          <Label htmlFor={option.id} className="text-base">
                            {option.name}
                          </Label>
                        </div>
                        <span className="justify-self-end text-foreground">
                          {option.price_type === "flat" ? (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id],
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <LoaderCircleIcon className="animate-spin" />
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {t("label.store")}
                </span>
                <span className="mb-4 text-muted-foreground font-medium">
                  {t("label.sub_store")}
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId || ""}
                    onValueChange={(v) => handleSetShippingMethod(v, "pickup")}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center justify-between text-sm cursor-pointer py-4 border rounded-rounded px-8 mb-2",
                            {
                              "border-primary": option.id === shippingMethodId,
                              "hover:shadow-brders-none cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <RadioGroupItem
                              disabled={option.insufficient_inventory}
                              value={option.id}
                              id={option.id}
                              data-testid="delivery-option-radio"
                            />
                            <Label
                              htmlFor={option.id}
                              className="flex flex-col"
                            >
                              <span className="text-base">{option.name}</span>
                              <span className="text-base text-muted-foreground">
                                {formatAddress(
                                  option.service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </span>
                            </Label>
                          </div>
                          <span className="justify-self-end text-foreground">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="lg"
              className="mt"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              {t("button.continue")}
            </Button>
          </div>
        </Fragment>
      ) : (
        <div>
          <div className="text-sm">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <p className="font-medium text-foreground mb-1">
                  {t("label.method")}
                </p>
                <p className="font-medium text-foreground">
                  {cart.shipping_methods?.at(-1)?.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods?.at(-1)?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Separator className="mt-8" />
    </div>
  )
}

export { Shipping }
export type { Props as ShippingProps }
