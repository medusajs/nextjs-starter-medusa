import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const TAG_MAP: Record<string, string> = {
  "api::rh-hero.rh-hero": "rh-hero",
  "api::rh-editorial-block.rh-editorial-block": "rh-editorial",
  "api::rh-category-grid.rh-category-grid": "rh-category-grid",
  "api::rh-membership.rh-membership": "rh-membership",
  "api::rh-navigation.rh-navigation": "rh-navigation",
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const model = body?.model as string | undefined

  revalidateTag("cms")
  const specificTag = model ? TAG_MAP[`api::${model}.${model}`] ?? model : undefined
  if (specificTag) {
    revalidateTag(specificTag)
  }

  return NextResponse.json({ revalidated: true, model, specificTag, at: Date.now() })
}
