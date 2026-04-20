"use client"

import { XMark } from "@medusajs/icons"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function NavSearchInline() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const params = useParams()
  const router = useRouter()
  const countryCode = String(params?.countryCode ?? "")
  const closeSearch = () => {
    setOpen(false)
    setQuery("")
  }

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="hidden small:flex items-center">
      <button
        type="button"
        aria-label="Search"
        onClick={() => {
          if (!open) {
            setQuery("")
            setOpen(true)
            return
          }
          inputRef.current?.focus()
        }}
        className="inline-flex items-center justify-center h-6 w-6 leading-none text-black group-data-[tone=overlay]/nav:text-qw-white"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle
            cx="11.5004"
            cy="9.87932"
            r="7.1762"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          <line
            x1="16.5699"
            y1="15.1098"
            x2="21.917"
            y2="20.457"
            stroke="currentColor"
            strokeWidth="0.75"
          />
        </svg>
      </button>

      {open ? (
        <div className="ml-1">
          <form
            className="flex items-center border-b border-current/30"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              if (!q) return
              router.push(`/${countryCode}/store?q=${encodeURIComponent(q)}`)
              closeSearch()
            }}
          >
            <input
              ref={inputRef}
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-44 bg-transparent px-1 py-1 text-caption tracking-[0.06em] text-current placeholder:text-current/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="inline-flex items-center justify-center"
            >
              <XMark className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
