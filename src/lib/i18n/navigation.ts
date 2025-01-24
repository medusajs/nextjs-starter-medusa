import { createSharedPathnamesNavigation } from "next-intl/navigation"
import { intlConfig } from "./settings"

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(intlConfig)