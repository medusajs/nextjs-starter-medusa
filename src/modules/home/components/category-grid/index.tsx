import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryGrid() {
  const productCategories = await listCategories({ limit: 1000 })

  const topLevelCategories = (productCategories ?? []).filter(
    (c) => !c.parent_category
  )

  if (!topLevelCategories.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-24">
      <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-6">
        {topLevelCategories.map((cat: HttpTypes.StoreProductCategory) => (
          <LocalizedClientLink
            key={cat.id}
            href={`/categories/${cat.handle}`}
            className="group relative flex min-h-[180px] items-end overflow-hidden border border-qw-pale-grey bg-qw-black text-qw-white transition-transform duration-800 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.03]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-qw-charcoal/60 to-qw-black" />
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-qw-gold/15 blur-[1px]" />
            <div className="relative p-7 w-full">
              <div className="flex items-start justify-between gap-x-6">
                <h3 className="font-serif font-light text-card-title leading-[28px] uppercase tracking-wider">
                  {cat.name}
                </h3>
                <span className="text-qw-grey transition-colors duration-300 group-hover:text-qw-white">
                  &rarr;
                </span>
              </div>
              {cat.description ? (
                <p className="mt-4 text-[13px] leading-relaxed text-qw-grey/90">
                  {cat.description}
                </p>
              ) : null}
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}

