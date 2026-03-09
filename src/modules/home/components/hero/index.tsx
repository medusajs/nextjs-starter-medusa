import { Heading } from "@medusajs/ui"

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
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            {title}
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            {excerpt}
          </Heading>
        </span>
      </div>
    </div>
  )
}

export default Hero
