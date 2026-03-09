import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  page?: {
    title: string
    excerpt?: string | null
    featured_image?: string | null
  } | null
}

const Hero = ({ page }: HeroProps) => {
  const title = page?.title || "Luxe Linen"
  const excerpt = page?.excerpt || "Soft essentials for everyday living"

  const backgroundImage = page?.featured_image
    ? `url(${page.featured_image})`
    : undefined

  return (
    <div
      className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle bg-center bg-cover"
      style={backgroundImage ? { backgroundImage } : undefined}
    >
      <div className="absolute inset-0 z-0 bg-overlay" />
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6 max-w-4xl mx-auto">
        <span>
          <Heading
            level="h1"
            className="text-5xl text-ui-fg-base text-on-primary mb-5 font-display leading-tight"
          >
            {title}
          </Heading>
          <Heading
            level="h2"
            className="text-base text-ui-fg-subtle font-normal text-on-primary"
          >
            {excerpt}
          </Heading>
        </span>
        <LocalizedClientLink href="/store" passHref>
          <Button size="large" className="mt-2">
            Shop the collection
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
