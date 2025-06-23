"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { i18nService } from "@/src/services/i18n.service"
import type { SupportedLanguage, LanguageConfig } from "@/src/types/i18n"

interface I18nContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => Promise<void>
  t: (key: string, params?: Record<string, string>) => string
  languages: LanguageConfig[]
  isRTL: boolean
  loading: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<SupportedLanguage>("en")
  const [languages, setLanguages] = useState<LanguageConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeI18n()
  }, [])

  const initializeI18n = async () => {
    try {
      // Load supported languages first
      const supportedLanguages = await i18nService.getSupportedLanguages()
      setLanguages(supportedLanguages)

      // Detect browser language
      const detectedLang = i18nService.detectBrowserLanguage()

      // Set initial language
      await setLanguage(detectedLang)
    } catch (error) {
      console.error("Failed to initialize i18n:", error)
      // Set fallback values
      setLanguages([{ code: "en", name: "English", nativeName: "English", flag: "🇺🇸", rtl: false }])
      setCurrentLanguage("en")
    } finally {
      setLoading(false)
    }
  }

  const setLanguage = async (lang: SupportedLanguage) => {
    try {
      await i18nService.setLanguage(lang)
      setCurrentLanguage(lang)

      // Update document direction for RTL languages only if languages array is available
      if (languages.length > 0) {
        const langConfig = languages.find((l) => l.code === lang)
        if (langConfig?.rtl) {
          document.documentElement.dir = "rtl"
        } else {
          document.documentElement.dir = "ltr"
        }
      }
    } catch (error) {
      console.error("Failed to set language:", error)
    }
  }

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = i18nService.getTranslation(key)

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value)
      })
    }

    return translation
  }

  // Safely check for RTL with fallback
  const isRTL = languages.length > 0 ? languages.find((l) => l.code === language)?.rtl || false : false

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages,
        isRTL,
        loading,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
