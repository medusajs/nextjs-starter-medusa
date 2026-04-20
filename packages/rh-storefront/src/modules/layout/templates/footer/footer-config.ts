export type FooterLinkItem = {
  label: string
  href: string
  external?: boolean
}

export type FooterLinkColumn = {
  title: string
  items: FooterLinkItem[]
}

export const FOOTER_LINK_COLUMNS: FooterLinkColumn[] = [
  {
    title: "RESOURCES",
    items: [
      { label: "LOCATE A GALLERY", href: "/store" },
      { label: "VIEW SOURCEBOOKS", href: "#" },
      { label: "REQUEST A SOURCEBOOK", href: "#" },
      { label: "QW MEMBERS PROGRAM", href: "#" },
      { label: "QW TRADE", href: "#" },
      { label: "QW CONTRACT", href: "#" },
      { label: "QW CREDIT CARD", href: "#" },
      { label: "SITE MAP", href: "#" },
    ],
  },
  {
    title: "CUSTOMER EXPERIENCE",
    items: [
      { label: "CONTACT US", href: "#" },
      { label: "PLACING AN ORDER", href: "#" },
      { label: "SHIPPING & DELIVERY", href: "#" },
      { label: "RETURNS & EXCHANGES", href: "#" },
      { label: "LIFETIME GUARANTEE", href: "#" },
      { label: "QW GIFT CARD", href: "#" },
      { label: "ACCESSIBILITY STATEMENT", href: "#" },
      { label: "FAQS", href: "#" },
    ],
  },
  {
    title: "OUR COMPANY",
    items: [
      { label: "LETTERS FROM THE CEO", href: "#", external: true },
      { label: "LEADERSHIP TEAM", href: "#", external: true },
      { label: "INVESTOR RELATIONS", href: "#", external: true },
      { label: "PRESS", href: "#", external: true },
      { label: "CAREERS", href: "#", external: true },
    ],
  },
  {
    title: "LEGAL",
    items: [
      { label: "PRIVACY", href: "#" },
      { label: "TERMS OF USE", href: "#" },
      { label: "TEXT MESSAGING TERMS", href: "#" },
      { label: "QW IN CANADA", href: "#" },
      { label: "CPA OPT-OUT", href: "#", external: true },
      { label: "SAFETY RECALLS", href: "#" },
    ],
  },
]
