import OldMedusa from "@medusajs/medusa-js"
import NewMedusa from "./sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const medusaClient = new OldMedusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
})

export const newClient = new NewMedusa({
  baseUrl: MEDUSA_BACKEND_URL,
})
