import { getSiteData } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"
import ProfileTemplate from "@modules/account/templates/profile-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps } from "next"
import { ReactElement } from "react"
import { NextPageWithLayout, SiteProps } from "types/global"

const Account: NextPageWithLayout<SiteProps> = ({ site }) => {
  return <ProfileTemplate />
}

Account.getLayout = (page: ReactElement) => {
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

export default Account
