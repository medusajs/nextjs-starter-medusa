import { mergeTests } from "@playwright/test"
import { fixtures, authFixtures } from "./fixtures"
import { accountFixtures } from "./fixtures/account"

export const publicTest = mergeTests(fixtures, accountFixtures)
export const authTest = mergeTests(authFixtures, fixtures, accountFixtures)
export { expect } from "@playwright/test"
