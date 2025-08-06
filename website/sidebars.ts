import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docsSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/overview',
        'configuration/environment-setup',
        'configuration/feature-flags',
        'configuration/examples',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/overview',
        'development/setup',
        'development/testing',
        'development/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/overview',
        'components/layout',
        'components/ui',
      ],
    },
    {
      type: 'category',
      label: 'Integration',
      items: [
        'integration/builder-io',
        'integration/stripe',
        'integration/medusa',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/common-issues',
        'troubleshooting/debugging',
        'troubleshooting/faq',
      ],
    },
  ],

  // Companion Panel System sidebar
  companionSidebar: [
    'companion-panel/overview',
    'companion-panel/architecture',
    {
      type: 'category',
      label: 'Features',
      items: [
        'companion-panel/ai-assistant',
        'companion-panel/help-system',
        'companion-panel/cart-management',
        'companion-panel/product-filters',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'companion-panel/config-overview',
        'companion-panel/feature-toggles',
        'companion-panel/customization',
      ],
    },
    'companion-panel/api-reference',
  ],

  // Guides sidebar
  guidesSidebar: [
    'guides/overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'guides/quick-start',
        'guides/first-customization',
        'guides/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'guides/custom-components',
        'guides/state-management',
        'guides/performance-optimization',
      ],
    },
    {
      type: 'category',
      label: 'Integration Guides',
      items: [
        'guides/builder-integration',
        'guides/payment-setup',
        'guides/content-management',
      ],
    },
  ],
};

export default sidebars;
