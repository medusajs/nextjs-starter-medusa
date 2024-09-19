import { Metadata } from "next"

import { getI18n } from "../../../../../locales/server"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "page.login.title",
  description: "page.login.desc",
}

export default async function Login() {
  const t = await getI18n()
  metadata.title = t("page.login.title")
  metadata.description = t("page.login.desc")

  return <LoginTemplate />
}
