// src/constants/theme.js

import { Platform } from "react-native";

export const colors = {
  // Brand
  primary: "#2B4C7E",        // deep navy - primary brand/action color
  primaryDark: "#1D3659",
  primaryLight: "#E3EAF3",

  // Accent - used sparingly: ratings, highlights, the one hero moment per screen
  accent: "#D98E3C",
  accentLight: "#FBF0DF",

  // Status colors
  success: "#5B8C6E",
  successLight: "#E6EFE9",
  warning: "#D98E3C",
  warningLight: "#FBF0DF",
  danger: "#C65D4B",
  dangerLight: "#F7E7E3",

  // Neutrals
  background: "#F5F3EE",     // warm canvas, not clinical white
  surface: "#FFFFFF",
  surfaceAlt: "#EFEBE3",     // slightly deeper warm tone, for subtle section separation
  border: "#E2DDD2",

  textPrimary: "#1B2430",    // ink
  textSecondary: "#5C6472",
  textMuted: "#8A8F98",
  white: "#FFFFFF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 4,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

// Serif for headings/display (editorial, academic feel) + clean sans for body/data.
// Uses platform system fonts so nothing needs to be installed or loaded.
export const fonts = {
  heading: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia",
  }),
  body: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 19,
  xl: 23,
  xxl: 29,
  xxxl: 36,
};

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

// Helper: pick a status color based on a percentage value (used for attendance/marks)
export const getStatusColor = (value, goodThreshold = 80, okThreshold = 75) => {
  if (value >= goodThreshold) return colors.success;
  if (value >= okThreshold) return colors.warning;
  return colors.danger;
};