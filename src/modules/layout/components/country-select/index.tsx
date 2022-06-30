import { Listbox, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useRegions } from "medusa-react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

type CountryOption = {
  country: string
  region: string
  label: string
}

const CountrySelect = () => {
  const { regions } = useRegions()
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)
  const { state, open, close } = useToggleState()

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

  useEffect(() => {
    setCurrent(options?.[0])
  }, [options])

  const handleChange = (option: CountryOption) => {
    setCurrent(option)
    close()
  }

  return (
    <div onMouseEnter={open} onMouseLeave={close}>
      <Listbox onChange={handleChange} value={options ? options[0] : undefined}>
        <Listbox.Button className="py-1 w-full">
          <div className="text-small-regular flex items-center gap-x-2">
            <span>Shipping to:</span>
            {current && (
              <span className="text-small-semi flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country}
                />
                {current.label}
              </span>
            )}
          </div>
        </Listbox.Button>
        <div className="relative w-full">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute top-0 left-0 z-[900] bg-gray-100 text-small-regular uppercase text-black"
              static
            >
              {options?.map((o) => {
                return (
                  <Listbox.Option
                    key={o.country}
                    value={o}
                    className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.country}
                    />{" "}
                    {o.label}
                  </Listbox.Option>
                )
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
