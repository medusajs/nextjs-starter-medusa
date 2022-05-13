import React, { useState } from "react"
import { useForm, useWatch } from "react-hook-form"

type FormValues = {
  details: {
    email?: string
    name?: string
    phone?: string
  }
}

const Details = () => {
  const { register, control, handleSubmit } = useForm<FormValues>()
  const [errorMessage, setErrorMessage] =
    useState<string | undefined>(undefined)

  const info = useWatch({
    control,
    name: "details",
  })

  const onValid = (data) => console.log(data)
  const onError = () => setErrorMessage("Please fill in all required fields")

  const submit = handleSubmit(onValid, onError)

  //   const handleBlur = () => {
  //     const requiredFields = ["email", "name"]

  //     const isAddressValid = Object.entries(info)
  //       .filter(([key, _]) => requiredFields.includes(key))
  //       .every(([_, value]) => value)

  //     console.log(isAddressValid)

  //     if (isAddressValid) {
  //       submit()
  //     } else {
  //       console.log("invalid")
  //     }
  //   }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <form className="p-10 bg-gray-200 flex flex-col gap-y-4" onBlur={submit}>
        <input
          {...register("details.email", {
            required: "Email is required",
          })}
        />
        <input
          {...register("details.name", {
            required: "Name is required",
          })}
        />
        <input {...register("details.phone")} />
      </form>
      <span>{errorMessage}</span>
    </div>
  )
}

export default Details
