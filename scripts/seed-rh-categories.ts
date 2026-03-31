type CategoryNode = {
  name: string
  children?: CategoryNode[]
}

const TREE: CategoryNode[] = [
  {
    name: "LIVING",
    children: [
      {
        name: "Seating",
        children: [
          { name: "Sofas" },
          { name: "Sectionals" },
          { name: "The Cloud Collection" },
          { name: "Accent Chairs" },
          { name: "Swivel Chairs" },
          { name: "Recliners" },
          { name: "Sleeper Sofas" },
          { name: "Chaises & Daybeds" },
          { name: "Benches" },
          { name: "Ottomans & Stools" },
        ],
      },
      {
        name: "Tables",
        children: [
          { name: "Coffee Tables" },
          { name: "Side & End Tables" },
          { name: "Console Tables" },
          { name: "Nesting Tables" },
        ],
      },
      {
        name: "Storage & Shelving",
        children: [
          { name: "Cabinets" },
          { name: "Open Shelving" },
          { name: "Sideboards & Consoles" },
          { name: "Bar Cabinets & Carts" },
          { name: "Sideboard Collections" },
        ],
      },
      {
        name: "Media",
        children: [
          { name: "All Media Consoles" },
          { name: "Closed Media Consoles" },
          { name: "Glass Media Consoles" },
          { name: "Media Armoires" },
        ],
      },
      {
        name: "Accents",
        children: [
          { name: "Decorative Accessories" },
          { name: "Wall Décor" },
          { name: "Mirrors" },
          { name: "Fireplaces & Accessories" },
          { name: "Pillows" },
        ],
      },
    ],
  },
  {
    name: "DINING",
    children: [
      {
        name: "Tables",
        children: [
          { name: "All Dining Tables" },
          { name: "Round Tables" },
          { name: "Rectangular Tables" },
          { name: "Extendable Tables" },
          { name: "Counter Height Tables" },
        ],
      },
      {
        name: "Seating",
        children: [
          { name: "All Dining Chairs" },
          { name: "Upholstered Chairs" },
          { name: "Wood Chairs" },
          { name: "Metal Chairs" },
          { name: "Dining Benches" },
        ],
      },
      {
        name: "Bar & Counter",
        children: [
          { name: "Counter Stools" },
          { name: "Bar Stools" },
          { name: "Bar Tables" },
        ],
      },
      {
        name: "Storage",
        children: [
          { name: "Buffets & Sideboards" },
          { name: "China Cabinets" },
          { name: "Bar Cabinets & Carts" },
          { name: "Wine Storage" },
        ],
      },
      {
        name: "Tabletop",
        children: [
          { name: "Tableware" },
          { name: "Glassware" },
          { name: "Bar Accessories" },
          { name: "Table Linens" },
          { name: "Serveware" },
        ],
      },
    ],
  },
  {
    name: "BED",
    children: [
      {
        name: "Beds & Headboards",
        children: [
          { name: "All Beds" },
          { name: "Upholstered Beds" },
          { name: "Wood Beds" },
          { name: "Metal Beds" },
          { name: "Canopy Beds" },
          { name: "Headboards Only" },
        ],
      },
      {
        name: "Bedroom Furniture",
        children: [
          { name: "Nightstands" },
          { name: "Dressers & Chests" },
          { name: "Armoires & Wardrobes" },
          { name: "Bedroom Benches" },
        ],
      },
      {
        name: "Bedding",
        children: [
          { name: "Duvet Covers" },
          { name: "Comforters" },
          { name: "Sheets" },
          { name: "Pillowcases" },
          { name: "Bed Skirts" },
          { name: "Bedding Collections" },
        ],
      },
      {
        name: "Pillows & Throws",
        children: [
          { name: "Bed Pillows" },
          { name: "Decorative Pillows" },
          { name: "Blankets & Throws" },
          { name: "Quilts" },
        ],
      },
      {
        name: "Bedroom Accents",
        children: [
          { name: "Bedroom Lighting" },
          { name: "Mirrors" },
          { name: "Bedroom Rugs" },
          { name: "Bedroom Décor" },
        ],
      },
    ],
  },
  {
    name: "BATH",
    children: [
      {
        name: "Vanities & Storage",
        children: [
          { name: "Single Vanities" },
          { name: "Double Vanities" },
          { name: "Bath Cabinets" },
          { name: "Medicine Cabinets" },
          { name: "Linen Towers" },
        ],
      },
      {
        name: "Mirrors & Lighting",
        children: [
          { name: "Bath Mirrors" },
          { name: "Vanity Lights" },
          { name: "Bath Sconces" },
          { name: "Flush Mount" },
        ],
      },
      {
        name: "Bath Hardware",
        children: [
          { name: "Towel Bars" },
          { name: "Towel Rings" },
          { name: "Robe Hooks" },
          { name: "Toilet Paper Holders" },
          { name: "Shower Rods" },
        ],
      },
      {
        name: "Bath Textiles",
        children: [
          { name: "Bath Towels" },
          { name: "Hand Towels" },
          { name: "Washcloths" },
          { name: "Bath Rugs" },
          { name: "Shower Curtains" },
        ],
      },
      {
        name: "Bath Accessories",
        children: [
          { name: "Soap Dispensers" },
          { name: "Trays & Organizers" },
          { name: "Bath Collections" },
          { name: "Wastebaskets" },
        ],
      },
    ],
  },
  {
    name: "OUTDOOR",
    children: [
      {
        name: "Seating",
        children: [
          { name: "Outdoor Sofas" },
          { name: "Outdoor Sectionals" },
          { name: "Outdoor Chairs" },
          { name: "Outdoor Chaises" },
          { name: "Outdoor Swings" },
          { name: "Outdoor Ottomans" },
        ],
      },
      {
        name: "Dining",
        children: [
          { name: "Outdoor Dining Sets" },
          { name: "Outdoor Dining Tables" },
          { name: "Outdoor Dining Chairs" },
          { name: "Outdoor Bar Stools" },
        ],
      },
      {
        name: "Tables & Accents",
        children: [
          { name: "Outdoor Coffee Tables" },
          { name: "Outdoor Side Tables" },
          { name: "Outdoor Consoles" },
          { name: "Outdoor Bars" },
        ],
      },
      {
        name: "Shade & Fire",
        children: [
          { name: "Umbrellas & Bases" },
          { name: "Fire Pits" },
          { name: "Fire Tables" },
          { name: "Heaters" },
          { name: "Pergolas & Canopies" },
        ],
      },
      {
        name: "Outdoor Décor",
        children: [
          { name: "Outdoor Rugs" },
          { name: "Outdoor Pillows" },
          { name: "Outdoor Lighting" },
          { name: "Planters & Garden" },
          { name: "Outdoor Accessories" },
        ],
      },
    ],
  },
  {
    name: "LIGHTING",
    children: [
      {
        name: "Ceiling",
        children: [
          { name: "Chandeliers" },
          { name: "Pendants" },
          { name: "Flush Mount" },
          { name: "Semi-Flush Mount" },
          { name: "Linear Suspension" },
        ],
      },
      {
        name: "Wall & Picture",
        children: [
          { name: "Wall Sconces" },
          { name: "Picture Lights" },
          { name: "Swing Arm Lamps" },
        ],
      },
      {
        name: "Table & Floor",
        children: [
          { name: "Table Lamps" },
          { name: "Floor Lamps" },
          { name: "Buffet Lamps" },
          { name: "Torchieres" },
        ],
      },
      {
        name: "Outdoor Lighting",
        children: [
          { name: "Outdoor Pendants" },
          { name: "Outdoor Wall Sconces" },
          { name: "Outdoor Flush Mount" },
          { name: "Landscape Lighting" },
          { name: "String Lights" },
        ],
      },
      {
        name: "Bath Lighting",
        children: [
          { name: "Vanity Lights" },
          { name: "Bath Sconces" },
          { name: "Bath Flush Mount" },
        ],
      },
    ],
  },
  {
    name: "TEXTILES",
    children: [
      {
        name: "Bedding",
        children: [
          { name: "Duvet Covers" },
          { name: "Sheets" },
          { name: "Pillowcases" },
          { name: "Shams" },
          { name: "Bed Skirts" },
          { name: "Comforters" },
          { name: "Bedding Collections" },
        ],
      },
      {
        name: "Pillows",
        children: [
          { name: "Bed Pillows" },
          { name: "Decorative Pillows" },
          { name: "Pillow Covers" },
          { name: "Pillow Inserts" },
        ],
      },
      {
        name: "Blankets & Throws",
        children: [
          { name: "Woven Throws" },
          { name: "Knit Throws" },
          { name: "Quilts" },
          { name: "Matelasse Coverlets" },
        ],
      },
      {
        name: "Window Treatments",
        children: [
          { name: "Drapery Panels" },
          { name: "Curtain Rods" },
          { name: "Curtain Hardware" },
          { name: "Shades & Blinds" },
        ],
      },
      {
        name: "Bath & Table Linens",
        children: [
          { name: "Bath Towels" },
          { name: "Table Linens" },
          { name: "Napkins" },
          { name: "Placemats" },
        ],
      },
    ],
  },
  {
    name: "RUGS",
    children: [
      {
        name: "By Size",
        children: [
          { name: "2x3" },
          { name: "3x5" },
          { name: "4x6" },
          { name: "5x8" },
          { name: "6x9" },
          { name: "8x10" },
          { name: "9x12" },
          { name: "10x14" },
          { name: "12x15 & Larger" },
        ],
      },
      {
        name: "By Style",
        children: [
          { name: "Solid" },
          { name: "Striped" },
          { name: "Geometric" },
          { name: "Floral & Botanical" },
          { name: "Abstract" },
          { name: "Vintage & Overdyed" },
          { name: "Natural Fiber" },
        ],
      },
      {
        name: "By Material",
        children: [
          { name: "Wool" },
          { name: "Cotton" },
          { name: "Silk" },
          { name: "Jute & Sisal" },
          { name: "Cowhide" },
          { name: "Synthetic" },
        ],
      },
      {
        name: "Outdoor Rugs",
        children: [
          { name: "Outdoor Solid" },
          { name: "Outdoor Patterned" },
          { name: "Outdoor Natural Fiber" },
        ],
      },
      {
        name: "Rug Accessories",
        children: [
          { name: "Rug Pads" },
          { name: "Custom Rugs" },
          { name: "Rug Cleaning" },
        ],
      },
    ],
  },
  {
    name: "DECOR",
    children: [
      {
        name: "Decorative Accessories",
        children: [
          { name: "Vases & Vessels" },
          { name: "Bowls & Trays" },
          { name: "Candles & Holders" },
          { name: "Sculptures & Objects" },
          { name: "Bookends" },
        ],
      },
      {
        name: "Wall Decor",
        children: [
          { name: "Art & Prints" },
          { name: "Wall Mirrors" },
          { name: "Wall Panels" },
          { name: "Wall Clocks" },
          { name: "Wall Sculptures" },
        ],
      },
      {
        name: "Mirrors",
        children: [
          { name: "Floor Mirrors" },
          { name: "Leaning Mirrors" },
          { name: "Decorative Mirrors" },
          { name: "Arch Mirrors" },
        ],
      },
      {
        name: "Books & Clocks",
        children: [
          { name: "Coffee Table Books" },
          { name: "Bookends" },
          { name: "Mantel Clocks" },
          { name: "Table Clocks" },
        ],
      },
      {
        name: "Seasonal",
        children: [
          { name: "Holiday Decor" },
          { name: "Seasonal Collections" },
          { name: "Entertaining Accessories" },
        ],
      },
    ],
  },
  {
    name: "BABY & CHILD",
    children: [
      {
        name: "Nursery",
        children: [
          { name: "Cribs" },
          { name: "Toddler Beds" },
          { name: "Dressers & Changing Tables" },
          { name: "Gliders & Rockers" },
          { name: "Nursery Decor" },
          { name: "Baby Monitors" },
        ],
      },
      {
        name: "Kids Bedroom",
        children: [
          { name: "Kids Beds" },
          { name: "Bunk Beds" },
          { name: "Loft Beds" },
          { name: "Kids Nightstands" },
          { name: "Kids Dressers" },
        ],
      },
      {
        name: "Kids Furniture",
        children: [
          { name: "Kids Desks" },
          { name: "Kids Chairs" },
          { name: "Kids Bookcases" },
          { name: "Kids Storage" },
          { name: "Kids Benches" },
        ],
      },
      {
        name: "Kids Textiles",
        children: [
          { name: "Baby Bedding" },
          { name: "Kids Bedding" },
          { name: "Kids Pillows" },
          { name: "Kids Throws" },
        ],
      },
      {
        name: "Kids Decor",
        children: [
          { name: "Kids Rugs" },
          { name: "Kids Lighting" },
          { name: "Nursery Art" },
          { name: "Kids Wall Decor" },
          { name: "Toy Storage" },
        ],
      },
    ],
  },
  {
    name: "TEEN",
    children: [
      {
        name: "Teen Bedroom",
        children: [
          { name: "Teen Beds" },
          { name: "Teen Headboards" },
          { name: "Teen Dressers" },
          { name: "Teen Nightstands" },
          { name: "Teen Benches" },
        ],
      },
      {
        name: "Teen Study",
        children: [
          { name: "Teen Desks" },
          { name: "Teen Desk Chairs" },
          { name: "Teen Bookcases" },
          { name: "Teen Shelving" },
        ],
      },
      {
        name: "Teen Style",
        children: [
          { name: "Teen Bedding" },
          { name: "Teen Pillows" },
          { name: "Teen Throws" },
          { name: "Teen Rugs" },
          { name: "Teen Lighting" },
          { name: "Teen Decor" },
        ],
      },
    ],
  },
  {
    name: "SALE",
    children: [
      {
        name: "Living Sale",
        children: [
          { name: "Sofas & Seating Sale" },
          { name: "Tables Sale" },
          { name: "Storage Sale" },
          { name: "Media Sale" },
        ],
      },
      {
        name: "Dining Sale",
        children: [
          { name: "Dining Tables Sale" },
          { name: "Dining Chairs Sale" },
          { name: "Bar Stools Sale" },
          { name: "Buffets Sale" },
        ],
      },
      {
        name: "Bed & Bath Sale",
        children: [
          { name: "Beds Sale" },
          { name: "Bedding Sale" },
          { name: "Bath Vanities Sale" },
          { name: "Bath Accessories Sale" },
        ],
      },
      {
        name: "Outdoor Sale",
        children: [
          { name: "Outdoor Seating Sale" },
          { name: "Outdoor Dining Sale" },
          { name: "Outdoor Decor Sale" },
        ],
      },
      {
        name: "Other Sale",
        children: [
          { name: "Lighting Sale" },
          { name: "Textiles Sale" },
          { name: "Rugs Sale" },
          { name: "Decor Sale" },
        ],
      },
    ],
  },
  {
    name: "CATALOGS",
    children: [
      { name: "Source Books" },
      { name: "Interiors" },
    ],
  },
]

const ADMIN_URL = process.env.MEDUSA_ADMIN_URL || "http://localhost:9000"
const TOKEN = process.env.MEDUSA_ADMIN_SECRET_KEY || ""

let successCount = 0
let failCount = 0
let skippedCount = 0

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

const adminHeaders = () => ({
  "content-type": "application/json",
  authorization: `Bearer ${TOKEN}`,
  "x-medusa-access-token": TOKEN,
})

async function findCategoryByHandle(
  handle: string,
  parentId: string | undefined
): Promise<{ id: string } | null> {
  const res = await fetch(
    `${ADMIN_URL}/admin/product-categories?handle=${encodeURIComponent(handle)}&limit=20`,
    { headers: adminHeaders() }
  )
  if (!res.ok) {
    return null
  }
  const json = (await res.json()) as {
    product_categories?: { id: string; parent_category_id?: string | null }[]
  }
  const list = json.product_categories ?? []
  const match = list.find((c) =>
    parentId
      ? c.parent_category_id === parentId
      : c.parent_category_id == null || c.parent_category_id === ""
  )
  return match ? { id: match.id } : list[0] ? { id: list[0].id } : null
}

async function createCategory(
  name: string,
  handle: string,
  parentId?: string
): Promise<string | null> {
  try {
    const existing = await findCategoryByHandle(handle, parentId)
    if (existing?.id) {
      const patchRes = await fetch(
        `${ADMIN_URL}/admin/product-categories/${existing.id}`,
        {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify({
            name,
            is_active: true,
            is_internal: false,
          }),
        }
      )
      if (patchRes.ok) {
        console.log(`♻️ ${name} (${handle}) -> activated / updated`)
        successCount++
        return existing.id
      }
      const errText = await patchRes.text()
      console.log(
        `⚠️ ${name} (${handle}) -> update ${patchRes.status} ${errText} (using existing id)`
      )
      return existing.id
    }

    const body: Record<string, unknown> = {
      name,
      handle,
      is_active: true,
      is_internal: false,
    }

    if (parentId) {
      body.parent_category_id = parentId
    }

    const res = await fetch(`${ADMIN_URL}/admin/product-categories`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.log(`❌ ${name} (${handle}) -> ${res.status} ${text}`)
      failCount++
      return null
    }

    const json = (await res.json()) as {
      product_category?: { id: string }
    }
    const id = json?.product_category?.id

    if (!id) {
      console.log(`❌ ${name} (${handle}) -> response missing id`)
      failCount++
      return null
    }

    console.log(`✅ ${name} (${handle})`)
    successCount++
    return id
  } catch (error) {
    console.log(`❌ ${name} (${handle}) -> ${String(error)}`)
    failCount++
    return null
  }
}

function countNodes(nodes: CategoryNode[]): number {
  return nodes.reduce((acc, n) => {
    return acc + 1 + countNodes(n.children ?? [])
  }, 0)
}

function markSkippedSubtree(nodes: CategoryNode[], baseHandle: string) {
  for (const node of nodes) {
    const handle = `${baseHandle}-${slugify(node.name)}`
    console.log(`❌ ${node.name} (${handle}) -> skipped (parent failed)`)
    skippedCount++
    if (node.children?.length) {
      markSkippedSubtree(node.children, handle)
    }
  }
}

async function seedNode(
  node: CategoryNode,
  parentId: string | undefined,
  parentHandle: string | undefined
) {
  const currentHandle = parentHandle
    ? `${parentHandle}-${slugify(node.name)}`
    : slugify(node.name)

  const createdId = await createCategory(node.name, currentHandle, parentId)

  if (!node.children?.length) {
    return
  }

  if (!createdId) {
    markSkippedSubtree(node.children, currentHandle)
    return
  }

  for (const child of node.children) {
    await seedNode(child, createdId, currentHandle)
  }
}

async function main() {
  if (!TOKEN) {
    console.error(
      "Missing MEDUSA_ADMIN_SECRET_KEY. Example: MEDUSA_ADMIN_SECRET_KEY=... npx ts-node scripts/seed-rh-categories.ts"
    )
    process.exit(1)
  }

  console.log("Seeding RH category hierarchy...")
  console.log(`Admin URL: ${ADMIN_URL}`)
  console.log(`Target categories: ${countNodes(TREE)}`)

  for (const top of TREE) {
    await seedNode(top, undefined, undefined)
  }

  console.log("\n---- Summary ----")
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`⏭️  Skipped: ${skippedCount}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
