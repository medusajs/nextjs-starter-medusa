import Select, { SelectOption } from "@modules/common/components/select"
import { useCart, useRegion } from "medusa-react"
import { useEffect, useState } from "react"

type CountrySelectProps = {
  onChange: (value: unknown) => void
  value: unknown
}

const CountrySelect: React.FC<CountrySelectProps> = ({ onChange, value }) => {
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
    />
  )
}

export default CountrySelect
