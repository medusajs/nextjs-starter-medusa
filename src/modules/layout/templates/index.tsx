import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React from "react"

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Nav />
      <main className="min-h-[calc(100vh-64px)] relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
