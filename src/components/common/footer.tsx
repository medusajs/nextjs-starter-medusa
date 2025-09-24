import { getTranslations } from "next-intl/server"

import { listCategories } from "@/utils/data/categories"
import { listCollections } from "@/utils/data/collections"
import { cn } from "@/lib/utils"

import { LocalizedClientLink } from "@/components/i18n/client-link"

export async function FooterItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <LocalizedClientLink
        className="text-sm transition-colors font-normal text-muted-foreground hover:text-foreground"
        href={href}
      >
        {children}
      </LocalizedClientLink>
    </li>
  )
}

async function Footer() {
  const t = await getTranslations("common.footer")
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-secondary">
      <div className="w-full">
        <div className="container flex flex-col gap-y-6 lg:flex-row items-start justify-between py-10">
          <div className="text-sm gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-foreground font-medium">
                  {t("categories")}
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    return (
                      <FooterItem key={c.id} href={`/categories/${c.handle}`}>
                        {c.name}
                      </FooterItem>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-foreground font-medium">
                  {t("collections")}
                </span>
                <ul
                  className={cn("grid grid-cols-1 gap-2 text-foreground", {
                    "grid-cols-2": (collections?.length || 0) > 3,
                  })}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <FooterItem key={c.id} href={`/collections/${c.handle}`}>
                      {c.title}
                    </FooterItem>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="py-3 text-sm bg-background">
        <div className="flex w-full justify-center">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
