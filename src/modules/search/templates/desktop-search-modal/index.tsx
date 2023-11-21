import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import Modal from "@modules/common/components/modal"
import Search from "@modules/common/icons/search"
import { MagnifyingGlassMini } from "@medusajs/icons"
import DesktopHit from "@modules/search/components/desktop-hit"
import DesktopHits from "@modules/search/components/desktop-hits"
import SearchBox from "@modules/search/components/search-box"
import { InstantSearch } from "react-instantsearch-hooks-web"

type DesktopSearchModalProps = {
  state: boolean
  open: () => void
  close: () => void
}

const DesktopSearchModal = ({
  state,
  open,
  close,
}: DesktopSearchModalProps) => {
  return (
    <>
      <button onClick={open} className="flex items-center gap-x-2 h-full">
        Search
      </button>

      <Modal isOpen={state} close={close} size="large" search>
        <Modal.Body>
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div className="flex absolute flex-col h-fit">
              <div className="w-full flex items-center gap-x-2 p-4 bg-[rgba(3,7,18,0.5)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
                <MagnifyingGlassMini />
                <SearchBox close={close} />
              </div>

              <div className="flex-1 mt-6 min-h-full">
                <DesktopHits hitComponent={DesktopHit} close={close} />
              </div>
            </div>
          </InstantSearch>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DesktopSearchModal
