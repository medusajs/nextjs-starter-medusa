import axios, { AxiosError, AxiosInstance } from "axios"

axios.defaults.baseURL = process.env.CLIENT_SERVER || "http://localhost:9000"
let region = undefined as any

export async function seedData() {
  const axios = getOrInitAxios()
  return {
    user: await seedUser(),
  }
}

export async function seedUser(email?: string, password?: string) {
  const user = {
    first_name: "Test",
    last_name: "User",
    email: email || "test@example.com",
    password: password || "password",
  }
  try {
    await axios.post("/store/customers", user)
    return user
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status) {
        const status = e.response.status
        // https://docs.medusajs.com/api/store#customers_postcustomers
        if (status === 422) {
          return user
        }
      }
      throw e
    }
  }
}

async function loadRegion(axios: AxiosInstance) {
  const resp = await axios.get("/admin/regions")
  region = resp.data.regions.filter((r: any) => r.currency_code === "usd")[0]
}

async function getOrInitAxios(axios?: AxiosInstance) {
  if (!axios) {
    axios = await loginAdmin()
  }
  if (!region) {
    await loadRegion(axios)
  }
  return axios
}

export async function seedGiftcard(axios?: AxiosInstance) {
  axios = await getOrInitAxios(axios)
  const resp = await axios.post("/admin/gift-cards", {
    region_id: region.id,
    value: 10000,
  })
  resp.data.gift_card.amount = resp.data.gift_card.value.toString()
  return resp.data.gift_card as {
    id: string
    code: string
    value: number
    amount: string
    balance: string
  }
}

export async function seedDiscount(axios?: AxiosInstance) {
  axios = await getOrInitAxios(axios)
  const amount = 2000
  const resp = await axios.post("/admin/discounts", {
    code: "TEST_DISCOUNT_FIXED",
    regions: [region.id],
    rule: {
      type: "fixed",
      value: amount,
      allocation: "total",
    },
  })
  const discount = resp.data.discount
  return {
    id: discount.id,
    code: discount.code,
    rule_id: discount.rule_id,
    amount,
  }
}

async function loginAdmin() {
  const resp = await axios.post("/admin/auth/token", {
    email: process.env.MEDUSA_ADMIN_EMAIL || "admin@medusa-test.com",
    password: process.env.MEDUSA_ADMIN_PASSWORD || "supersecret",
  })
  if (resp.status !== 200) {
    throw { error: "must be able to log in user" }
  }
  return axios.create({
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  })
}
