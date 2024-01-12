"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"
import { MagnifyingGlassMini } from "@medusajs/icons"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import Hit from "@modules/search/components/hit"
import Hits from "@modules/search/components/hits"
import SearchBox from "@modules/search/components/search-box"
import { useEffect, useRef } from "react"

export default function SearchModal() {
  const router = useRouter()
  const searchRef = useRef(null)

  // close modal on outside click
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target === searchRef.current) {
      router.back()
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick)
    // cleanup
    return () => {
      window.removeEventListener("click", handleOutsideClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // disable scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // on escape key press, close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)

    // cleanup
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative z-[75]">
      <div className="fixed inset-0 bg-opacity-75 backdrop-blur-md opacity-100 h-screen w-screen" />
      <div className="fixed inset-0 px-5 sm:p-0" ref={searchRef}>
        <div className="flex flex-col justify-start w-full h-fit transform p-5 items-center text-left align-middle transition-all max-h-[75vh] bg-transparent shadow-none">
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div className="flex absolute flex-col h-fit w-full sm:w-fit">
              <div className="w-full flex items-center gap-x-2 p-4 bg-[rgba(3,7,18,0.5)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
                <MagnifyingGlassMini />
                <SearchBox />
              </div>
              <div className="flex-1 mt-6">
                <Hits hitComponent={Hit} />
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}
