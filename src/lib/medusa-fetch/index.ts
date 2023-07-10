const MEDUSA_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_API_KEY || ""
const REVALIDATE_WINDOW = process.env.REVALIDATE_WINDOW || "60*1000*10" // 10 minutes
const ENDPOINT =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default async function medusaRequest(
  method: string,
  path = "",
  payload?: Record<string, any> | undefined
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
    if ("body" in payload) {
      options.body = JSON.stringify(payload.body)
    }
    if ("query" in payload) {
      const queries = parseArrays(payload.query)
      path = `${path}?${new URLSearchParams(queries).toString()}`
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

const parseArrays = (obj: Record<string, any>) => {
  const result = {} as Record<string, any>
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[`${key}[]`] = value.join(",")
      return
    }
    result[key] = value
  })
  return result
}
