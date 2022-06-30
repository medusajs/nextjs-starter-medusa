import { Dialog, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import Hit from "@modules/search/components/hit"
import Hits from "@modules/search/components/hits"
import SearchBox from "@modules/search/components/search-box"
import { useRouter } from "next/router"
import { Fragment } from "react"
import { InstantSearch } from "react-instantsearch-hooks-web"

const SearchDropdown = () => {
  const { state, close, open } = useToggleState()
  const { asPath, push } = useRouter()

  return (
    <>
      <button onClick={open}>Search</button>

      <Transition.Root show={state} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-x-0 bottom-0 top-16 overflow-hidden z-[100]"
          onClose={close}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-700 bg-opacity-75 transition-opacity backdrop-blur-sm" />
            </Transition.Child>

            <div className="pointer-events-none fixed inset-x-0 flex max-w-full px-8 bg-white overflow-none max-h-[calc(100vh-64px)]">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="pointer-events-auto w-screen">
                  <InstantSearch
                    indexName={SEARCH_INDEX_NAME}
                    searchClient={searchClient}
                  >
                    <div className="py-4 w-full">
                      <SearchBox
                        placeholder="Type to search..."
                        className="w-full flex-1"
                      />
                    </div>
                    <Hits hitComponent={Hit} />
                  </InstantSearch>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default SearchDropdown
