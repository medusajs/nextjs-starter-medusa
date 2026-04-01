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
    <footer className="border-t border-qw-pale-grey bg-qw-white w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 py-40">
          {/* Brand */}
          <div>
            <LocalizedClientLink
              href="/"
              className="font-serif text-card-title font-light uppercase tracking-[0.08em] text-qw-charcoal transition-colors duration-300 hover:text-qw-black"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden small:grid small:grid-cols-4 gap-x-16 gap-y-10">
            <div className="flex flex-col gap-y-2">
              <span className="text-micro uppercase tracking-[0.16em] text-qw-charcoal">
                Categories
              </span>
              <ul className="grid grid-cols-1 gap-2 text-caption text-qw-medium-grey">
                {productCategories
                  ?.filter((c) => !c.parent_category)
                  .slice(0, 8)
                  .map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 text-ui-fg-subtle"
                    >
                      <LocalizedClientLink
                        className="transition-colors duration-300 hover:text-qw-black"
                        href={`/categories/${c.handle}`}
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="text-micro uppercase tracking-[0.16em] text-qw-charcoal">Services</span>
              <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                <li>
                  <a className="transition-colors duration-300 hover:text-qw-black" href="#">
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
              <span className="text-micro uppercase tracking-[0.16em] text-qw-charcoal">Company</span>
              <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                <li>
                  <LocalizedClientLink
                    className="transition-colors duration-300 hover:text-qw-black"
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
              <span className="text-micro uppercase tracking-[0.16em] text-qw-charcoal">Legal</span>
              <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                <li>
                  <a className="transition-colors duration-300 hover:text-qw-black" href="#">
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
                  <ul className="grid grid-cols-1 gap-2 text-caption text-qw-medium-grey">
                    {productCategories
                      ?.filter((c) => !c.parent_category)
                      .slice(0, 8)
                      .map((c) => (
                        <li key={c.id}>
                          <LocalizedClientLink
                            className="transition-colors duration-300 hover:text-qw-black"
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
                  <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                    <li>
                      <a className="transition-colors duration-300 hover:text-qw-black" href="#">
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
                  <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                    <li>
                      <LocalizedClientLink
                        className="transition-colors duration-300 hover:text-qw-black"
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
                  <ul className="grid grid-cols-1 gap-y-2 text-caption text-qw-medium-grey">
                    <li>
                      <a className="transition-colors duration-300 hover:text-qw-black" href="#">
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
                className="border border-qw-pale-grey px-4 py-3"
              >
                <summary className="cursor-pointer text-micro uppercase tracking-[0.16em] text-qw-charcoal">
                  {col.title}
                </summary>
                <div className="pt-3">{col.body}</div>
              </details>
            ))}
          </div>

          {/* Newsletter placeholder */}
          <div className="flex flex-col small:flex-row gap-y-3 small:items-center small:justify-between pt-6 border-t border-qw-pale-grey">
            <div className="text-caption text-qw-medium-grey">
              Stay in the loop with product updates and editorial stories.
            </div>
            <div className="flex gap-x-3 w-full small:w-auto">
              <input
                type="email"
                placeholder="Email address"
                className="w-full small:w-[260px] px-4 py-2 border border-qw-pale-grey focus:outline-none text-caption text-qw-charcoal placeholder:text-qw-grey"
              />
              <button
                type="button"
                className="qw-btn-primary px-6"
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex w-full justify-between text-qw-medium-grey mt-10">
            <Text className="text-caption">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </Text>
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
