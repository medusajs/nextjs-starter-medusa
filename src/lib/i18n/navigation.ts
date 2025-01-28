import { createNavigation } from "next-intl/navigation"
import { routing } from "./settings"

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)