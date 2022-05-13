import { medusaClient } from "@lib/config"
import { Address, Cart } from "@medusajs/medusa"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import {
  formatAmount,
  useCart,
  useCartShippingOptions,
  useSetPaymentSession,
} from "medusa-react"
import { useRouter } from "next/router"
import React, { createContext, useContext, useEffect, useMemo } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { useStore } from "./store-context"

type FormAddress = Omit<
  Address,
  | "id"
  | "country"
  | "created_at"
  | "updated_at"
  | "customer_id"
  | "country"
  | "customer"
  | "metadata"
  | "deleted_at"
>

type FormValues = {
  shipping_address: FormAddress
  billing_address: FormAddress
  email: string | null
  shipping_method: string | null
}

interface CheckoutContext {
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
  shippingMethods: { label: string; value: string; price: string }[]
  addShippingOption: (soId: string) => void
  setPaymentSession: (providerId: string) => Promise<void>
  onPaymentCompleted: () => void
}

const CheckoutContext = createContext<CheckoutContext | null>(null)

interface CheckoutProviderProps {
  children?: React.ReactNode
}

const mapCartToFormValues = (
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
): FormValues => {
  return {
    shipping_address: {
      first_name: cart?.shipping_address?.first_name || null,
      last_name: cart?.shipping_address?.last_name || null,
      address_1: cart?.shipping_address?.address_1 || null,
      address_2: cart?.shipping_address?.address_2 || null,
      city: cart?.shipping_address?.city || null,
      country_code: cart?.shipping_address?.country_code || null,
      province: cart?.shipping_address?.province || null,
      company: cart?.shipping_address?.company || null,
      postal_code: cart?.shipping_address?.postal_code || null,
      phone: cart?.shipping_address?.phone || null,
    },
    billing_address: {
      first_name: cart?.billing_address?.first_name || null,
      last_name: cart?.billing_address?.last_name || null,
      address_1: cart?.billing_address?.address_1 || null,
      address_2: cart?.billing_address?.address_2 || null,
      city: cart?.billing_address?.city || null,
      country_code: cart?.shipping_address?.country_code || null,
      province: cart?.shipping_address?.province || null,
      company: cart?.billing_address?.company || null,
      postal_code: cart?.billing_address?.postal_code || null,
      phone: cart?.billing_address?.phone || null,
    },
    shipping_method: cart?.shipping_methods?.[0]?.shipping_option.id || null,
    email: cart?.email || null,
  }
}

const IDEMPOTENCY_KEY = "create_payment_session_key"

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const { cart, setCart, addShippingMethod, completeCheckout } = useCart()
  const { mutate: setPaymentSessionMutation } = useSetPaymentSession(cart?.id!)
  const { resetCart } = useStore()

  const createPaymentSession = async (cartId: string) => {
    return medusaClient.carts
      .createPaymentSessions(cartId, {
        "Idempotency-Key": IDEMPOTENCY_KEY,
      })
      .then(({ cart }) => cart)
      .catch(() => null)
  }

  const setPaymentSession = async (providerId: string) => {
    if (cart) {
      setPaymentSessionMutation(
        {
          provider_id: providerId,
        },
        {
          onSuccess: ({ cart }) => {
            setCart(cart)
          },
        }
      )
    }
  }

  const { shipping_options, refetch } = useCartShippingOptions(cart?.id!, {
    enabled: !!cart?.id,
  })

  const methods = useForm<FormValues>({
    defaultValues: mapCartToFormValues(cart),
    reValidateMode: "onChange",
  })

  useEffect(() => {
    methods.reset(mapCartToFormValues(cart))
  }, [cart, methods])

  useEffect(() => {
    const refetchShipping = async () => {
      await refetch()
    }

    refetchShipping()
  }, [cart, refetch])

  const selectedShippingMethod = methods.watch("shipping_method")

  useEffect(() => {
    const validateMethod = () => {
      const methodIds = shipping_options?.map((method) => method.id)
      if (
        selectedShippingMethod &&
        !methodIds?.includes(selectedShippingMethod)
      ) {
        methods.setValue("shipping_method", null)
      }
    }

    const timeout = setTimeout(validateMethod, 500)

    return () => clearTimeout(timeout)
  }, [selectedShippingMethod, shipping_options, methods])

  const shippingMethods = useMemo(() => {
    if (shipping_options && cart?.region) {
      return shipping_options?.map((option) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({ amount: option.amount, region: cart.region }),
      }))
    }

    return []
  }, [shipping_options, cart])

  const addShippingOption = (soId: string) => {
    if (cart) {
      addShippingMethod.mutate(
        { option_id: soId },
        {
          onSuccess: ({ cart }) => setCart(cart),
        }
      )
    }
  }

  useEffect(() => {
    const initPayment = async () => {
      if (cart?.id && !cart.payment_sessions?.length && cart?.items?.length) {
        const paymentSession = await createPaymentSession(cart.id)

        if (!paymentSession) {
          setTimeout(initPayment, 500)
        } else {
          setCart(paymentSession)
          return
        }
      }
    }

    initPayment()
  }, [cart, setCart])

  const router = useRouter()

  const onPaymentCompleted = () => {
    completeCheckout.mutate(undefined, {
      onSuccess: ({ data }) => {
        resetCart()
        router.push(`/order/confirmed?id=${data.id}`)
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <CheckoutContext.Provider
        value={{
          cart,
          shippingMethods,
          addShippingOption,
          setPaymentSession,
          onPaymentCompleted,
        }}
      >
        <Wrapper paymentSession={cart?.payment_session}>{children}</Wrapper>
      </CheckoutContext.Provider>
    </FormProvider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  const form = useFormContext<FormValues>()
  if (context === null) {
    throw new Error(
      "useProductActionContext must be used within a ProductActionProvider"
    )
  }
  return { ...context, ...form }
}
