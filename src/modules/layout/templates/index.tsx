import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React from "react"

import { Inter } from "next/font/google"
import clsx from "clsx"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
  display: "swap",
})

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Nav />
      <main className={clsx("relative font-sans", inter.variable)}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
