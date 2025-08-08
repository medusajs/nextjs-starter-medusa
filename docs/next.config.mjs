import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  search: { codeblocks: false },
  defaultShowCopyCode: true
})

export default withNextra({
  images: { unoptimized: true }
})