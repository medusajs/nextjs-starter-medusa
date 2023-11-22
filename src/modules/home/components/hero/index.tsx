import { Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32">
        <Heading
          level="h1"
          className="text-3xl leading-10 text-ui-fg-base font-normal"
        >
          Ecommerce Starter Template
        </Heading>
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-subtle font-normal"
        >
          Powered by Medusa and Next.js
        </Heading>
      </div>
    </div>
  )
}

export default Hero
