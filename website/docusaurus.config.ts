import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Enhanced Medusa Next.js Starter',
  tagline: 'Revolutionary e-commerce with AI-Powered Companion Panel System',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // SEO and metadata
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'medusa, nextjs, ecommerce, companion panels, ai shopping, storefront, react',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
  ],

  // Set the production url of your site here
  url: 'https://nextjs-medusa-builder-and-companion.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For Vercel deployment, it is typically '/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'medusajs', // Usually your GitHub org/user name.
  projectName: 'nextjs-starter-medusa', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/medusajs/nextjs-starter-medusa/tree/main/website/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: true,
          // Add docs-only mode for better SEO
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          readingTime: ({content, frontMatter, defaultReadingTime}) =>
            defaultReadingTime({content, options: {wordsPerMinute: 300}}),
          feedOptions: {
            type: ['rss', 'atom'],
            title: 'Enhanced Medusa Next.js Starter Blog',
            description: 'Latest updates and guides for the Companion Panel System',
            copyright: `Copyright © ${new Date().getFullYear()} Medusa. Built with Docusaurus.`,
            language: 'en',
          },
          editUrl: 'https://github.com/medusajs/nextjs-starter-medusa/tree/main/website/',
          // Blog best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          blogTitle: 'Changelog & Updates',
          blogDescription: 'Stay up to date with the latest features and improvements',
          postsPerPage: 10,
          blogSidebarTitle: 'Recent updates',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-XXXXXXXXXX', // Replace with your Google Analytics ID
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Add search functionality
    [
      require.resolve('@docusaurus/plugin-content-docs'),
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebarsApi.js'),
        editUrl: 'https://github.com/medusajs/nextjs-starter-medusa/tree/main/website/',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/medusa-social-card.jpg',
    metadata: [
      {name: 'keywords', content: 'medusa, nextjs, ecommerce, companion panels, ai shopping'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Enhanced Medusa Starter',
      logo: {
        alt: 'Medusa Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'companionSidebar',
          position: 'left',
          label: 'Companion Panel',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {to: '/blog', label: 'Changelog', position: 'left'},
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://your-store.com',
          label: 'Live Demo',
          position: 'right',
        },
        {
          href: 'https://github.com/medusajs/nextjs-starter-medusa',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration',
            },
            {
              label: 'Companion Panel System',
              to: '/docs/companion-panel',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/xpCwq3Kfn8',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/medusajs/nextjs-starter-medusa',
            },
            {
              label: 'Medusa Website',
              href: 'https://medusajs.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Live Demo',
              href: 'https://your-store.com',
            },
            {
              label: 'Medusa Documentation',
              href: 'https://docs.medusajs.com/',
            },
            {
              label: 'Next.js Documentation',
              href: 'https://nextjs.org/docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Medusa. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json', 'javascript', 'typescript', 'jsx', 'tsx'],
    },
    // Add Algolia search (configure with your own keys)
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'medusa-companion-panels',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    // Add announcement bar for important updates
    announcementBar: {
      id: 'v1.1.0-release',
      content: '🎉 <strong>v1.1.0 is out!</strong> Check out the new UX enhancements and navigation improvements. <a href="/blog/ux-enhancement-release-v1.1.0">Read more →</a>',
      backgroundColor: '#20232a',
      textColor: '#fff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
