import { currencies } from "@lib/util/currencies"
import { Region } from "types/medusa"

export const getRegionOptions = (regions: Region[]) => {
    const newOptions = []

    for (const region of regions) {
      const nativeSymbol =
        currencies[region.currency_code.toUpperCase()].symbol_native

      newOptions.push({
        label: `${
          region.name
        } | ${nativeSymbol}`,
        value: region.id,
      })
    }

    return newOptions
}