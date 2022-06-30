import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { useRegions } from "medusa-react"
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

const CountrySelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Country", ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    const { regions } = useRegions()

    const countryOptions = useMemo(() => {
      return (
        regions
          ?.map((region) => {
            return region.countries.map((country) => ({
              value: country.iso_2,
              label: country.display_name,
            }))
          })
          .flat() || []
      )
    }, [regions])

    return (
      <NativeSelect ref={innerRef} placeholder={placeholder} {...props}>
        {countryOptions.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </NativeSelect>
    )
  }
)

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
