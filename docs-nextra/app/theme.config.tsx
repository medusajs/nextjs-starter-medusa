import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MySupplyCo Docs</span>,
  project: {
    link: 'https://github.com/your-org/msc-nextjs',
  },
  chat: {
    link: 'https://discord.gg/your-discord',
  },
  docsRepositoryBase: 'https://github.com/your-org/msc-nextjs/tree/main/docs-nextra',
  footer: {
    text: 'MySupplyCo Documentation © 2024',
  },
  search: {
    placeholder: 'Search documentation...'
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  gitTimestamp: 'Last updated on',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="MySupplyCo Documentation" />
      <meta property="og:description" content="Enhanced Medusa Next.js Starter Documentation" />
    </>
  )
}
export default config

