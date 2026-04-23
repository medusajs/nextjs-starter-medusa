const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      colors: {
        "qw-black": "#000000",
        "qw-charcoal": "#1A1A1A",
        "qw-dark-grey": "#333333",
        "qw-medium-grey": "#666666",
        "qw-grey": "#999999",
        "qw-light-grey": "#CCCCCC",
        "qw-pale-grey": "#E8E8E8",
        "qw-off-white": "#F5F5F0",
        "qw-warm-white": "#FAF9F6",
        "qw-white": "#FFFFFF",
        "qw-gold": "#B8860B",
        "qw-error": "#C41E3A",
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      spacing: {
        "qw-1": "0.25rem",
        "qw-2": "0.5rem",
        "qw-3": "0.75rem",
        "qw-4": "1rem",
        "qw-5": "1.25rem",
        "qw-6": "1.5rem",
        "qw-7": "1.75rem",
        "qw-8": "2rem",
        "qw-9": "2.25rem",
        "qw-10": "2.5rem",
        "qw-11": "2.75rem",
        "qw-12": "3rem",
        "qw-13": "3.25rem",
        "qw-14": "3.5rem",
        "qw-15": "3.75rem",
        "qw-16": "4rem",
        "qw-17": "4.25rem",
        "qw-18": "4.5rem",
        "qw-19": "4.75rem",
        "qw-20": "5rem",
        "qw-21": "5.25rem",
        "qw-22": "5.5rem",
        "qw-23": "5.75rem",
        "qw-24": "6rem",
      },
      maxWidth: {
        "8xl": "100rem",
        /** RH body shell cap */
        body: "2560px",
      },
      screens: {
        small: "768px",
        medium: "1024px",
        large: "1440px",
        xlarge: "1680px",
        "2xsmall": "320px",
        xsmall: "512px",
        "2xlarge": "1920px",
      },
      fontSize: {
        micro: ["10px", { lineHeight: "14px" }],
        caption: ["12px", { lineHeight: "16px" }],
        body: ["14px", { lineHeight: "20px" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "card-title": ["20px", { lineHeight: "28px" }],
        "section-title": ["32px", { lineHeight: "40px" }],
        hero: ["48px", { lineHeight: "56px" }],
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
