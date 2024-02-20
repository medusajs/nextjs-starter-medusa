import FilterSelect from "@modules/common/components/filter-select"
import { useSearchParams } from "next/navigation"
import { QueryParam } from ".."
import { VehicleDTO } from "types/global"

type VehicleFilterProps = {
  vehicles: VehicleDTO[]
  setQueryParams: (param: QueryParam) => void
}

const VehicleFilter = ({ vehicles, setQueryParams }: VehicleFilterProps) => {
  const searchParams = useSearchParams()

  const selected = new Set(searchParams.get("vehicle_id")?.split(","))

  const handleChange = (checked: boolean, value: string) => {
    if (checked) {
      selected.add(value)
    } else {
      selected.delete(value)
    }

    const newParams = {
      name: "vehicle_id",
      value: Array.from(selected).join(","),
    }

    setQueryParams(newParams)
  }

  const items = vehicles.map((v) => ({
    value: v.id,
    label: `${v.brand} ${v.model} (${v.year})`,
  }))

  return (
    <FilterSelect
      title="Filter by vehicle"
      items={items}
      selected={selected}
      handleChange={handleChange}
    />
  )
}

export default VehicleFilter
