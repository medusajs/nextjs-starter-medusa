const BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
const TOKEN = process.env.STRAPI_API_TOKEN

export class StrapiError extends Error {
  constructor(
    public path: string,
    public status: number,
    public body: string
  ) {
    super(`Strapi ${status} on ${path}: ${body}`)
  }
}

type FetchOpts = {
  tags?: string[]
  revalidate?: number
}

export async function fetchStrapi<T>(
  path: string,
  opts: FetchOpts = {}
): Promise<T | null> {
  if (!TOKEN) {
    console.warn("[strapi] STRAPI_API_TOKEN missing; returning null")
    return null
  }

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { tags: ["cms", ...(opts.tags ?? [])], revalidate: opts.revalidate ?? 60 },
    })

    if (!res.ok) {
      const body = await res.text()
      throw new StrapiError(path, res.status, body)
    }

    const json = await res.json()
    return json.data as T
  } catch (e) {
    console.warn("[strapi] fetch failed, degrading:", e)
    return null
  }
}
