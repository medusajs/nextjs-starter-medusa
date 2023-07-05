const MEDUSA_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_API_KEY || ""
const REVALIDATE_WINDOW = process.env.REVALIDATE_WINDOW || "60*60"
const ENDPOINT =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default async function medusaRequest(
  method: string,
  path = "",
  payload?: Record<string, string> | undefined
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-publishable-key": MEDUSA_API_KEY,
    },
    next: { revalidate: parseInt(REVALIDATE_WINDOW) },
  }

  if (payload) {
    if (method === "POST") {
      options.body = JSON.stringify(payload)
    }
    if (method === "GET") {
      // if the path has a query string, append the payload to it. if not, create a new query string
      const pathWithQuery = path.includes("?")
        ? `${path}&${new URLSearchParams(payload).toString()}`
        : `${path}?${new URLSearchParams(payload).toString()}`
      path = pathWithQuery
    }
  }

  try {
    const result = await fetch(`${ENDPOINT}/store${path}`, options)
    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (error: any) {
    throw {
      error: error.message,
    }
  }
}
