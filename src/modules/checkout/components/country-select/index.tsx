import Select, { SelectOption } from "@modules/common/components/select"
import { useCart, useRegion } from "medusa-react"
import { useEffect, useState } from "react"

type CountrySelectProps = {
  onChange: (value: unknown) => void
  value: unknown
  errors: Record<string, unknown>
  required?: boolean
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onChange,
  value,
  errors,
  required,
}) => {
  const [options, setOptions] = useState<SelectOption[]>([])
  const { cart } = useCart()
  const { region } = useRegion(cart?.region_id!, {
    enabled: !!cart?.region_id,
  })

  useEffect(() => {
    if (region) {
      setOptions(
        region.countries.map((country) => ({
          value: country.iso_2,
          label: country.display_name,
        }))
      )
    }
  }, [region])

  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      placeholder="Country"
      className="border-x-0 border-t-0 px-0"
      errors={errors}
      required={required}
    />
  )
}

export default CountrySelect
