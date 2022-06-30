import { Dialog } from "@headlessui/react"
import { useMobileMenu } from "@lib/context/mobile-menu-context"

type ContainerProps = {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  const {
    control: { state, close },
  } = useMobileMenu()
  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex z-50"
      open={state}
      onClose={close}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-left flex max-w-full">
          <div className="relative w-screen pointer-events-auto bg-white text-gray-900 flex flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default Container
