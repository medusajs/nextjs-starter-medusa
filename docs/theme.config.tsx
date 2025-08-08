import React from 'react'
import { DocsThemeConfig, ThemeSwitch } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MySupplyCo Docs</span>,
  project: {
    link: 'https://github.com/your-org/msc-nextjs',
  },
  // Updated to correct docs folder
  docsRepositoryBase: 'https://github.com/your-org/msc-nextjs/tree/main/docs',
  footer: {
    text: 'MySupplyCo Documentation © 2024',
  },
  // Enable floating ToC like Next.js / SWR
  toc: {
    float: true,
    title: 'On this page',
    extraContent: null
  },
  // Remove emojis and tighten typography
  themeSwitch: {
    useOptions() {
      return {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      }
    }
  },
  // Customize navbar: put theme switch on the right by default
  navbar: {
    extraContent: <ThemeSwitch />
  },
  editLink: {
    text: 'Edit this page on GitHub'
  },
  feedback: {
    content: null
  },
  search: {
    codeblocks: false
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MySupplyCo Docs'
    }
  }
}

export default config