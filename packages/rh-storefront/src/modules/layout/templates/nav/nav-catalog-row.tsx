"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NAV_LINKS, NavCatalogSecondaryItem } from "@/lib/data/nav-data"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const toCatalog = (item: (typeof NAV_LINKS)[number]): NavCatalogSecondaryItem[] => {
  if (item.catalog?.length) return item.catalog
  if (!item.children?.length) return []
  return item.children.map((c) => ({
    label: c.label,
    slug: c.slug,
    href: c.href,
    tertiary: [{ label: c.label, href: c.href }],
  }))
}

/** True when the secondary row should open a third column (not the children→single synthetic tertiary case). */
const hasExpandableTertiary = (s: NavCatalogSecondaryItem): boolean => {
  const t = s.tertiary
  if (!t || t.length === 0) return false
  if (t.length === 1) {
    const one = t[0]
    return one.href !== s.href || one.label !== s.label
  }
  return true
}

const tertiaryClassName =
  "capitalize text-[11px] leading-[16px] tracking-[0.04em] text-black underline-offset-[4px] transition-colors duration-700 hover:underline"

export default function NavCatalogRow() {
  const pathname = usePathname()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [activeSecondarySlug, setActiveSecondarySlug] = useState<string | null>(null)
  const [panelLeft, setPanelLeft] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const closeMenu = useCallback(() => {
    setOpenSlug(null)
    setActiveSecondarySlug(null)
  }, [])

  const activeTop = useMemo(
    () => NAV_LINKS.find((i) => i.slug === openSlug),
    [openSlug]
  )
  const catalog = useMemo(() => (activeTop ? toCatalog(activeTop) : []), [activeTop])
  const activeSecondary = catalog.find((s) => s.slug === activeSecondarySlug)

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nav-catalog-open", { detail: { open: Boolean(openSlug) } })
    )
  }, [openSlug])

  useEffect(() => {
    if (!openSlug) return
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        closeMenu()
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }
    window.addEventListener("mousedown", onPointerDown)
    window.addEventListener("keydown", onEsc)
    return () => {
      window.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("keydown", onEsc)
    }
  }, [openSlug, closeMenu])

  useEffect(() => {
    if (!openSlug) return

    const updatePanelPosition = () => {
      const wrapperRect = wrapperRef.current?.getBoundingClientRect()
      const trigger = triggerRefs.current[openSlug]
      if (!wrapperRect || !trigger) return

      const triggerRect = trigger.getBoundingClientRect()
      const panelWidth = 516
      let left = triggerRect.left - wrapperRect.left

      if (left + panelWidth > wrapperRect.width) {
        left = triggerRect.right - wrapperRect.left - panelWidth
      }

      setPanelLeft(Math.max(0, left))
    }

    updatePanelPosition()
    window.addEventListener("resize", updatePanelPosition)
    window.addEventListener("scroll", updatePanelPosition, { passive: true })
    return () => {
      window.removeEventListener("resize", updatePanelPosition)
      window.removeEventListener("scroll", updatePanelPosition)
    }
  }, [openSlug])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <ul className="flex flex-nowrap justify-between p-0 my-0 w-full" role="menubar" aria-label="Main">
        {NAV_LINKS.map((item) => {
          const baseText =
            "inline-block origin-left scale-x-[0.9] uppercase h-[18px] font-light leading-[1.75rem] tracking-[0.06em] md:text-[14px] lg:text-base"
          const color =
            item.intent === "sale"
              ? "text-[#CA2022]"
              : "text-black group-data-[tone=overlay]/nav:text-qw-white"
          const common =
            "mt-0 flex pt-0 no-underline underline-offset-[5px] hover:underline"

          if (item.external) {
            return (
              <li key={item.slug} role="none" className={common}>
                <a href={item.href} target="_blank" rel="noreferrer" role="link" className="flex items-end">
                  <span className={`${baseText} ${color}`}>{item.label}</span>
                </a>
              </li>
            )
          }

          const hasCatalog = toCatalog(item).length > 0
          return (
            <li key={item.slug} role="none" className={common}>
              {hasCatalog ? (
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={openSlug === item.slug}
                  ref={(el) => {
                    triggerRefs.current[item.slug] = el
                  }}
                  className="flex items-end"
                  onClick={() => {
                    const next = openSlug === item.slug ? null : item.slug
                    setOpenSlug(next)
                    setActiveSecondarySlug(null)
                  }}
                >
                  <span className={`${baseText} ${color}`}>{item.label}</span>
                </button>
              ) : (
                <LocalizedClientLink href={item.href} role="menuitem" className="flex items-end" onClick={closeMenu}>
                  <span className={`${baseText} ${color}`}>{item.label}</span>
                </LocalizedClientLink>
              )}
            </li>
          )
        })}
      </ul>

      {activeTop && catalog.length > 0 ? (
        <div
          role="dialog"
          aria-label={activeTop.label}
          className="absolute top-full mt-[3px] z-[1100] w-[516px] bg-[#f9f7f4] p-10 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
          style={{ left: panelLeft }}
        >
          <div className="grid grid-cols-2">
            <div className="pr-10 border-r border-[#e1e1e1]">
              <ul role="menu" aria-label={activeTop.label} className="w-[178px]">
                {catalog.map((secondary) => {
                  const expandable = hasExpandableTertiary(secondary)
                  const isActive = activeSecondarySlug === secondary.slug

                  if (!expandable) {
                    return (
                      <li key={secondary.slug} role="none" className="mb-4 !p-0">
                        <LocalizedClientLink
                          href={secondary.href}
                          role="menuitem"
                          onClick={closeMenu}
                          className={`block text-left capitalize text-[11px] leading-[16px] tracking-[0.04em] underline-offset-[4px] transition-colors duration-700 hover:underline ${
                            secondary.sale ? "text-[#CA2022]" : "text-black"
                          }`}
                        >
                          {secondary.label}
                        </LocalizedClientLink>
                      </li>
                    )
                  }

                  return (
                    <li key={secondary.slug} role="none" className="mb-4 !p-0">
                      <button
                        type="button"
                        role="menuitem"
                        aria-expanded={isActive}
                        onClick={() => setActiveSecondarySlug(secondary.slug)}
                        className={`capitalize text-[11px] leading-[16px] tracking-[0.04em] underline-offset-[4px] transition-colors duration-700 hover:underline ${
                          secondary.sale
                            ? "text-[#CA2022]"
                            : isActive
                              ? "text-black underline"
                              : "text-black"
                        }`}
                      >
                        {secondary.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="pl-10">
              {activeSecondary && hasExpandableTertiary(activeSecondary) ? (
                <ul role="menu" aria-label={activeSecondary.label} className="w-[178px]">
                  {(activeSecondary.tertiary ?? []).map((third) => (
                    <li key={`${third.label}-${third.href}`} role="none" className="mb-4 !p-0">
                      <LocalizedClientLink
                        href={third.href}
                        role="menuitem"
                        className={tertiaryClassName}
                        onClick={closeMenu}
                      >
                        {third.label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="w-[178px]" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
