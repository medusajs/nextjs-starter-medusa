import Lower from "@modules/layout/components/footer"
import SiteInfo from "@modules/layout/components/site-info"
import React from "react"
import { Region } from "types/medusa"

type FooterProps = {
  regions?: Region[]
  setRegion: (regionId: string) => void
  currentRegion?: string
}

const Footer: React.FC<FooterProps> = ({
  regions = [],
  setRegion,
  currentRegion,
}) => {
  return (
    <footer className="px-8">
      <SiteInfo />
      <Lower
        regions={regions}
        onChange={setRegion}
        currentRegion={currentRegion}
      />
    </footer>
  )
}

export default Footer
