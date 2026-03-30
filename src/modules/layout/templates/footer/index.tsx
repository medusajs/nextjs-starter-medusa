import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 py-40">
          {/* Brand */}
          <div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden small:grid small:grid-cols-4 gap-x-16 gap-y-10">
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base uppercase">
                Categories
              </span>
              <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
                {productCategories
                  ?.filter((c) => !c.parent_category)
                  .slice(0, 8)
                  .map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 text-ui-fg-subtle"
                    >
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base txt-small-plus"
                        href={`/categories/${c.handle}`}
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base uppercase">Services</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Design Services
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Trade Programs
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    White-Glove Delivery
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Returns & Exchanges
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base uppercase">Company</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base"
                    href="/about"
                  >
                    About
                  </LocalizedClientLink>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Contact
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base uppercase">Legal</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a className="hover:text-ui-fg-base" href="#">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile: accordion (no client JS; avoids hydration risk) */}
          <div className="small:hidden flex flex-col gap-y-4">
            {[
              {
                title: "Categories",
                body: (
                  <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
                    {productCategories
                      ?.filter((c) => !c.parent_category)
                      .slice(0, 8)
                      .map((c) => (
                        <li key={c.id}>
                          <LocalizedClientLink
                            className="hover:text-ui-fg-base"
                            href={`/categories/${c.handle}`}
                          >
                            {c.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                  </ul>
                ),
              },
              {
                title: "Services",
                body: (
                  <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Design Services
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Trade Programs
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        White-Glove Delivery
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Returns & Exchanges
                      </a>
                    </li>
                  </ul>
                ),
              },
              {
                title: "Company",
                body: (
                  <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                    <li>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href="/about"
                      >
                        About
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Contact
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Careers
                      </a>
                    </li>
                  </ul>
                ),
              },
              {
                title: "Legal",
                body: (
                  <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-ui-fg-base" href="#">
                        Accessibility
                      </a>
                    </li>
                  </ul>
                ),
              },
            ].map((col) => (
              <details
                key={col.title}
                className="border border-ui-border-base rounded-rounded px-4 py-3"
              >
                <summary className="cursor-pointer font-semibold txt-small-plus txt-ui-fg-base uppercase">
                  {col.title}
                </summary>
                <div className="pt-3">{col.body}</div>
              </details>
            ))}
          </div>

          {/* Newsletter placeholder */}
          <div className="flex flex-col small:flex-row gap-y-3 small:items-center small:justify-between pt-6 border-t border-ui-border-base">
            <div className="txt-small-regular text-ui-fg-subtle">
              Stay in the loop with product updates and editorial stories.
            </div>
            <div className="flex gap-x-3 w-full small:w-auto">
              <input
                type="email"
                placeholder="Email address"
                className="w-full small:w-[260px] px-4 py-2 border border-ui-border-base rounded-soft focus:outline-none"
              />
              <button
                type="button"
                className="qw-btn-primary px-6"
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex w-full justify-between text-ui-fg-muted mt-10">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </Text>
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
