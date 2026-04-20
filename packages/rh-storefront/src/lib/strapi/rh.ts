import { fetchStrapi } from "./client"
import type { RHEditorialBlock, RHHero } from "@workspace/shared-types"

export const getRHHero = () =>
  fetchStrapi<RHHero>("/api/rh-hero?populate=*", { tags: ["rh-hero"] })

export const getEditorialBlocks = () =>
  fetchStrapi<RHEditorialBlock[]>(
    "/api/rh-editorial-blocks?populate=*&sort=order:asc",
    { tags: ["rh-editorial"] }
  )
