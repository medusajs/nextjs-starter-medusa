"use client"

import { useParams, usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const countryCode = String(params?.countryCode ?? "")
  const isHome = pathname === `/${countryCode}` || pathname === `/${countryCode}/`
  const isPhase5 =
    pathname.includes("/checkout") || pathname.includes("/cart")

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome])

  useEffect(() => {
    const onCatalog = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail
      setCatalogOpen(Boolean(detail?.open))
    }
    window.addEventListener("nav-catalog-open", onCatalog as EventListener)
    return () =>
      window.removeEventListener("nav-catalog-open", onCatalog as EventListener)
  }, [])

  const tone = useMemo(() => {
    if (isPhase5) return "solid"
    if (!isHome) return "solid"
    return isScrolled || isHovering || catalogOpen ? "solid" : "overlay"
  }, [isHome, isScrolled, isHovering, isPhase5, catalogOpen])

  return (
    <div
      className={`inset-x-0 top-0 z-50 group/nav overflow-visible ${
        isHome ? "fixed" : "relative"
      }`}
      data-tone={tone}
      data-home={isHome ? "true" : "false"}
      data-phase5={isPhase5 ? "true" : "false"}
      onMouseEnter={() => !isPhase5 && !isScrolled && setIsHovering(true)}
      onMouseLeave={() => !isPhase5 && setIsHovering(false)}
      suppressHydrationWarning
    >
      {children}
    </div>
  )
}
