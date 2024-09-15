import React from "react"
import { I18nProviderClient } from "../../../locales/client"
import { getCurrentLocale } from "../../../locales/server"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <I18nProviderClient locale={getCurrentLocale()}>
      <div>
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
      </div>
    </I18nProviderClient>
  )
}

export default Layout
