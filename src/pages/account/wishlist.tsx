import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import Layout from "@modules/layout/templates"
import { GetStaticProps, NextPage } from "next"
import React from "react"
import { SiteProps } from "types/global"

const Wishlist: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <AccountLayout>Wishlist</AccountLayout>
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

export default Wishlist
