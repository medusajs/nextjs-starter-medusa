import axios, { AxiosError } from "axios"

export async function seedData() {
  return {
    user: await seedUser(),
  }
}

function getUrl(path: string) {
  const baseUrl = process.env.CLIENT_SERVER || "http://localhost:9000"
  const url = new URL(path, baseUrl)
  return url.toString()
}

async function seedUser() {
  const user = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password",
  }
  try {
    await axios.post(getUrl("/store/customers"), user)
    return user
  } catch (e: unknown) {
    e = e as AxiosError
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
