/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base colors (neutral palette)
        base: {
          0: "var(--color-base-00)",
          5: "var(--color-base-05)",
          10: "var(--color-base-10)",
          20: "var(--color-base-20)",
          25: "var(--color-base-25)",
          30: "var(--color-base-30)",
          35: "var(--color-base-35)",
          40: "var(--color-base-40)",
          50: "var(--color-base-50)",
          60: "var(--color-base-60)",
          70: "var(--color-base-70)",
          100: "var(--color-base-100)",
        },

        // Extended colors
        "obsidian-red": "var(--color-red)",
        "obsidian-orange": "var(--color-orange)",
        "obsidian-yellow": "var(--color-yellow)",
        "obsidian-green": "var(--color-green)",
        "obsidian-cyan": "var(--color-cyan)",
        "obsidian-blue": "var(--color-blue)",
        "obsidian-purple": "var(--color-purple)",
        "obsidian-pink": "var(--color-pink)",

        // Background/Surface colors
        "bg-primary": "var(--background-primary)",
        "bg-primary-alt": "var(--background-primary-alt)",
        "bg-secondary": "var(--background-secondary)",
        "bg-secondary-alt": "var(--background-secondary-alt)",

        // Background modifiers
        "bg-hover": "var(--background-modifier-hover)",
        "bg-active-hover": "var(--background-modifier-active-hover)",
        "bg-border": "var(--background-modifier-border)",
        "bg-border-hover": "var(--background-modifier-border-hover)",
        "bg-border-focus": "var(--background-modifier-border-focus)",
        "bg-error": "var(--background-modifier-error)",
        "bg-error-hover": "var(--background-modifier-error-hover)",
        "bg-success": "var(--background-modifier-success)",
        "bg-message": "var(--background-modifier-message)",
        "bg-form-field": "var(--background-modifier-form-field)",

        // Interactive colors
        interactive: "var(--interactive-normal)",
        "interactive-hover": "var(--interactive-hover)",
        "interactive-accent": "var(--interactive-accent)",
        "interactive-accent-hover": "var(--interactive-accent-hover)",

        // Text colors
        "text-normal": "var(--text-normal)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",
        "text-on-accent": "var(--text-on-accent)",
        "text-on-accent-inverted": "var(--text-on-accent-inverted)",
        "text-success": "var(--text-success)",
        "text-warning": "var(--text-warning)",
        "text-error": "var(--text-error)",
        "text-accent": "var(--text-accent)",
        "text-accent-hover": "var(--text-accent-hover)",

        // Text backgrounds
        "text-selection": "var(--text-selection)",
        "text-highlight": "var(--text-highlight-bg)",
      },
      fontFamily: {
        text: "var(--font-text)",
        monospace: "var(--font-monospace)",
        interface: "var(--font-interface)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflict with Obsidian styles
  },
};
