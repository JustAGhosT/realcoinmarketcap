export interface Theme {
  id: string
  name: string
  description: string
  category: ThemeCategory
  country?: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  isCustom: boolean
  isAIGenerated: boolean
  createdBy?: string
  createdAt: string
  tags: string[]
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeTypography {
  fontFamily: string
  headingFont: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    "2xl": string
    "3xl": string
    "4xl": string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  "2xl": string
  "3xl": string
  "4xl": string
}

export type ThemeCategory =
  | "country-specific"
  | "cross-country"
  | "historical"
  | "modern"
  | "artistic"
  | "minimalist"
  | "vintage"
  | "cultural"
  | "seasonal"
  | "custom"

export interface AIThemePrompt {
  category: ThemeCategory
  country?: string
  mood: string
  colors?: string[]
  inspiration: string
  targetAudience: string
}

export interface CountryData {
  code: string
  name: string
  flag: string
  currency: string
  postalHistory: string[]
  culturalElements: string[]
  colors: string[]
  stamps: {
    totalIssued: number
    firstIssue: string
    specialSeries: string[]
  }
}
