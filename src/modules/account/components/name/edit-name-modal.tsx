import { useAccount } from "@lib/context/account-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Customer } from "@medusajs/medusa"
import EditButton from "@modules/account/components/edit-button"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { useUpdateMe } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

type EditNameModalProps = {
  customer: Omit<Customer, "password_hash">
}

type FormValues = {
  first_name: string
  last_name: string
}

const EditNameModal: React.FC<EditNameModalProps> = ({ customer }) => {
  const { state, open, close } = useToggleState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { mutate } = useUpdateMe()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: customer.first_name,
      last_name: customer.last_name,
    },
  })

  const { refetchCustomer } = useAccount()

  const submit = handleSubmit((data) => {
    setSubmitting(true)

    mutate(
      { id: customer.id, ...data },
      {
        onSuccess: () => {
          setSubmitting(false)
          refetchCustomer()
          close()
        },
        onError: () => {
          setSubmitting(false)
          setError("Unable to update name, try again later.")
        },
      }
    )
  })

  return (
    <div>
      <EditButton onClick={open} />
      <Modal isOpen={state} close={close}>
        <Modal.Title>Edit your name</Modal.Title>
        <Modal.Body>
          <div className="flex flex-col gap-y-8">
            <Input
              label="First name"
              {...register("first_name", {
                required: "First name is required",
              })}
              errors={errors}
            />
            <Input
              label="Last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              errors={errors}
            />
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-gray-200 text-gray-900 py-2 px-4 uppercase text-base-semi"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="bg-gray-900 flex items-center gap-x-2 text-white py-2 px-4 uppercase text-base-semi disabled:bg-gray-400"
            onClick={submit}
            disabled={submitting}
          >
            Save
            {submitting && <Spinner />}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditNameModal
