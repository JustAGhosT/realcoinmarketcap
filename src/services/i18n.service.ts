import { BaseService } from "./base.service"
import type { SupportedLanguage, TranslationKeys, LanguageConfig } from "@/src/types/i18n"

export class I18nService extends BaseService {
  private translations: Map<SupportedLanguage, TranslationKeys> = new Map()
  private currentLanguage: SupportedLanguage = "en"

  async loadTranslations(language: SupportedLanguage): Promise<TranslationKeys> {
    if (this.translations.has(language)) {
      return this.translations.get(language)!
    }

    try {
      const translations = await this.get<TranslationKeys>(`/i18n/${language}`)
      this.translations.set(language, translations)
      return translations
    } catch (error) {
      console.warn(`Failed to load translations for ${language}, falling back to English`)

      // Fallback translations
      const fallbackTranslations: TranslationKeys = {
        common: {
          loading: "Loading",
          error: "Error",
          success: "Success",
          cancel: "Cancel",
          confirm: "Confirm",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          create: "Create",
          search: "Search",
          filter: "Filter",
          sort: "Sort",
          next: "Next",
          previous: "Previous",
          close: "Close",
        },
        navigation: {
          home: "Home",
          marketplace: "Marketplace",
          collection: "My Collection",
          themes: "Themes",
          nft: "NFT",
          profile: "Profile",
          settings: "Settings",
        },
        stamps: {
          title: "Title",
          description: "Description",
          category: "Category",
          rarity: "Rarity",
          condition: "Condition",
          price: "Price",
          addToCollection: "Add to Collection",
          mintAsNFT: "Mint as NFT",
        },
        themes: {
          createTheme: "Create Theme",
          generateWithAI: "Generate with AI",
          customizeTheme: "Customize Theme",
          previewTheme: "Preview Theme",
          saveTheme: "Save Theme",
          themeCategories: "Theme Categories",
        },
        nft: {
          mint: "Mint",
          transfer: "Transfer",
          list: "List for Sale",
          buy: "Buy",
          collection: "NFT Collection",
          marketplace: "NFT Marketplace",
        },
      }

      this.translations.set(language, fallbackTranslations)
      return fallbackTranslations
    }
  }

  async setLanguage(language: SupportedLanguage): Promise<void> {
    this.currentLanguage = language
    await this.loadTranslations(language)

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", language)
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage
  }

  getTranslation(key: string): string {
    const translations = this.translations.get(this.currentLanguage)
    if (!translations) return key

    const keys = key.split(".")
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }

    return value || key
  }

  async getSupportedLanguages(): Promise<LanguageConfig[]> {
    try {
      const response = await this.get<{ languages: LanguageConfig[] }>("/i18n/languages")
      return response.languages
    } catch (error) {
      console.warn("Failed to load supported languages, using fallback")
      // Fallback languages
      return [
        { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", rtl: false },
        { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", rtl: false },
        { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", rtl: false },
        { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
        { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
        { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
        { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
      ]
    }
  }

  detectBrowserLanguage(): SupportedLanguage {
    if (typeof window === "undefined") return "en"

    const stored = localStorage.getItem("preferred-language") as SupportedLanguage
    if (stored) return stored

    const browserLang = navigator.language.split("-")[0] as SupportedLanguage
    const supported: SupportedLanguage[] = [
      "en",
      "af",
      "zu",
      "xh",
      "st",
      "tn",
      "ss",
      "ve",
      "ts",
      "nr",
      "nso",
      "es",
      "fr",
      "de",
      "pt",
      "zh",
      "ja",
      "ko",
      "ar",
      "hi",
      "ru",
    ]

    return supported.includes(browserLang) ? browserLang : "en"
  }
}

// Export the service instance
export const i18nService = new I18nService()
