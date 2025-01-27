import { useTranslations } from "next-intl"

import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  const t = useTranslations()
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            {t('ECOMMERCE_STARTER_TEMPLATE')}
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            {t('POWERED_BY_MEDUSA_AND_NEXT_JS')}
          </Heading>
        </span>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <Button variant="secondary">
            {t('VIEW_ON_GITHUB')}
            <Github />
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
