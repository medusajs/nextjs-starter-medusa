import { Metadata } from "next"
import { store } from "@config"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${store.name} account.`,
}

export default function Login() {
  return <LoginTemplate />
}
