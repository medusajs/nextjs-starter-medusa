import { useStore } from "@lib/context/store-context"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { useCart, useRegions } from "medusa-react"
import React from "react"

const Layout: React.FC = ({ children }) => {
  const { regions } = useRegions()
  const { cart } = useCart()
  const { setRegion } = useStore()

  return (
    <div>
      <Nav />
      <main className="min-h-[calc(100vh-64px)] relative">{children}</main>
      <Footer
        regions={regions}
        currentRegion={cart?.region_id}
        setRegion={setRegion}
      />
    </div>
  )
}

export default Layout
