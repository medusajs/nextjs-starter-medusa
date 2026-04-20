"use client"

import { updateRegion } from "@lib/data/cart"
import { updateLocale } from "@lib/data/locale-actions"
import type { Locale } from "@lib/data/locales"
import type { HttpTypes } from "@medusajs/types"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { createPortal } from "react-dom"

type Props = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

type CountryOption = {
  iso2: string
  label: string
  currency: string
  currencySymbol: string
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  cad: "C$",
  eur: "\u20AC",
  gbp: "\u00A3",
  sek: "kr",
  dkk: "kr",
}

const COUNTRY_LOCALE_PREFERENCES: Record<string, string[]> = {
  us: ["en"],
  be: ["fr", "en"],
  ca: ["fr", "en"],
  fr: ["fr", "en"],
  de: ["de", "en"],
  es: ["es", "en"],
  it: ["it", "en"],
  gb: ["en"],
}

export default function FooterRegionLocale({
  regions,
  locales,
  currentLocale,
}: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const countryCode = String(params?.countryCode ?? "")

  const countries = useMemo(() => {
    const all =
      regions?.flatMap((region) =>
        (region.countries ?? []).map((country) => ({
          iso2: (country.iso_2 ?? "").toLowerCase(),
          label:
            country.display_name ?? country.name ?? (country.iso_2 ?? "").toUpperCase(),
          currency: (region.currency_code ?? "").toUpperCase(),
          currencySymbol: CURRENCY_SYMBOLS[(region.currency_code ?? "").toLowerCase()] ?? "$",
        }))
      ) ?? []

    const unique = new Map<string, CountryOption>()
    all.forEach((country) => {
      if (country.iso2 && !unique.has(country.iso2)) unique.set(country.iso2, country)
    })

    const priority = ["us", "be", "ca", "fr", "de", "it", "es", "gb"]
    return Array.from(unique.values()).sort((a, b) => {
      const ai = priority.indexOf(a.iso2)
      const bi = priority.indexOf(b.iso2)
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      }
      return a.label.localeCompare(b.label)
    })
  }, [regions])

  const activeCountry =
    countries.find((country) => country.iso2 === countryCode) ?? countries[0]
  const activeLocaleCode = (currentLocale ?? locales?.[0]?.code ?? "en").toLowerCase()

  const [pendingCountry, setPendingCountry] = useState(activeCountry?.iso2 ?? "")
  const [pendingLocale, setPendingLocale] = useState(activeLocaleCode)

  const currentPath = pathname.replace(`/${countryCode}`, "") || ""
  const splitIndex = Math.ceil(Math.max(countries.length, 8) / 2)
  const countryColumns = [countries.slice(0, splitIndex), countries.slice(splitIndex)]

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const localeCodeSet = new Set((locales ?? []).map((l) => l.code.toLowerCase()))

  const localeCodesForCountry = (iso2: string) => {
    const preferred = COUNTRY_LOCALE_PREFERENCES[iso2] ?? ["en"]
    const filtered = preferred.filter((code) => localeCodeSet.has(code))
    if (filtered.length) return filtered
    if (activeLocaleCode) return [activeLocaleCode]
    return ["en"]
  }

  const activeLocaleLabel =
    locales?.find((item) => item.code.toLowerCase() === activeLocaleCode)?.name ?? "English"

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPendingCountry(activeCountry?.iso2 ?? "")
          setPendingLocale(activeLocaleCode)
          setOpen(true)
        }}
        className="inline-flex items-center gap-1 text-caption text-qw-medium-grey"
        aria-label="Open country and language picker"
      >
        <span>
          {activeCountry?.label ?? countryCode.toUpperCase()} ({activeCountry?.currencySymbol ?? "$"}) /
          {" "}{activeLocaleLabel}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M9.2 4.6L6 7.8L2.8 4.6" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[140]">
              <button
                type="button"
                aria-label="Close country and language picker"
                className="absolute inset-0 bg-qw-black/20"
                onClick={() => setOpen(false)}
              />

              <div
                role="dialog"
                aria-modal="true"
                className="absolute left-1/2 top-1/2 w-[92vw] max-w-[690px] -translate-x-1/2 -translate-y-1/2 border border-qw-pale-grey bg-qw-white px-10 pb-8 pt-8 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 text-qw-medium-grey hover:text-qw-charcoal"
                  aria-label="Close dialog"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 3L13 13" stroke="currentColor" strokeWidth="0.75" />
                    <path d="M13 3L3 13" stroke="currentColor" strokeWidth="0.75" />
                  </svg>
                </button>

                <h3 className="mb-6 text-center text-[34px] font-light uppercase tracking-[0.01em] text-qw-charcoal">
                  PLEASE SELECT COUNTRY & LANGUAGE
                </h3>

                <div className="grid grid-cols-1 gap-x-10 gap-y-2 small:grid-cols-2">
                  {countryColumns.map((column, columnIndex) => (
                    <ul key={columnIndex} className="space-y-1.5">
                      {column.map((country) => {
                        const active = pendingCountry === country.iso2
                        const localeCodes = localeCodesForCountry(country.iso2)
                        return (
                          <li
                            key={country.iso2}
                            className="flex items-center justify-between gap-3"
                          >
                            <button
                              type="button"
                              onClick={() => setPendingCountry(country.iso2)}
                              className={`text-left text-caption uppercase tracking-[0.08em] ${
                                active
                                  ? "text-qw-charcoal"
                                  : "text-qw-medium-grey hover:text-qw-charcoal"
                              }`}
                            >
                              {country.label} ({country.currencySymbol})
                            </button>
                            <div className="inline-flex gap-2">
                              {localeCodes.map((localeCode) => {
                                const code = localeCode.slice(0, 2).toUpperCase()
                                const localeActive = pendingLocale === localeCode
                                return (
                                  <button
                                    key={`${country.iso2}-${localeCode}`}
                                    type="button"
                                    onClick={() => {
                                      setPendingCountry(country.iso2)
                                      setPendingLocale(localeCode)
                                    }}
                                    className={`text-caption ${
                                      localeActive ? "text-qw-charcoal" : "text-qw-grey hover:text-qw-charcoal"
                                    }`}
                                  >
                                    {code}
                                  </button>
                                )
                              })}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ))}
                </div>

                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          if (pendingLocale && pendingLocale !== activeLocaleCode) {
                            await updateLocale(pendingLocale)
                          }
                          if (pendingCountry && pendingCountry !== countryCode) {
                            await updateRegion(pendingCountry, currentPath)
                            return
                          }
                          if (pendingLocale && pendingLocale !== activeLocaleCode) {
                            router.refresh()
                          }
                        } finally {
                          setOpen(false)
                        }
                      })
                    }}
                    className="h-10 min-w-[210px] bg-qw-black px-8 text-[9px] uppercase tracking-[0.16em] text-qw-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? "SAVING..." : "CONFIRM"}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
