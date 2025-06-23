"use client"

import { useState } from "react"
import { themeService } from "@/src/services/theme.service"
import type { Theme, AIThemePrompt } from "@/src/types/themes"

export const useThemes = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAITheme = async (prompt: AIThemePrompt): Promise<Theme> => {
    setLoading(true)
    setError(null)

    try {
      const response = await themeService.generateAITheme(prompt)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate theme"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getThemes = async (category?: string, country?: string): Promise<Theme[]> => {
    setLoading(true)
    setError(null)

    try {
      return await themeService.getThemes(category, country)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch themes"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTheme = async (theme: Omit<Theme, "id" | "createdAt">): Promise<Theme> => {
    setLoading(true)
    setError(null)

    try {
      return await themeService.createTheme(theme)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create theme"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    generateAITheme,
    getThemes,
    createTheme,
    loading,
    error,
  }
}
