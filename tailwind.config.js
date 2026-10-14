/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
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
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
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
// Colours used in dynamically built class names
export const safelist = [
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
    `text-${customColor}`,
  ]),
];

export const plugins = [tailwindAnimate];
