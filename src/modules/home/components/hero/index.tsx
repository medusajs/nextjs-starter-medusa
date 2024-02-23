import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="md:h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
    
      <video autoPlay loop muted poster="/banner.jpg" className="z-10 inset-0 w-full h-full flex flex-col">
        <source src="/videso.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Skuva
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Prince
          </Heading>
        </span>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <Button variant="secondary">
            View on GitHub
            <Github />
          </Button>
        </a>
      </div> */}
    </div>
  )
}

export default Hero
