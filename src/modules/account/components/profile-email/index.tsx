import { useAccount } from "@lib/context/account-context"
import { Customer } from "@medusajs/medusa"
import Input from "@modules/common/components/input"
import { useUpdateMe } from "medusa-react"
import React, { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import AccountInfo from "../account-info"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerEmailFormData = {
  email: string
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateCustomerEmailFormData>({
    defaultValues: {
      email: customer.email,
    },
  })

  const { refetchCustomer } = useAccount()

  const {
    mutate: update,
    isLoading,
    isSuccess,
    isError,
    reset: clearState,
  } = useUpdateMe()

  useEffect(() => {
    reset({
      email: customer.email,
    })
  }, [customer, reset])

  const email = useWatch({
    control,
    name: "email",
  })

  const updateEmail = (data: UpdateCustomerEmailFormData) => {
    return update(
      {
        id: customer.id,
        ...data,
      },
      {
        onSuccess: () => {
          refetchCustomer()
        },
        onError: () => {
          setErrorMessage("Email already in use")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(updateEmail)} className="w-full">
      <AccountInfo
        label="Email"
        currentInfo={`${customer.email}`}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Email"
            {...register("email", {
              required: true,
            })}
            defaultValue={email}
            errors={errors}
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
