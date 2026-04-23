"use client"

export default function FooterEmailSignup() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto flex max-w-[560px] flex-col items-center"
    >
      <h2 className="font-serif text-[36px] leading-[0.95] font-light uppercase tracking-[0.01em] text-qw-charcoal small:whitespace-nowrap">
        INSPIRATION, DELIVERED.
      </h2>
      <p className="mt-2 text-[11px] text-qw-medium-grey">
        Discover our products, places, services and spaces.
      </p>

      <div className="mt-5 flex w-full">
        <input
          type="email"
          placeholder="Enter your email"
          className="h-10 w-full border border-r-0 border-qw-pale-grey px-3 text-[11px] text-qw-charcoal placeholder:text-qw-grey focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 min-w-[98px] border border-qw-pale-grey bg-qw-white px-5 text-[9px] uppercase tracking-[0.14em] text-qw-charcoal transition-colors duration-300 hover:bg-qw-off-white"
        >
          SIGN UP
        </button>
      </div>
    </form>
  )
}
