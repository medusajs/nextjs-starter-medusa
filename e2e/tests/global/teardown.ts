import { test as teardown } from "@playwright/test"
import { dropTemplate, resetDatabase } from "../../data/reset"

teardown("Reset the database and the drop the template database", async () => {
  await resetDatabase()
  await dropTemplate()
})
