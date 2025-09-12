"use client"

import React from "react"
import { usePathname, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"

type TabItem = {
  key: string
  label: string
  href: string
  badge?: number
}

export default function AccountTabs({ items }: { items: TabItem[] }) {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const currentPath = React.useMemo(() => {
    const afterCountry = pathname.split(`/${countryCode}`)[1] || '/'
    const cleaned = afterCountry.split('?')[0].split('#')[0]
    return cleaned.endsWith('/') && cleaned !== '/' ? cleaned.slice(0, -1) : cleaned
  }, [pathname, countryCode])

  React.useLayoutEffect(() => {
    const el = listRef.current?.querySelector('[aria-selected="true"]') as HTMLElement | null
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' })
  }, [currentPath])

  return (
    <div className="sticky top-[var(--header-height)] z-40 bg-white/95 backdrop-blur border-b">
      <div className="content-container">
        <div className="flex items-center justify-between">
          <div ref={listRef} role="tablist" aria-label="Account navigation" className="flex gap-1.5 md:gap-3 overflow-x-auto no-scrollbar px-2 md:px-0 h-12 items-center flex-1">
            {items.map((item) => {
              const target = item.href.endsWith('/') && item.href !== '/' ? item.href.slice(0, -1) : item.href
              const active = currentPath === target
              return (
                <LocalizedClientLink
                  key={item.key}
                  href={item.href}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  className={`relative h-11 px-3 md:px-4 ty-body rounded-md transition-colors ${active ? 'text-[var(--nav-icon-active)]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="nav-badge static translate-y-[-2px]">{item.badge}</span>
                    )}
                  </span>
                  <span className={`absolute left-2 right-2 -bottom-px h-0.5 rounded-full transition-all ${active ? 'bg-[var(--nav-icon-active)]' : 'bg-transparent'}`} />
                </LocalizedClientLink>
              )
            })}
          </div>
          <button
            className="ml-2 ty-body text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={async () => { await signout(countryCode) }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}


