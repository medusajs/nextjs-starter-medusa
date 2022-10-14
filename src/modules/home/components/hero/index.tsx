import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-[90vh] w-full relative">
      <div className="text-white absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:text-left small:justify-end small:items-start small:p-32">
        <h1 className="text-2xl-semi mb-4 drop-shadow-md shadow-black">
          Heaven meets Hell
        </h1>
        <div className="bio-wrapper">
          <p className="text-base-regular max-w-[32rem] mb-6 drop-shadow-md shadow-black">
          EyeBall is a mixed media artist, currently based out of California. Featuring a variety of styles, primarily dark surrealism. Concepts derived from near death experiences, self induced physiological torment, as well as inwards exploration. Highlighting the fact that life is confusing and messy, but also simple and beautiful.
          </p>
        </div>
        <UnderlineLink href="/store">Explore products</UnderlineLink>
      </div>
      <Image
        src="/hero.jpg"
        layout="fill"
        loading="eager"
        priority={true}
        quality={90}
        objectFit="cover"
        alt="Photo by @thevoncomplex https://unsplash.com/@thevoncomplex"
        className="absolute inset-0"
        draggable="false"
      />
    </div>
  )
}

export default Hero
