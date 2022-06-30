import { useRegions } from "medusa-react"
import { useMemo } from "react"

type CountryOption = {
  country: string
  region: string
  label: string
}

const useCountryOptions = () => {
  const { regions } = useRegions()

  const options: CountryOption[] | undefined = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
  }, [regions])

  return options
}

export default useCountryOptions
