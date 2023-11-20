import useToggleState from "@lib/hooks/use-toggle-state"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import { Kbd } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import Search from "@modules/common/icons/search"
import DesktopHit from "@modules/search/components/desktop-hit"
import DesktopHits from "@modules/search/components/desktop-hits"
import SearchBox from "@modules/search/components/search-box"
import ShowAll from "@modules/search/components/show-all"
import { InstantSearch, useHits } from "react-instantsearch-hooks-web"

const DesktopSearchModal = () => {
  const { state, close, open } = useToggleState()

  return (
    <>
      <button onClick={open} className="flex items-center gap-x-2 h-full">
        Search
        {/* <Kbd>⌘ + K</Kbd> */}
      </button>

      <Modal isOpen={state} close={close} size="large" transparent={true}>
        <Modal.Body>
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div className="flex absolute flex-col h-fit">
              <div className="w-full flex items-center gap-x-2 p-4 bg-[rgba(3,7,18,0.5)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
                <Search />
                <SearchBox />
              </div>

              <div className="flex-1 no-scrollbar mt-6 overflow-scroll min-h-full">
                <DesktopHits hitComponent={DesktopHit} />
              </div>
            </div>
          </InstantSearch>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DesktopSearchModal
