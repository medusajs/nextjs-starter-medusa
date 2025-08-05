import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  backgroundColor?: string
}

const Hero = ({ 
  title = "Ecommerce Starter Template",
  subtitle = "Powered by Medusa and Next.js", 
  ctaText = "View on GitHub",
  ctaUrl = "https://github.com/medusajs/nextjs-starter-medusa",
  backgroundColor
}: HeroProps) => {
  return (
    <div 
      className="h-[75vh] w-full border-b border-ui-border-base relative"
      style={{ 
        backgroundColor: backgroundColor || undefined 
      }}
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
            {subtitle}
          </Heading>
        </span>
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">
              {ctaText}
              <Github />
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

export default Hero
