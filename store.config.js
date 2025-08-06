/** @type {import('./src/lib/config/types').StoreConfig} */
const storeConfig = {
    // Feature flags for optional companion panels
    featureFlags: {
        aiCompanion: true,
        helpCompanion: false
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
}

module.exports = storeConfig