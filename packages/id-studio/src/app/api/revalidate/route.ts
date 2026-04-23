import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const TAG_MAP: Record<string, string> = {
  "api::ids-project.ids-project": "ids-projects",
  "api::ids-news.ids-news": "ids-news",
  "api::ids-about.ids-about": "ids-about",
  "api::ids-team.ids-team": "ids-team",
  "api::ids-service.ids-service": "ids-service",
  "api::ids-navigation.ids-navigation": "ids-navigation",
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const model = body?.model as string | undefined

  revalidateTag("cms", "max")
  const specificTag = model ? TAG_MAP[`api::${model}.${model}`] ?? model : undefined
  if (specificTag) {
    revalidateTag(specificTag, "max")
  }

  return NextResponse.json({ revalidated: true, model, specificTag, at: Date.now() })
}
