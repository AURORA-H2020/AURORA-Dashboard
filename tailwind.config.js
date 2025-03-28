import headlessUiTailwind from "@headlessui/tailwindcss";
/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  // Tremor UI Styles
  transparent: "transparent",
  current: "currentColor",
  // Shadcn UI Styles
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      // Tremor UI Styles
      // light mode
      tremor: {
        brand: {
          faint: "#eff6ff", // blue-50
          muted: "#bfdbfe", // blue-200
          subtle: "#60a5fa", // blue-400
          DEFAULT: "hsl(var(--primary))",
          emphasis: "#1d4ed8", // blue-700
          inverted: "#ffffff", // white
        },
        background: {
          muted: "#f9fafb", // gray-50
          subtle: "#f3f4f6", // gray-100
          DEFAULT: "hsl(var(--background))", // white
          emphasis: "#374151", // gray-700
        },
        border: {
          DEFAULT: "hsl(var(--border))", // gray-200
        },
        ring: {
          DEFAULT: "hsl(var(--ring))", // gray-200
        },
        content: {
          subtle: "#9ca3af", // gray-400
          DEFAULT: "hsl(var(--foreground))", // gray-500
          emphasis: "#374151", // gray-700
          strong: "#111827", // gray-900
          inverted: "#ffffff", // white
        },
      },
      // Tremor UI Styles
      // dark mode
      "dark-tremor": {
        brand: {
          faint: "#0B1229", // custom
          muted: "#172554", // blue-950
          subtle: "#1e40af", // blue-800
          DEFAULT: "hsl(var(--primary))",
          emphasis: "#60a5fa", // blue-400
          inverted: "#030712", // gray-950
        },
        background: {
          muted: "#131A2B", // custom
          subtle: "#1f2937", // gray-800
          DEFAULT: "hsl(var(--background))",
          emphasis: "#d1d5db", // gray-300
        },
        border: {
          DEFAULT: "hsl(var(--border))",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
        },
        content: {
          subtle: "#4b5563", // gray-600
          DEFAULT: "hsl(var(--foreground))",
          emphasis: "#e5e7eb", // gray-200
          strong: "#f9fafb", // gray-50
          inverted: "#000000", // black
        },
      },

      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    boxShadow: {
      // Tremor UI Styles
      // light
      "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "tremor-card":
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "tremor-dropdown":
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      // dark
      "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "dark-tremor-card":
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "dark-tremor-dropdown":
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    borderRadius: {
      // Tremor UI Styles
      "tremor-small": "0.375rem",
      "tremor-default": "0.5rem",
      "tremor-full": "9999px",

      // Shadcn UI Styles
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    fontSize: {
      // Tremor UI Styles
      "tremor-label": ["0.75rem"],
      "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
      "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
      "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
};
export const safelist = [
  {
    pattern:
      /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"],
  },
  {
    pattern:
      /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"],
  },
  {
    pattern:
      /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"],
  },
  {
    pattern:
      /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  },
  {
    pattern:
      /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  },
  {
    pattern:
      /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  },
  ...[
    "[#306EBA]", // A+
    "[#42944A]", // A
    "[#6AAC46]", // B
    "[#CAD444]", // C
    "[#FCED4F]", // D
    "[#F1BD40]", // E
    "[#DC6E2D]", // F
    "[#D02E26]", // G
    "[#8F8E94]", // ? (no label)
    "[#FDDD09]", // electricity
    "[#1E84FD]", // transportation
    "[#F5473D]", // heating
  ].flatMap((customColor) => [
    `bg-${customColor}`,
    `border-${customColor}`,
    `hover:bg-${customColor}`,
    `hover:border-${customColor}`,
    `hover:text-${customColor}`,
    `fill-${customColor}`,
    `ring-${customColor}`,
    `stroke-${customColor}`,
    `text-${customColor}`,
    `ui-selected:bg-${customColor}`,
    `ui-selected:border-${customColor}`,
    `ui-selected:text-${customColor}`,
  ]),
];

export const plugins = [tailwindAnimate, headlessUiTailwind];
