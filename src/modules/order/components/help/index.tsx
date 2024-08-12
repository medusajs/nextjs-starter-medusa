import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Need help?</Heading>
      <div className="my-2 text-base-regular">
        <ul className="flex flex-col gap-y-2">
          <li>
            <a href="mailto:orders@coshop.nz">Contact: <span className="underline">orders@coshop.nz</span></a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
