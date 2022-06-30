import { useMobileMenu } from "@lib/context/mobile-menu-context"
import useCountryOptions from "@lib/hooks/use-country-options"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import ReactCountryFlag from "react-country-flag"

const CountryMenu = () => {
  const {
    control: { close },
    screen: [_, setScreen],
  } = useMobileMenu()

  const countryOptions = useCountryOptions()

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
        <div className="flex-1 basis-0">
          <button
            className="flex items-center gap-x-2"
            onClick={() => setScreen("main")}
          >
            <ChevronDown className="rotate-90 text-gray-700" size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-large-regular">Shipping To</h1>
        </div>
        <div className="flex-1 basis-0 flex justify-end">
          <button onClick={close}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div>
        <ul className="py-4">
          {countryOptions?.map((option) => (
            <li key={option.country}>
              <button className="px-8 py-4 flex items-center justify-between w-full border-b border-gray-200">
                <div className="flex items-center gap-x-4">
                  <ReactCountryFlag svg countryCode={option.country} />
                  <span className="text-base-regular">{option.label}</span>
                </div>
                <ChevronDown size={16} className="-rotate-90" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CountryMenu
