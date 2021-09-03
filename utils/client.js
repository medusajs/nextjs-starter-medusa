import Medusa from "@medusajs/medusa-js";

const BACKEND_URL = process.env.GATSBY_STORE_URL || "http://localhost:9000";

export const createClient = () => new Medusa({ baseUrl: BACKEND_URL });
