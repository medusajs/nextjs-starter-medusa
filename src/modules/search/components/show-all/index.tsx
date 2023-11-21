import { useModal } from "@lib/context/modal-context"
import { Container, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import { useHits, useSearchBox } from "react-instantsearch-hooks-web"

const ShowAll = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()
  const { close } = useModal()

  if (query === "") return null
  if (hits.length > 0 && hits.length <= 6) return null

  if (hits.length === 0) {
    return (
      <Container className="flex gap-2 justify-center h-fit py-2">
        <Text>No results found.</Text>
      </Container>
    )
  }

  return (
    <Container className="flex gap-2 justify-center h-fit py-2">
      <Text>Showing the first 6 results.</Text>
      <InteractiveLink href={`/search/${query}`} onClick={close}>
        View all
      </InteractiveLink>
    </Container>
  )
}

export default ShowAll
