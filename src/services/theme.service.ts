import { BaseService } from "./base.service"
import type { Theme, AIThemePrompt, CountryData } from "@/src/types/themes"

export class ThemeService extends BaseService {
  async getThemes(category?: string, country?: string): Promise<Theme[]> {
    return this.get("/themes", { category, country })
  }

  async getTheme(id: string): Promise<Theme> {
    return this.get(`/themes/${id}`)
  }

  async createTheme(theme: Omit<Theme, "id" | "createdAt">): Promise<Theme> {
    return this.post("/themes", theme)
  }

  async updateTheme(id: string, theme: Partial<Theme>): Promise<Theme> {
    return this.put(`/themes/${id}`, theme)
  }

  async deleteTheme(id: string): Promise<void> {
    return this.delete(`/themes/${id}`)
  }

  async generateAITheme(prompt: AIThemePrompt): Promise<Theme> {
    return this.post("/themes/generate-ai", prompt)
  }

  async getCountryData(countryCode?: string): Promise<CountryData[]> {
    return this.get("/themes/countries", countryCode ? { code: countryCode } : undefined)
  }

  async importCountryThemes(countryCode: string): Promise<Theme[]> {
    return this.post(`/themes/import-country/${countryCode}`)
  }

  async previewTheme(theme: Partial<Theme>): Promise<{ css: string; preview: string }> {
    return this.post("/themes/preview", theme)
  }
}

// Export the service instance
export const themeService = new ThemeService()
