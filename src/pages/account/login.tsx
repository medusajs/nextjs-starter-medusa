import { getSiteData } from "@lib/data"
import LoginTemplate from "@modules/account/templates/login-template"
import Layout from "@modules/layout/templates"
import { GetStaticProps, NextPage } from "next"
import React from "react"
import { SiteProps } from "types/global"

const Login: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <LoginTemplate />
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

export default Login
