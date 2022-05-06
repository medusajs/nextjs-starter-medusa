import Image from "next/image"
import Link from "next/link"
import React from "react"

type ImageProps = {
  src: string
  alt: string
}

type CopyProps = {
  headline: string
  subline: string
  text: string
}

type CallToActionProps = {
  text: string
  link: string
}

export type HeroProps = {
  image: ImageProps
  copy: CopyProps
  callToAction: CallToActionProps
}

const Hero: React.FC<HeroProps> = ({ image, copy, callToAction }) => {
  return (
    <div className="w-full h-[calc(100vh-64px)] grid grid-cols-4">
      <div className="relative h-full col-span-4 lg:col-span-3">
        <Image
          src={image.src}
          alt={image.alt}
          layout="fill"
          loading="eager"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full"
          quality={90}
        />
      </div>
      <div className="absolute bottom-12 left-4 lg:left-0 lg:relative lg:col-span-1 flex flex-col justify-center px-12 overflow-hidden text-white lg:text-black">
        <span className="font-semibold text-xs uppercase">{copy.subline}</span>
        <span className="font-medium text-3xl my-2">{copy.headline}</span>
        <span className="text-sm  hidden lg:block">{copy.text}</span>
        <Link href={callToAction.link}>
          <a className="mt-2 lg:mt-4 font-medium text-sm underline underline-offset-2">
            {callToAction.text}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Hero
