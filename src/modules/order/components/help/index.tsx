import { useTranslations } from "next-intl"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  const t = useTranslations()

  return (
    <div className="mt-6">
      <Heading className="text-base-semi">{t('NEED_HELP')}</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">{t('CONTACT')}</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact">
              {t('RETURNS_EXCHANGES')}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
