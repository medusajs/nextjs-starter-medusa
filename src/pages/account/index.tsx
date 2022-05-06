import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import AccountTemplate from "@modules/account/templates/account-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps, NextPage } from "next"
import React from "react"
import { SiteProps } from "types/global"

const Account: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <AccountLayout>
        <AccountTemplate />
      </AccountLayout>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<SiteProps> = async () => {
  const data = await getSiteData()

  return {
    props: {
      ...data,
    },
  }
}

export default Account
