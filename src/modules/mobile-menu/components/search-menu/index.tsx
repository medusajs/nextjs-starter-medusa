import { useMobileMenu } from "@lib/context/mobile-menu-context"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import Search from "@modules/common/icons/search"
import MobileHit from "@modules/search/components/mobile-hit"
import MobileHits from "@modules/search/components/mobile-hits"
import SearchBox from "@modules/search/components/search-box"
import { InstantSearch } from "react-instantsearch-hooks-web"

const SearchMenu = () => {
  const {
    screen: [_, setScreen],
  } = useMobileMenu()

  return (
    <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
          <div className="flex-1 basis-0">
            <div className="flex items-center gap-x-2">
              <Search className="text-gray-500" size={20} />
              <SearchBox />
            </div>
          </div>
          <div className="flex justify-end ml-4">
            <button
              onClick={() => setScreen("main")}
              className="text-small-semi uppercase"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="py-4 px-8">
          <MobileHits hitComponent={MobileHit} />
        </div>
      </div>
    </InstantSearch>
  )
}

export default SearchMenu
