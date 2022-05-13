import { medusaClient } from "@lib/config"
import { useAccount } from "@lib/context/account-context"
import { Cart } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import clsx from "clsx"
import { useCart, useUpdateCart } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type EmailFormValues = {
  email: string
}

type PasswordFormValues = {
  password: string
}

type EmailProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Email: React.FC<EmailProps> = ({ cart }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [optOut, setOptOut] = useState(false)
  const { setCart } = useCart()
  const { customer, retrievingCustomer, refetchCustomer } = useAccount()
  const { mutate: addEmail } = useUpdateCart(cart?.id!)

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    setError: setErrorPw,
    formState: { errors: errorsPw },
  } = useForm<PasswordFormValues>()

  const {
    register: registerEm,
    control: controlEm,
    handleSubmit: handleSubmitEm,
    setError: setErrorEm,
    formState: { errors: errorsEm },
  } = useForm<EmailFormValues>()

  useEffect(() => {
    if (customer && !cart.email) {
      addEmail(
        { email: customer.email, customer_id: customer.id },
        {
          onSuccess: ({ cart }) => setCart(cart),
        }
      )
    }
  }, [cart, customer, setCart, addEmail])

  useEffect(() => {
    const checkForUser = async (email: string) => {
      return await medusaClient.auth
        .exists(email)
        .then(() => true)
        .catch(() => false)
    }

    if (!customer && !retrievingCustomer && cart.email) {
      checkForUser(cart.email).then((exists) => {
        if (exists) {
          setShowLogin(true)
        } else {
          setShowLogin(false)
        }
      })
    }
  }, [cart, customer, retrievingCustomer])

  const submitEmail = handleSubmitEm((values: EmailFormValues) => {
    addEmail(values, {
      onSuccess: ({ cart }) => setCart(cart),
      onError: () => {
        setErrorEm(
          "email",
          {
            type: "validate",
            message: "An error occurred while adding email. Please try again.",
          },
          {
            shouldFocus: true,
          }
        )
      },
    })
  })

  const handleSignIn = handleSubmitPw(async (data) => {
    const { password } = data

    if (cart?.email) {
      await medusaClient.auth
        .authenticate({ email: cart.email, password })
        .then(refetchCustomer)
        .catch(() =>
          setErrorPw("password", {
            type: "validate",
            message: "The password you entered is incorrect",
          })
        )
    } else {
      setErrorEm("email", {
        type: "required",
        message: "Email is required",
      })
    }
  })

  return (
    <div className="p-10 bg-white">
      <h3 className="mb-6 text-xl-semi">Email</h3>
      <div className="flex items-center gap-x-4">
        <div className="w-full">
          <Input
            {...registerEm("email", {
              required: "Email is required",
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            label="Email"
            errors={errorsEm}
          />
        </div>
        <Button className="!min-h-0 max-w-[120px]" onClick={submitEmail}>
          {cart?.email ? "Update" : "Add"}
        </Button>
      </div>
      <div
        className={clsx(
          "py-4 flex flex-col gap-y-4 transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden max-h-0 opacity-0",
          {
            "max-h-[300px] opacity-100": !customer && showLogin && !optOut,
          }
        )}
      >
        <p className="text-small-regular text-gray-700">
          You already have an account. Sign in or{" "}
          <button className="underline" onClick={() => setOptOut(true)}>
            continue without logging in.
          </button>
        </p>
        <div className="flex items-end gap-x-4">
          <div className="w-full">
            <Input
              {...registerPw("password", {
                required: "Password is required",
              })}
              type="password"
              label="Password"
              errors={errorsPw}
            />
          </div>
          <Button className="!min-h-0 max-w-[120px]" onClick={handleSignIn}>
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Email
