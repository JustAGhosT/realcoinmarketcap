"use client"

import type React from "react"
import { useState } from "react"
import { useThemes } from "@/src/hooks/use-themes"
import { useI18n } from "@/src/hooks/use-i18n"
import type { AIThemePrompt, ThemeCategory } from "@/src/types/themes"
import styles from "./theme-generator.module.css"

export const ThemeGenerator: React.FC = () => {
  const { generateAITheme, loading } = useThemes()
  const { t } = useI18n()
  const [prompt, setPrompt] = useState<AIThemePrompt>({
    category: "country-specific",
    mood: "professional",
    inspiration: "",
    targetAudience: "collectors",
  })
  const [generatedTheme, setGeneratedTheme] = useState(null)

  const categories: ThemeCategory[] = [
    "country-specific",
    "cross-country",
    "historical",
    "modern",
    "artistic",
    "minimalist",
    "vintage",
    "cultural",
    "seasonal",
    "custom",
  ]

  const moods = [
    "professional",
    "elegant",
    "vibrant",
    "minimalist",
    "vintage",
    "modern",
    "cultural",
    "festive",
    "sophisticated",
    "playful",
  ]

  const countries = [
    { code: "za", name: "South Africa" },
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "jp", name: "Japan" },
    { code: "cn", name: "China" },
    { code: "br", name: "Brazil" },
    { code: "in", name: "India" },
    { code: "au", name: "Australia" },
  ]

  const handleGenerate = async () => {
    try {
      const theme = await generateAITheme(prompt)
      setGeneratedTheme(theme)
    } catch (error) {
      console.error("Failed to generate theme:", error)
    }
  }

  const handleInputChange = (field: keyof AIThemePrompt, value: any) => {
    setPrompt((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.generator}>
      <div className={styles.header}>
        <h2>{t("themes.generateWithAI")}</h2>
        <p>Create custom themes using AI based on your preferences</p>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category">{t("themes.themeCategories")}</label>
          <select
            id="category"
            value={prompt.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={styles.select}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {prompt.category === "country-specific" && (
          <div className={styles.formGroup}>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={prompt.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className={styles.select}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="mood">Mood & Style</label>
          <select
            id="mood"
            value={prompt.mood}
            onChange={(e) => handleInputChange("mood", e.target.value)}
            className={styles.select}
          >
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="inspiration">Inspiration & Keywords</label>
          <textarea
            id="inspiration"
            value={prompt.inspiration}
            onChange={(e) => handleInputChange("inspiration", e.target.value)}
            placeholder="Describe what inspires this theme (e.g., 'African sunset colors', 'Victorian elegance', 'Modern minimalism')"
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="audience">Target Audience</label>
          <input
            type="text"
            id="audience"
            value={prompt.targetAudience}
            onChange={(e) => handleInputChange("targetAudience", e.target.value)}
            placeholder="e.g., serious collectors, casual enthusiasts, young collectors"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Preferred Colors (optional)</label>
          <ColorPicker colors={prompt.colors || []} onChange={(colors) => handleInputChange("colors", colors)} />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.inspiration.trim()}
          className={styles.generateButton}
        >
          {loading ? "Generating..." : "Generate AI Theme"}
        </button>
      </div>

      {generatedTheme && <ThemePreview theme={generatedTheme} onSave={() => {}} />}
    </div>
  )
}

interface ColorPickerProps {
  colors: string[]
  onChange: (colors: string[]) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onChange }) => {
  const [newColor, setNewColor] = useState("#3730a3")

  const addColor = () => {
    if (!colors.includes(newColor)) {
      onChange([...colors, newColor])
    }
  }

  const removeColor = (colorToRemove: string) => {
    onChange(colors.filter((color) => color !== colorToRemove))
  }

  return (
    <div className={styles.colorPicker}>
      <div className={styles.colorList}>
        {colors.map((color) => (
          <div key={color} className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ backgroundColor: color }} />
            <span>{color}</span>
            <button onClick={() => removeColor(color)} className={styles.removeColor}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.addColor}>
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className={styles.colorInput}
        />
        <button onClick={addColor} className={styles.addButton}>
          Add Color
        </button>
      </div>
    </div>
  )
}

interface ThemePreviewProps {
  theme: any
  onSave: () => void
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, onSave }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.previewHeader}>
        <h3>Generated Theme: {theme.name}</h3>
        <button onClick={onSave} className={styles.saveButton}>
          Save Theme
        </button>
      </div>

      <div className={styles.previewContent}>
        <div className={styles.colorPalette}>
          <h4>Color Palette</h4>
          <div className={styles.colors}>
            {Object.entries(theme.colors).map(([name, color]) => (
              <div key={name} className={styles.colorPreview}>
                <div className={styles.colorBlock} style={{ backgroundColor: color as string }} />
                <span>{name}</span>
                <code>{color as string}</code>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mockup}>
          <div
            className={styles.mockupCard}
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }}
          >
            <h4 style={{ color: theme.colors.primary }}>Sample Stamp Card</h4>
            <p style={{ color: theme.colors.textSecondary }}>This is how your stamps will look with this theme</p>
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface,
              }}
            >
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
