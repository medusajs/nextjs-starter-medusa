import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import AddressesTemplate from "@modules/account/templates/addresses-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps } from "next"
import { ReactElement } from "react"
import { NextPageWithLayout, SiteProps } from "types/global"

const Addresses: NextPageWithLayout = () => {
  return <AddressesTemplate />
}

Addresses.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <AccountLayout>{page}</AccountLayout>
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

export default Addresses
