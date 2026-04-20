import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Design Services | RH",
  description:
    "Placeholder overview of interior design, space planning, and project coordination.",
}

export default async function DesignServicesPage() {
  return (
    <>
      <section
        className="w-full flex items-center justify-center px-6 bg-qw-black"
        style={{ minHeight: 600 }}
      >
        <h1 className="font-serif font-light text-[clamp(2rem,5vw,3rem)] text-qw-white tracking-[0.12em] uppercase text-center max-w-4xl leading-tight">
          Design Services
        </h1>
      </section>

      <div className="content-container py-16 medium:py-24 max-w-3xl mx-auto">
        <section className="mb-14">
          <h2 className="font-serif font-light text-section-title text-qw-black tracking-wider uppercase mb-6">
            Tailored to your space
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            Our design studio collaborates on floor plans, lighting layers, and
            furnishing schedules—always starting from how you live, not from
            a catalogue grid. The following sections are illustrative placeholder
            copy in the QW visual tone; replace with finalized service descriptions.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-serif font-light text-card-title text-qw-black tracking-wide uppercase mb-4">
            Process
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            Discovery, schematic layouts, material boards, and installation
            sequencing are documented in a shared workspace so architects,
            contractors, and homeowners stay aligned. Revisions are tracked
            against the same SKU list used for checkout and delivery.
          </p>
        </section>

        <section>
          <h2 className="font-serif font-light text-card-title text-qw-black tracking-wide uppercase mb-4">
            Trade &amp; large projects
          </h2>
          <p className="font-sans text-body text-qw-charcoal leading-relaxed">
            Volume pricing, staging, and white-glove receiving can be
            coordinated for multi-unit and hospitality-adjacent programs.
            Contact your gallery team to scope timelines, documentation, and
            site-specific requirements.
          </p>
        </section>
      </div>
    </>
  )
}

