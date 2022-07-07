import { useModal } from "@lib/context/modal-context"
import Hit, { HitProps } from "@modules/search/components/hit"
import { useRouter } from "next/router"

const DesktopHit = ({ hit }: HitProps) => {
  const { close } = useModal()
  const { push } = useRouter()

  const go = () => {
    push(`/products/${hit.handle}`)
    close()
  }

  return (
    <button className="w-full text-left" onClick={go}>
      <Hit hit={hit} />
    </button>
  )
}

export default DesktopHit
