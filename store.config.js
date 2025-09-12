/** @type {import('./src/lib/config/types').StoreConfig} */

const storeConfig = {
    // Feature flags for optional companion panels
    featureFlags: {
        aiCompanion: true,
        helpCompanion: true
    },

    // Layout and UI options
    layoutOptions: {
        maxVisibleButtons: 3,
        showLabels: false,
        showIcons: true,
        defaultPanelWidth: 400,
        maxPanelHistory: 10,
    },

    // Global system settings
    globalSettings: {
        enableKeyboardShortcuts: true,
        enableGestures: true,
        enableAnalytics: true,
    },

    // Development options
    development: {
        enableDebugMode: false,
        showPanelDemoButtons: false,
        logStateChanges: false,
    },

    // Product gallery configuration
    productGallery: {
        // gallery variants
        breakpoints: {
            mobile: 'mobile-carousel', // 'mobile-carousel'
            desktop: 'desktop-adaptive-grid', // 'desktop-hero-grid' | 'desktop-carousel-grid' | 'desktop-adaptive-grid'
        },
        lightbox: true,
        desktopInteraction: 'hybrid', // 'promote' | 'lightbox' | 'hybrid'
        showExpandIcon: true,
        motion: {
            promoteMs: 200,
        }
    },
}

module.exports = storeConfig