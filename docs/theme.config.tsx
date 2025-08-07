import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MySupplyCo Docs</span>,
  project: {
    link: 'https://github.com/your-org/msc-nextjs',
  },
  docsRepositoryBase: 'https://github.com/your-org/msc-nextjs/tree/main/docs-nextra',
  footer: {
    text: 'MySupplyCo Documentation © 2024',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MySupplyCo Docs'
    }
  }
}

export default config