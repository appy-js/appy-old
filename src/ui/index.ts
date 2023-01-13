/// <reference types="./index.d.ts" />
export const BUTTON_TYPES = ["button", "reset", "submit"];
export type ButtonType = typeof BUTTON_TYPES[number];

export const BUTTON_VARIANTS = [
  "default",
  "filled",
  "gradient",
  "light",
  "outline",
  "subtle",
  "white",
] as const;
export type ButtonVariant = typeof BUTTON_VARIANTS[number];

export const COLORS = [
  "beryl",
  "blue",
  "brown",
  "crimson",
  "cyan",
  "fade",
  "fuchsia",
  "gold",
  "grass",
  "gray",
  "green",
  "indigo",
  "orange",
  "pink",
  "purple",
  "red",
  "sky",
  "teal",
  "violet",
  "yellow",
] as const;
export type Color = typeof COLORS[number];

export const COLOR_SCHEMES = ["dark", "light"] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

export const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
export type Size = typeof SIZES[number];

export interface Props<T = HTMLElement> {
  element?: T;
}

export const theme: Theme = {
  activeClasses: "translateY(1px)",
  colorScheme: "light",
  focusRing: "auto",
  fontFamily: "sans",
  fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
  inputSizes: { xs: 30, sm: 36, md: 42, lg: 50, xl: 60 },
  primaryColor: "green",
  radiusSizes: { xs: 2, sm: 4, md: 8, lg: 16, xl: 32 },
};
export interface Theme {
  activeClasses: string;
  colorScheme: ColorScheme;
  focusRing: "auto" | "always" | "never";
  fontFamily: string;
  primaryColor: Color;
  fontSizes: Record<Size, number>;
  inputSizes: Record<Size, number>;
  radiusSizes: Record<Size, number>;
}

export { clsx } from "./utils.ts";

export { default as Button } from "./components/Button.svelte";
export { default as Loader } from "./components/Loader.svelte";
