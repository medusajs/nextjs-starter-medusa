"use client"

import { Fragment, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { updateRegion } from "@/utils/data/cart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/primitives/alert-dialog"

import type { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string | undefined
  region: string
  label: string | undefined
}

function CountrySelect({ regions }: { regions: HttpTypes.StoreRegion[] }) {
  const t = useTranslations("features.account.selects.country_select.dialog")
  const { countryCode } = useParams()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentOption, setCurrentOption] = useState<CountryOption>()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  const handleOpen = (country: string) => {
    setOpen(true)
    const o = options.find((o) => o?.country === country)
    if (o) {
      setCurrentOption(o)
    }
  }

  const handleChange = async (country: string) => {
    setIsLoading(true)
    await updateRegion(country, currentPath)
    setOpen(false)
    setIsLoading(false)
  }

  return (
    <Fragment>
      <Select value={countryCode as string} onValueChange={handleOpen}>
        <SelectTrigger size="lg" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) =>
            o ? (
              <SelectItem
                value={o.country || ""}
                key={`${o.region}-${o.country}`}
              >
                <ReactCountryFlag
                  svg
                  className="w-5 h-5"
                  countryCode={o?.country ?? ""}
                />
                {o.label}
              </SelectItem>
            ) : null
          )}
        </SelectContent>
      </Select>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("title", { country: currentOption?.label || "" })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              {t("cancel_button")}
            </AlertDialogCancel>
            <AlertDialogAction
              isLoading={isLoading}
              onClick={() => handleChange(currentOption?.country || "")}
            >
              {t("switch_button", { country: currentOption?.label || "" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  )
}

export { CountrySelect }
