export type MenuChild = { title: string; href: string; description?: string }
export type MenuItem = { key: string; label: string; href?: string; children?: MenuChild[] }
export type MenuSection = { title: string; items: MenuChild[] }

export const motionMenuData: MenuItem[] = [
  {
    key: 'menu',
    label: 'Menu',
  },
  {
    key: 'demo',
    label: 'Demo',
  },
]

// Expanded sections for slide-out drawer content
export const motionMenuSections: MenuSection[] = [
  {
    title: 'Menu',
    items: [
      { title: 'Home', href: '/' },
      { title: 'Store', href: '/store' },
      { title: 'Account', href: '/account' },
      { title: 'Cart', href: '/cart' },
      { title: 'Content Aware Demo', href: '/content-aware' },
      { title: 'Motion Presets', href: '/motion' },
    ],
  },
]

export const motionDemoItems: MenuChild[] = [
  { title: 'Content Aware Demo', href: '/content-aware', description: 'Adaptive layout based on content width' },
  { title: 'Motion Presets', href: '/motion', description: 'Shared animation tokens & presets' },
]


