"use client"

import { updateRegion } from "@lib/data/cart"
import { updateLocale } from "@lib/data/locale-actions"
import type { Locale } from "@lib/data/locales"
import type { HttpTypes } from "@medusajs/types"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { createPortal } from "react-dom"
import ReactCountryFlag from "react-country-flag"

type Props = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

type CountryOption = {
  iso2: string
  iso3: string
  label: string
}

export default function NavRegionSwitcher({
  regions,
  locales,
  currentLocale,
}: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [panelTop, setPanelTop] = useState(0)
  const [panelRight, setPanelRight] = useState(0)
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const countryCode = String(params?.countryCode ?? "")

  const countries = useMemo(() => {
    const all =
      regions?.flatMap((r) =>
        (r.countries ?? []).map((c) => ({
          iso2: (c.iso_2 ?? "").toLowerCase(),
          iso3: (c.iso_3 ?? "").toUpperCase(),
          label: c.display_name ?? c.name ?? (c.iso_2 ?? "").toUpperCase(),
        }))
      ) ?? []
    const unique = new Map<string, CountryOption>()
    all.forEach((c) => {
      if (c.iso2 && !unique.has(c.iso2)) unique.set(c.iso2, c)
    })
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    )
  }, [regions])

  const currentCountry = countries.find((c) => c.iso2 === countryCode)
  const currentLabel = currentCountry?.iso3 ?? countryCode.toUpperCase()
  const currentPath = pathname.replace(`/${countryCode}`, "") || ""

  const switchCountry = (iso2: string) => {
    startTransition(async () => {
      await updateRegion(iso2, currentPath)
    })
  }

  const switchLocale = (code: string) => {
    startTransition(async () => {
      await updateLocale(code)
      router.refresh()
      setOpen(false)
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPanelTop(rect.bottom + 8)
      setPanelRight(Math.max(window.innerWidth - rect.right, 12))
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, { passive: true })
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [open])

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-black group-data-[tone=overlay]/nav:text-qw-white"
        aria-expanded={open}
        aria-label="Select country and language"
      >
        <span className="inline-block origin-left scale-x-[0.9] text-[13px] font-light uppercase tracking-[0.06em]">
          {currentLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12.1699 6.75L8.16992 10.75L4.16992 6.75"
            stroke="currentColor"
            strokeWidth="0.75"
          />
        </svg>
      </button>

      {mounted && open
        ? createPortal(
            <>
              <button
                type="button"
                aria-label="Close country and language panel"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[115] cursor-default"
              />
              <div
                className="fixed z-[120] w-[260px] border border-qw-pale-grey bg-qw-white px-3 pb-3 pt-2.5 text-qw-charcoal shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
                style={{
                  top: panelTop,
                  right: panelRight,
                  maxHeight: "calc(100vh - 24px)",
                }}
              >
                <div className="mb-1.5 border-b border-qw-pale-grey pb-1.5">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-qw-grey">
                    Country / Region
                  </p>
                </div>
                <ul className="max-h-64 overflow-y-auto py-0.5">
                  {countries.map((c) => (
                    <li key={c.iso2}>
                      <button
                        type="button"
                        onClick={() => {
                          switchCountry(c.iso2)
                          setOpen(false)
                        }}
                        disabled={isPending}
                        className={`flex w-full items-center justify-between px-1.5 py-1 text-left transition-colors ${
                          c.iso2 === countryCode
                            ? "bg-qw-off-white"
                            : "hover:bg-qw-off-white"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={c.iso2.toUpperCase()}
                            svg
                            style={{ width: "0.9rem", height: "0.9rem" }}
                          />
                          <span className="text-[10px] uppercase tracking-[0.14em]">
                            {c.iso3 || c.iso2.toUpperCase()}
                          </span>
                        </span>
                        <span className="max-w-[120px] truncate text-[9px] uppercase tracking-[0.08em] text-qw-medium-grey">
                          {c.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {locales?.length ? (
                  <div className="mt-2 border-t border-qw-pale-grey pt-2">
                    <div className="mb-1 text-[9px] uppercase tracking-[0.16em] text-qw-grey">
                      Language
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {locales.map((l) => {
                        const active =
                          (currentLocale ?? "").toLowerCase() ===
                          l.code.toLowerCase()
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => switchLocale(l.code)}
                            disabled={isPending}
                            className={`text-[10px] uppercase tracking-[0.14em] ${
                              active
                                ? "text-qw-charcoal"
                                : "text-qw-medium-grey hover:text-qw-charcoal"
                            }`}
                          >
                            {l.code.slice(0, 2).toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </>,
            document.body
          )
        : null}
    </div>
  )
}
