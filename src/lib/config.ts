import Medusa from "@medusajs/medusa-js"
import fetchAdapter from "@vespaiach/axios-fetch-adapter"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  axiosAdapter: fetchAdapter,
  maxRetries: 3,
})
