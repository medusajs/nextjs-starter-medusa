import Link from "next/link"
import React from "react"

const Help = () => {
  return (
    <div>
      <h2 className="text-base-semi">Need help?</h2>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <Link href="/contact">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/contact">
              Returns & Exchanges
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
