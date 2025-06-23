"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Theme } from "@/src/types/themes"

type ColorScheme = "light" | "dark" | "system"

interface ThemeContextType {
  currentTheme: Theme | null
  colorScheme: ColorScheme
  isDark: boolean
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  applyTheme: (theme: Theme) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("system")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    initializeTheme()
  }, [])

  useEffect(() => {
    updateColorScheme()
  }, [colorScheme])

  const initializeTheme = () => {
    // Load saved theme and color scheme
    const savedTheme = localStorage.getItem("selected-theme")
    const savedColorScheme = (localStorage.getItem("color-scheme") as ColorScheme) || "system"

    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme)
        setCurrentTheme(theme)
        applyTheme(theme)
      } catch (error) {
        console.error("Failed to load saved theme:", error)
      }
    }

    setColorSchemeState(savedColorScheme)
  }

  const updateColorScheme = () => {
    let isDarkMode = false

    if (colorScheme === "system") {
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      isDarkMode = colorScheme === "dark"
    }

    setIsDark(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)

    // Apply theme with current color scheme
    if (currentTheme) {
      applyThemeWithColorScheme(currentTheme, isDarkMode)
    }
  }

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem("selected-theme", JSON.stringify(theme))
  }

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
    localStorage.setItem("color-scheme", scheme)
  }

  const applyTheme = (theme: Theme) => {
    applyThemeWithColorScheme(theme, isDark)
  }

  const applyThemeWithColorScheme = (theme: Theme, dark: boolean) => {
    const root = document.documentElement
    const colors = dark ? getDarkColors(theme.colors) : theme.colors

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value)
    })

    // Apply typography
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value)
    })

    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString())
    })

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    // Apply fonts
    root.style.setProperty("--font-family", theme.typography.fontFamily)
    root.style.setProperty("--font-family-heading", theme.typography.headingFont)
  }

  const getDarkColors = (lightColors: any) => {
    // Generate dark mode variants
    return {
      ...lightColors,
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#cbd5e1",
      border: "#334155",
    }
  }

  const resetTheme = () => {
    setCurrentTheme(null)
    localStorage.removeItem("selected-theme")

    // Reset CSS custom properties
    const root = document.documentElement
    const properties = Array.from(root.style).filter(
      (prop) => prop.startsWith("--color-") || prop.startsWith("--font-") || prop.startsWith("--spacing-"),
    )
    properties.forEach((prop) => root.style.removeProperty(prop))
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        colorScheme,
        isDark,
        setTheme,
        setColorScheme,
        applyTheme,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
