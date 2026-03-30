import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | RH",
  description:
    "Learn about our approach to materials, scale, and enduring design for the modern home.",
}

export default async function AboutPage() {
  return (
    <>
      <section
        className="w-full flex items-center justify-center px-6 bg-qw-black"
        style={{ minHeight: 600 }}
      >
        <h1 className="font-serif font-light text-[clamp(2rem,5vw,3rem)] text-qw-white tracking-[0.12em] uppercase text-center max-w-4xl leading-tight">
          Our Story
        </h1>
      </section>

      <div className="content-container py-16 medium:py-24 max-w-3xl mx-auto">
        <section className="mb-14">
          <h2 className="font-serif font-light text-section-title text-qw-black tracking-wider uppercase mb-6">
            Design with intention
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            We curate furnishings and lighting as a single, cohesive language—
            balanced proportions, honest materials, and finishes chosen to age
            gracefully. This page uses illustrative placeholder copy; replace
            it with your finalized narrative.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-serif font-light text-card-title text-qw-black tracking-wide uppercase mb-4">
            Materials &amp; craft
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            Stone, timber, metalwork, and textile are specified for tactile
            warmth and long-term use—not seasonal novelty. Vendors are
            selected for consistency, scale, and the ability to support bespoke
            programs where the project demands it.
          </p>
        </section>

        <section>
          <h2 className="font-serif font-light text-card-title text-qw-black tracking-wide uppercase mb-4">
            Showrooms &amp; service
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            In-person appointments and remote planning share the same product
            data and imagery, so decisions made in-gallery translate cleanly
            to delivery and installation. Trade relationships and member
            programs extend the same standards across channels.
          </p>
        </section>
      </div>
    </>
  )
}

