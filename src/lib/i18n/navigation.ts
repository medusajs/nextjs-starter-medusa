import { createSharedPathnamesNavigation } from "next-intl/navigation"
import { routing } from "./settings"

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)