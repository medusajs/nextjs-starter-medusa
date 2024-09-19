import SearchModal from "@modules/search/templates/search-modal"
import { setStaticParams, getCurrentLocale } from "locales/server"

type Props = {
  params: { countryCode: string; }
}

export default function SearchModalRoute({ params }: Props) {
  setStaticParams(params.countryCode)
  return <SearchModal />
}
