import type { ReactNode } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FOOTER_LINK_COLUMNS, type FooterLinkItem } from "./footer-config"

const linkClass =
  "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-qw-medium-grey transition-colors duration-300 hover:text-qw-charcoal"

function FooterExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 8L8 2" stroke="currentColor" strokeWidth="0.75" />
      <path d="M4 2H8V6" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  )
}

function FooterLink({ item }: { item: FooterLinkItem }) {
  const content = (
    <>
      <span>{item.label}</span>
      {item.external ? <FooterExternalIcon /> : null}
    </>
  )

  if (item.href.startsWith("/")) {
    return (
      <LocalizedClientLink href={item.href} className={linkClass}>
        {content}
      </LocalizedClientLink>
    )
  }

  return (
    <a
      href={item.href}
      className={linkClass}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  )
}

function ColumnBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] uppercase tracking-[0.12em] text-qw-charcoal">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function FooterColumns() {
  return (
    <>
      <div className="hidden small:grid small:grid-cols-4 gap-x-14">
        {FOOTER_LINK_COLUMNS.map((column) => (
          <ColumnBlock key={column.title} title={column.title}>
            <ul className="space-y-1.5">
              {column.items.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </ColumnBlock>
        ))}
      </div>

      <div className="small:hidden space-y-3">
        {FOOTER_LINK_COLUMNS.map((column) => (
          <details key={column.title} className="border border-qw-pale-grey px-4 py-3">
            <summary className="cursor-pointer list-none text-micro uppercase tracking-[0.16em] text-qw-charcoal">
              {column.title}
            </summary>
            <ul className="mt-3 space-y-2">
              {column.items.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  )
}
