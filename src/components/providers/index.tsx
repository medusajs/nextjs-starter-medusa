import { Toaster } from "@/components/ui/primitives/sonner"
import { Fragment } from "react"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <Toaster />
      {children}
    </Fragment>
  )
}

export { Providers }
