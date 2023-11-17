import { CheckoutFormValues } from "@lib/context/checkout-context"
import ConnectForm from "@modules/common/components/connect-form"
import Input from "@modules/common/components/input"
import CountrySelect from "../country-select"

const BillingAddress = () => {
  return (
    <ConnectForm<CheckoutFormValues>>
      {({ register, formState: { errors, touchedFields } }) => (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            {...register("billing_address.first_name", {
              required: "First name is required",
            })}
            autoComplete="given-name"
            errors={errors}
            touched={touchedFields}
            required
          />
          <Input
            label="Last name"
            {...register("billing_address.last_name", {
              required: "Last name is required",
            })}
            autoComplete="family-name"
            errors={errors}
            touched={touchedFields}
            required
          />
          <Input
            label="Address"
            {...register("billing_address.address_1", {
              required: "Address is required",
            })}
            autoComplete="address-line1"
            errors={errors}
            touched={touchedFields}
            required
          />
          <Input
            label="Company"
            {...register("billing_address.company")}
            autoComplete="organization"
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="Postal code"
            {...register("billing_address.postal_code", {
              required: "Postal code is required",
            })}
            autoComplete="postal-code"
            errors={errors}
            touched={touchedFields}
            required
          />
          <Input
            label="City"
            {...register("billing_address.city", {
              required: "City is required",
            })}
            autoComplete="address-level2"
            errors={errors}
            touched={touchedFields}
            required
          />
          <CountrySelect
            {...register("billing_address.country_code", {
              required: "Country is required",
            })}
            autoComplete="country"
            errors={errors}
            touched={touchedFields}
            required
          />
          <Input
            label="State / Province"
            {...register("billing_address.province")}
            autoComplete="address-level1"
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="Phone"
            {...register("billing_address.phone")}
            autoComplete="tel"
            errors={errors}
            touched={touchedFields}
          />
        </div>
      )}
    </ConnectForm>
  )
}

export default BillingAddress
