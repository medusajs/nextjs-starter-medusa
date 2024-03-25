import { test as setup } from "@playwright/test"
import { seedData } from "../../data/seed"

setup("Seed data", async () => {
  await seedData()
})
