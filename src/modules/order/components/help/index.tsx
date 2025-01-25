import k from "@lib/i18n/translations/keys"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  const t = useSafeTranslations()

  return (
    <div className="mt-6">
      <Heading className="text-base-semi">{t(k.NEED_HELP)}</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">{t(k.CONTACT)}</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact">
              {t(k.RETURNS_EXCHANGES)}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
