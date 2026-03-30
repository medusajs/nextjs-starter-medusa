const Hero = () => {
  return (
    <section className="w-full border-b border-ui-border-base relative bg-qw-black">
      <div className="h-[75vh] w-full relative">
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 min-w-0 max-w-full overflow-hidden">
          <div className="flex flex-col gap-y-6 items-center max-w-4xl">
            <h1 className="font-serif font-light text-[clamp(2.2rem,5vw,3.6rem)] leading-tight text-qw-white tracking-[0.12em] uppercase">
              Enduring Design for Modern Living
            </h1>
            <p className="font-sans text-[14px] leading-relaxed text-qw-grey max-w-2xl">
              Curated furnishings and lighting, styled as a cohesive editorial
              story—placeholder copy for your brand-approved narrative.
            </p>

            <a href="/store" className="qw-btn-primary">
              Shop the Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
