import { medusaClient } from "@lib/config"
import { Address, Cart, PaymentSession } from "@medusajs/medusa"
import { formatAmount, useCart, useCartShippingOptions, useSetPaymentSession } from "medusa-react"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

interface CheckoutContext {
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
  billingAddressEnabled: boolean
  shippingMethods: { label: string; value: string; price: string }[]
  initializeCheckout: (email: string) => Promise<void>
  setPaymentSession: (providerId: string) => Promise<void>
}

const CheckoutContext = createContext<CheckoutContext | null>(null)

interface CheckoutProviderProps {
  children?: React.ReactNode
}

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
  | "country_code"
>

type FormValues = {
  shipping_address: FormAddress
  billing_address: FormAddress
  email: string | null
  shipping_method: string | null
  country_code: string | null
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
      province: cart?.shipping_address?.province || null,
      company: cart?.billing_address?.company || null,
      postal_code: cart?.billing_address?.postal_code || null,
      phone: cart?.billing_address?.phone || null,
    },
    country_code: cart?.shipping_address?.country_code || null,
    shipping_method: cart?.shipping_methods?.[0]?.shipping_option.id || null,
    email: cart?.email || null,
  }
}

const IDEMPOTENCY_KEY = "create_payment_session_key"

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const {
    cart,
    setCart,
    addShippingMethod,
    updateCart,
  } = useCart()
  const [billingAddressEnabled, setBillingAddressEnabled] = useState(false)
  const selectedPaymentMethod = useState<PaymentSession | undefined>(undefined)
  const [existingAccount, setExistingAccount] = useState(false)
  const { mutate: setPaymentSessionMutation } = useSetPaymentSession(cart?.id!)

  const createPaymentSession = async (cartId: string) => {
    return medusaClient.carts
      .createPaymentSessions(cartId, {
        "Idempotency-Key": IDEMPOTENCY_KEY,
      })
      .then(({ cart }) => cart)
      .catch(() => null)
  }

  const checkForCustomerAccount = async (
    email: string
  ): Promise<Record<string, boolean>> => {
    return medusaClient.auth
      .exists(email)
      .then(({ exists }) => ({ email: exists }))
      .catch((_) => ({ email: false }))
  }

  const initializeCheckout = async (email: string) => {
    const hasAccount = await checkForCustomerAccount(email)

    if (hasAccount) {
      setExistingAccount(true)
    }

    await updateCart.mutateAsync(
      {
        email,
      },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
        },
        onError: (err) => {
          methods.setError("email", { message: err.message, type: "validate" })
        },
      }
    )
  }

  const setPaymentSession = async (providerId: string) => {
    if (cart) {
      setPaymentSessionMutation({
        provider_id: providerId,
      }, {
        onSuccess: ({ cart }) => {
          setCart(cart)
        },
      })
    }
  }

  const { shipping_options, isLoading, refetch } = useCartShippingOptions(
    cart?.id!,
    {
      enabled: !!cart?.id,
    }
  )

  const methods = useForm<FormValues>({
    defaultValues: mapCartToFormValues(cart),
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

  return (
    <FormProvider {...methods}>
      <CheckoutContext.Provider
        value={{
          cart,
          billingAddressEnabled,
          shippingMethods,
          initializeCheckout,
          setPaymentSession,
        }}
      >
        {children}
      </CheckoutContext.Provider>
    </FormProvider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  const form = useFormContext()
  if (context === null) {
    throw new Error(
      "useProductActionContext must be used within a ProductActionProvider"
    )
  }
  return { ...context, ...form }
}
