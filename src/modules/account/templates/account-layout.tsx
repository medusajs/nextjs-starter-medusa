"use client"

import React from "react"

import { useI18n, useScopedI18n, I18nProviderClient, useCurrentLocale } from '../../../locales/client'

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { Customer } from "@medusajs/medusa"

interface AccountLayoutProps {
  customer: Omit<Customer, "password_hash"> | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const t = useScopedI18n("account")

  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">{t("question")}</h3>
            <span className="txt-medium">{t("question_desc")}</span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">{t("service")}</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
