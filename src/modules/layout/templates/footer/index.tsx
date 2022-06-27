import Lower from "@modules/layout/components/footer"
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
    <footer className="px-8 bg-gray-50">
      <div className="flex flex-col lg:gap-y-8 py-4">
        <Lower
          regions={regions}
          onChange={setRegion}
          currentRegion={currentRegion}
        />
      </div>
    </footer>
  )
}

export default Footer
