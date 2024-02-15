import { mergeTests } from "@playwright/test"
import { fixtures } from "./fixtures"
import { accountFixtures } from "./fixtures/account"

export const test = mergeTests(fixtures, accountFixtures)
export { expect } from "@playwright/test"
