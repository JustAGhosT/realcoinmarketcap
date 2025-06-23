import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { verifyAuth } from "@/src/lib/auth"
import type { AIThemePrompt, Theme } from "@/src/types/themes"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const prompt: AIThemePrompt = await request.json()

    const aiPrompt = `
Create a custom theme for a stamp collection platform based on these requirements:
- Category: ${prompt.category}
- Country: ${prompt.country || "Global"}
- Mood: ${prompt.mood}
- Colors: ${prompt.colors?.join(", ") || "Any"}
- Inspiration: ${prompt.inspiration}
- Target Audience: ${prompt.targetAudience}

Generate a complete theme configuration with:
1. A creative name and description
2. Color palette (primary, secondary, accent, background, surface, text colors)
3. Typography settings (font families, sizes, weights)
4. Spacing values
5. Cultural elements if country-specific
6. Tags for categorization

Return the response as a JSON object matching the Theme interface structure.
Focus on creating a cohesive, culturally appropriate, and visually appealing theme.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: aiPrompt,
    })

    // Parse AI response and create theme
    let aiTheme: any
    try {
      aiTheme = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      aiTheme = createFallbackTheme(prompt)
    }

    const theme: Theme = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: aiTheme.name || `${prompt.category} Theme`,
      description: aiTheme.description || `AI-generated theme for ${prompt.category}`,
      category: prompt.category,
      country: prompt.country,
      colors: aiTheme.colors || getDefaultColors(prompt),
      typography: aiTheme.typography || getDefaultTypography(),
      spacing: aiTheme.spacing || getDefaultSpacing(),
      isCustom: true,
      isAIGenerated: true,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      tags: aiTheme.tags || [prompt.category, prompt.mood, ...(prompt.colors || [])],
    }

    return NextResponse.json({ theme })
  } catch (error) {
    console.error("AI theme generation error:", error)
    return NextResponse.json({ error: "Failed to generate theme" }, { status: 500 })
  }
}

function createFallbackTheme(prompt: AIThemePrompt): any {
  const countryColors = getCountryColors(prompt.country)

  return {
    name: `${prompt.country || "Global"} ${prompt.category} Theme`,
    description: `A ${prompt.mood} theme inspired by ${prompt.inspiration}`,
    colors: {
      primary: countryColors.primary,
      secondary: countryColors.secondary,
      accent: countryColors.accent,
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    typography: getDefaultTypography(),
    spacing: getDefaultSpacing(),
    tags: [prompt.category, prompt.mood, prompt.country || "global"],
  }
}

function getCountryColors(country?: string) {
  const countryColorMap: Record<string, any> = {
    "south-africa": { primary: "#007749", secondary: "#ffb612", accent: "#de3831" },
    "united-states": { primary: "#002868", secondary: "#bf0a30", accent: "#ffffff" },
    "united-kingdom": { primary: "#012169", secondary: "#c8102e", accent: "#ffffff" },
    germany: { primary: "#000000", secondary: "#dd0000", accent: "#ffce00" },
    france: { primary: "#0055a4", secondary: "#ffffff", accent: "#ef4135" },
    japan: { primary: "#bc002d", secondary: "#ffffff", accent: "#000000" },
    china: { primary: "#de2910", secondary: "#ffde00", accent: "#000000" },
  }

  return (
    countryColorMap[country?.toLowerCase() || "global"] || {
      primary: "#3730a3",
      secondary: "#7c3aed",
      accent: "#06b6d4",
    }
  )
}

function getDefaultColors(prompt: AIThemePrompt) {
  return {
    primary: "#3730a3",
    secondary: "#7c3aed",
    accent: "#06b6d4",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  }
}

function getDefaultTypography() {
  return {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFont: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  }
}

function getDefaultSpacing() {
  return {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  }
}
