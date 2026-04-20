export type NavLinkItem = {
  label: string
  slug: string
  href: string
  external?: boolean
  intent?: "default" | "sale"
  children?: NavSubLinkItem[]
  catalog?: NavCatalogSecondaryItem[]
}

export type NavSubLinkItem = {
  label: string
  slug: string
  href: string
  external?: boolean
}

export type NavCatalogSecondaryItem = {
  label: string
  slug: string
  href: string
  external?: boolean
  sale?: boolean
  tertiary?: { label: string; href: string; external?: boolean }[]
}

/**
 * RH-style top navigation links (static).
 * UI only; internal routes can be wired later as needed.
 */
export const NAV_LINKS: NavLinkItem[] = [
  {
    label: "Living",
    slug: "living",
    href: "/categories/living",
    catalog: [
      {
        label: "Fabric Seating",
        slug: "fabric-seating",
        href: "/categories/living-seating",
        tertiary: [
          { label: "Seating Collections", href: "#", external: false }, // TODO: 待创建分类
          { label: "Sofas", href: "/categories/living-seating-sofas" },
          { label: "Sectionals", href: "/categories/living-seating-sectionals" },
          { label: "Chairs", href: "/categories/living-seating-accent-chairs" },
          { label: "Swivel Chairs", href: "/categories/living-seating-swivel-chairs" },
          { label: "Recliner Seating", href: "/categories/living-seating-recliners" },
          { label: "Sleeper Sofas", href: "/categories/living-seating-sleeper-sofas" },
          { label: "Chaises & Daybeds", href: "/categories/living-seating-chaises-and-daybeds" },
          { label: "Benches", href: "/categories/living-seating-benches" },
          { label: "Ottomans & Stools", href: "/categories/living-seating-ottomans-and-stools" },
          { label: "Fabric By The Yard", href: "#", external: false }, // TODO: 待创建分类
          { label: "Fabric Care", href: "#", external: false }, // TODO: 待创建分类
          { label: "Upholstery Swatches", href: "#", external: false }, // TODO: 待创建分类
        ],
      },
      { label: "Leather Seating", slug: "leather-seating", href: "#", external: false }, // TODO: 待创建分类
      { label: "The Cloud Collection", slug: "cloud-collection", href: "/categories/living-seating-the-cloud-collection" },
      { label: "Shelving & Cabinets", slug: "shelving-cabinets", href: "/categories/living-storage-and-shelving" },
      { label: "Sideboards", slug: "sideboards", href: "/categories/living-storage-and-shelving-sideboards-and-consoles" },
      { label: "Media", slug: "media", href: "/categories/living-media" },
      { label: "Tables", slug: "tables", href: "/categories/living-tables" },
      { label: "Consoles", slug: "consoles", href: "/categories/living-tables-console-tables" },
      { label: "Office", slug: "office", href: "#", external: false }, // TODO: 待创建分类
      { label: "Shop By Room", slug: "shop-by-room", href: "#", external: false }, // TODO: 待创建分类
      { label: "Sale", slug: "living-sale", href: "/categories/sale-living-sale", sale: true },
    ],
    children: [
      { label: "Sofas & Sectionals", slug: "sofas-sectionals", href: "/categories/living-seating" },
      { label: "Chairs", slug: "chairs", href: "/categories/living-seating-accent-chairs" },
      { label: "Coffee Tables", slug: "coffee-tables", href: "/categories/living-tables-coffee-tables" },
      { label: "Side & End Tables", slug: "side-end-tables", href: "/categories/living-tables-side-and-end-tables" },
      { label: "Console Tables", slug: "console-tables", href: "/categories/living-tables-console-tables" },
      { label: "Ottomans & Poufs", slug: "ottomans-poufs", href: "/categories/living-seating-ottomans-and-stools" },
      { label: "Bookcases & Storage", slug: "bookcases-storage", href: "/categories/living-storage-and-shelving" },
      { label: "TV & Media", slug: "tv-media", href: "/categories/living-media" },
      { label: "Desks & Office", slug: "desks-office", href: "#", external: false }, // TODO: 待创建分类
      { label: "Accent Furniture", slug: "accent-furniture", href: "/categories/living-accents" },
      { label: "Decorative Accessories", slug: "decorative-accessories", href: "/categories/living-accents-decorative-accessories" },
      { label: "Wall Décor", slug: "wall-decor", href: "/categories/living-accents-wall-decor" },
      { label: "Mirrors", slug: "mirrors", href: "/categories/living-accents-mirrors" },
      { label: "Fireplaces & Accessories", slug: "fireplaces-accessories", href: "/categories/living-accents-fireplaces-and-accessories" },
    ],
  },
  {
    label: "Dining",
    slug: "dining",
    href: "/categories/dining",
    children: [
      { label: "Dining Tables", slug: "dining-tables", href: "/categories/dining-tables" },
      { label: "Dining Chairs", slug: "dining-chairs", href: "/categories/dining-seating-all-dining-chairs" },
      { label: "Bar & Counter Stools", slug: "bar-counter-stools", href: "/categories/dining-bar-and-counter" },
      { label: "Buffets & Sideboards", slug: "buffets-sideboards", href: "/categories/dining-storage-buffets-and-sideboards" },
      { label: "Bar Cabinets", slug: "bar-cabinets", href: "/categories/dining-storage-bar-cabinets-and-carts" },
      { label: "Wine Storage", slug: "wine-storage", href: "/categories/dining-storage-wine-storage" },
      { label: "Dining Room Lighting", slug: "dining-room-lighting", href: "#", external: false }, // TODO: 待创建分类
      { label: "Table Linens", slug: "table-linens", href: "/categories/dining-tabletop-table-linens" },
      { label: "Tableware", slug: "tableware", href: "/categories/dining-tabletop-tableware" },
      { label: "Glassware", slug: "glassware", href: "/categories/dining-tabletop-glassware" },
      { label: "Bar Accessories", slug: "bar-accessories", href: "/categories/dining-tabletop-bar-accessories" },
    ],
  },
  {
    label: "Bed",
    slug: "bed",
    href: "/categories/bed",
    children: [
      { label: "Beds & Headboards", slug: "beds-headboards", href: "/categories/bed-beds-and-headboards" },
      { label: "Nightstands", slug: "nightstands", href: "/categories/bed-bedroom-furniture-nightstands" },
      { label: "Dressers & Chests", slug: "dressers-chests", href: "/categories/bed-bedroom-furniture-dressers-and-chests" },
      { label: "Armoires & Wardrobes", slug: "armoires-wardrobes", href: "/categories/bed-bedroom-furniture-armoires-and-wardrobes" },
      { label: "Bedding", slug: "bedding", href: "/categories/bed-bedding" },
      { label: "Pillows", slug: "pillows", href: "/categories/bed-pillows-and-throws-bed-pillows" },
      { label: "Blankets & Throws", slug: "blankets-throws", href: "/categories/bed-pillows-and-throws-blankets-and-throws" },
      { label: "Bedroom Lighting", slug: "bedroom-lighting", href: "/categories/bed-bedroom-accents-bedroom-lighting" },
      { label: "Bedroom Storage", slug: "bedroom-storage", href: "/categories/bed-bedroom-furniture" },
      { label: "Kids Beds", slug: "kids-beds", href: "/categories/baby-and-child-kids-bedroom-kids-beds" },
      { label: "Kids Bedding", slug: "kids-bedding", href: "/categories/baby-and-child-kids-textiles-kids-bedding" },
    ],
  },
  {
    label: "Bath",
    slug: "bath",
    href: "/categories/bath",
    children: [
      { label: "Vanities", slug: "vanities", href: "/categories/bath-vanities-and-storage" },
      { label: "Bath Cabinets", slug: "bath-cabinets", href: "/categories/bath-vanities-and-storage-bath-cabinets" },
      { label: "Mirrors", slug: "mirrors", href: "/categories/bath-mirrors-and-lighting-bath-mirrors" },
      { label: "Medicine Cabinets", slug: "medicine-cabinets", href: "/categories/bath-vanities-and-storage-medicine-cabinets" },
      { label: "Bath Lighting", slug: "bath-lighting", href: "/categories/bath-mirrors-and-lighting" },
      { label: "Towel Bars & Hooks", slug: "towel-bars-hooks", href: "/categories/bath-bath-hardware" },
      { label: "Shower Curtains", slug: "shower-curtains", href: "/categories/bath-bath-textiles-shower-curtains" },
      { label: "Bath Accessories", slug: "bath-accessories", href: "/categories/bath-bath-accessories" },
      { label: "Bath Linens", slug: "bath-linens", href: "/categories/bath-bath-textiles" },
      { label: "Rugs", slug: "rugs", href: "/categories/bath-bath-textiles-bath-rugs" },
    ],
  },
  {
    label: "Outdoor",
    slug: "outdoor",
    href: "/categories/outdoor",
    children: [
      { label: "Outdoor Sofas", slug: "outdoor-sofas", href: "/categories/outdoor-seating-outdoor-sofas" },
      { label: "Outdoor Sectionals", slug: "outdoor-sectionals", href: "/categories/outdoor-seating-outdoor-sectionals" },
      { label: "Outdoor Chairs", slug: "outdoor-chairs", href: "/categories/outdoor-seating-outdoor-chairs" },
      { label: "Outdoor Chaises", slug: "outdoor-chaises", href: "/categories/outdoor-seating-outdoor-chaises" },
      { label: "Outdoor Dining Tables", slug: "outdoor-dining-tables", href: "/categories/outdoor-dining-outdoor-dining-tables" },
      { label: "Outdoor Dining Chairs", slug: "outdoor-dining-chairs", href: "/categories/outdoor-dining-outdoor-dining-chairs" },
      { label: "Outdoor Coffee Tables", slug: "outdoor-coffee-tables", href: "/categories/outdoor-tables-and-accents-outdoor-coffee-tables" },
      { label: "Outdoor Side Tables", slug: "outdoor-side-tables", href: "/categories/outdoor-tables-and-accents-outdoor-side-tables" },
      { label: "Fire Pits", slug: "fire-pits", href: "/categories/outdoor-shade-and-fire-fire-pits" },
      { label: "Umbrellas & Shade", slug: "umbrellas-shade", href: "/categories/outdoor-shade-and-fire-umbrellas-and-bases" },
      { label: "Outdoor Rugs", slug: "outdoor-rugs", href: "/categories/outdoor-outdoor-decor-outdoor-rugs" },
      { label: "Outdoor Lighting", slug: "outdoor-lighting", href: "/categories/outdoor-outdoor-decor-outdoor-lighting" },
      { label: "Outdoor Pillows", slug: "outdoor-pillows", href: "/categories/outdoor-outdoor-decor-outdoor-pillows" },
      { label: "Planters & Garden", slug: "planters-garden", href: "/categories/outdoor-outdoor-decor-planters-and-garden" },
    ],
  },
  {
    label: "Lighting",
    slug: "lighting",
    href: "/categories/lighting",
    children: [
      { label: "Chandeliers", slug: "chandeliers", href: "/categories/lighting-ceiling-chandeliers" },
      { label: "Pendants", slug: "pendants", href: "/categories/lighting-ceiling-pendants" },
      { label: "Flush & Semi-Flush", slug: "flush-semi-flush", href: "/categories/lighting-ceiling" },
      { label: "Wall Sconces", slug: "wall-sconces", href: "/categories/lighting-wall-and-picture-wall-sconces" },
      { label: "Table Lamps", slug: "table-lamps", href: "/categories/lighting-table-and-floor-table-lamps" },
      { label: "Floor Lamps", slug: "floor-lamps", href: "/categories/lighting-table-and-floor-floor-lamps" },
      { label: "Outdoor Lighting", slug: "outdoor-lighting", href: "/categories/lighting-outdoor-lighting" },
      { label: "Bath Lighting", slug: "bath-lighting", href: "/categories/lighting-bath-lighting" },
      { label: "Picture Lights", slug: "picture-lights", href: "/categories/lighting-wall-and-picture-picture-lights" },
      { label: "Ceiling Fans", slug: "ceiling-fans", href: "#", external: false }, // TODO: 待创建分类
      { label: "Bulbs & Accessories", slug: "bulbs-accessories", href: "#", external: false }, // TODO: 待创建分类
    ],
  },
  {
    label: "Textiles",
    slug: "textiles",
    href: "/categories/textiles",
    children: [
      { label: "Bedding Sets", slug: "bedding-sets", href: "/categories/textiles-bedding" },
      { label: "Duvet Covers", slug: "duvet-covers", href: "/categories/textiles-bedding-duvet-covers" },
      { label: "Sheets", slug: "sheets", href: "/categories/textiles-bedding-sheets" },
      { label: "Pillowcases", slug: "pillowcases", href: "/categories/textiles-bedding-pillowcases" },
      { label: "Blankets & Throws", slug: "blankets-throws", href: "/categories/textiles-blankets-and-throws" },
      { label: "Decorative Pillows", slug: "decorative-pillows", href: "/categories/textiles-pillows-decorative-pillows" },
      { label: "Table Linens", slug: "table-linens", href: "/categories/textiles-bath-and-table-linens-table-linens" },
      { label: "Shower Curtains", slug: "shower-curtains", href: "#", external: false }, // TODO: 待创建分类
      { label: "Bath Towels", slug: "bath-towels", href: "/categories/textiles-bath-and-table-linens-bath-towels" },
      { label: "Window Treatments", slug: "window-treatments", href: "/categories/textiles-window-treatments" },
    ],
  },
  {
    label: "Rugs",
    slug: "rugs",
    href: "/categories/rugs",
    children: [
      { label: "2x3", slug: "2x3", href: "/categories/rugs-by-size-2x3" },
      { label: "3x5", slug: "3x5", href: "/categories/rugs-by-size-3x5" },
      { label: "4x6", slug: "4x6", href: "/categories/rugs-by-size-4x6" },
      { label: "5x8", slug: "5x8", href: "/categories/rugs-by-size-5x8" },
      { label: "6x9", slug: "6x9", href: "/categories/rugs-by-size-6x9" },
      { label: "8x10", slug: "8x10", href: "/categories/rugs-by-size-8x10" },
      { label: "9x12", slug: "9x12", href: "/categories/rugs-by-size-9x12" },
      { label: "10x14", slug: "10x14", href: "/categories/rugs-by-size-10x14" },
      { label: "12x15", slug: "12x15", href: "/categories/rugs-by-size-12x15-and-larger" },
      { label: "Custom Rugs", slug: "custom-rugs", href: "/categories/rugs-rug-accessories-custom-rugs" },
      { label: "Outdoor Rugs", slug: "outdoor-rugs", href: "/categories/rugs-outdoor-rugs" },
      { label: "Rug Pads", slug: "rug-pads", href: "/categories/rugs-rug-accessories-rug-pads" },
    ],
  },
  {
    label: "Décor",
    slug: "decor",
    href: "/categories/decor",
    children: [
      { label: "Decorative Accessories", slug: "decorative-accessories", href: "/categories/decor-decorative-accessories" },
      { label: "Vases & Vessels", slug: "vases-vessels", href: "/categories/decor-decorative-accessories-vases-and-vessels" },
      { label: "Candles & Candle Holders", slug: "candles-candle-holders", href: "/categories/decor-decorative-accessories-candles-and-holders" },
      { label: "Picture Frames", slug: "picture-frames", href: "#", external: false }, // TODO: 待创建分类
      { label: "Clocks", slug: "clocks", href: "/categories/decor-books-and-clocks" },
      { label: "Sculptures", slug: "sculptures", href: "/categories/decor-decorative-accessories-sculptures-and-objects" },
      { label: "Books & Bookends", slug: "books-bookends", href: "/categories/decor-books-and-clocks" },
      { label: "Trays", slug: "trays", href: "/categories/decor-decorative-accessories-bowls-and-trays" },
      { label: "Baskets & Storage", slug: "baskets-storage", href: "#", external: false }, // TODO: 待创建分类
      { label: "Holiday Décor", slug: "holiday-decor", href: "/categories/decor-seasonal-holiday-decor" },
    ],
  },
  {
    label: "Baby & Child",
    slug: "baby-child",
    href: "https://rhbabyandchild.rh.com/us/en/",
    external: true,
  },
  {
    label: "Teen",
    slug: "teen",
    href: "https://rhteen.rh.com/us/en/",
    external: true,
  },
  {
    label: "Sale",
    slug: "sale",
    href: "/categories/sale",
    intent: "sale",
    children: [
      { label: "Living Sale", slug: "living-sale", href: "/categories/sale-living-sale" },
      { label: "Dining Sale", slug: "dining-sale", href: "/categories/sale-dining-sale" },
      { label: "Bed Sale", slug: "bed-sale", href: "/categories/sale-bed-and-bath-sale" },
      { label: "Bath Sale", slug: "bath-sale", href: "/categories/sale-bed-and-bath-sale" },
      { label: "Outdoor Sale", slug: "outdoor-sale", href: "/categories/sale-outdoor-sale" },
      { label: "Lighting Sale", slug: "lighting-sale", href: "/categories/sale-other-sale-lighting-sale" },
      { label: "Textiles Sale", slug: "textiles-sale", href: "/categories/sale-other-sale-textiles-sale" },
      { label: "Rugs Sale", slug: "rugs-sale", href: "/categories/sale-other-sale-rugs-sale" },
      { label: "Décor Sale", slug: "decor-sale", href: "/categories/sale-other-sale-decor-sale" },
    ],
  },
  {
    label: "Interior Design",
    slug: "interior-design",
    href: "/design-services",
  },
]
