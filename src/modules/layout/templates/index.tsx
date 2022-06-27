import { useStore } from "@lib/context/store-context"
import { getSiteData } from "@lib/data"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { useCart, useRegions } from "medusa-react"
import React from "react"
import { useQuery } from "react-query"

const Layout: React.FC = ({ children }) => {
  const { regions } = useRegions()
  const { cart } = useCart()
  const { setRegion } = useStore()

  const { data } = useQuery("global-data", getSiteData)

  return (
    <div>
      {/* <Banner /> */}
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
