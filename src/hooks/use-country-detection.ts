"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type React from "react"
import { countryDetectionService } from "@/src/services/country-detection.service"
import type { CountryDetectionResult, CountrySpecificData, CountryPreferences } from "@/src/types/country"

interface CountryDetectionContextType {
  detectedCountry: CountryDetectionResult | null
  countryData: CountrySpecificData | null
  preferences: CountryPreferences
  loading: boolean
  error: string | null
  setManualCountry: (countryCode: string) => Promise<void>
  updatePreferences: (prefs: Partial<CountryPreferences>) => void
  refreshDetection: () => Promise<void>
  importCountryData: (source?: "restcountries" | "worldbank" | "custom") => Promise<void>
}

const CountryDetectionContext = createContext<CountryDetectionContextType | null>(null)

export const useCountryDetection = () => {
  const context = useContext(CountryDetectionContext)
  if (!context) {
    throw new Error("useCountryDetection must be used within CountryDetectionProvider")
  }
  return context
}

export const CountryDetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [detectedCountry, setDetectedCountry] = useState<CountryDetectionResult | null>(null)
  const [countryData, setCountryData] = useState<CountrySpecificData | null>(null)
  const [preferences, setPreferences] = useState<CountryPreferences>({
    autoDetect: true,
    showLocalContent: true,
    preferLocalCurrency: true,
    enableShippingCalculation: true,
    lastUpdated: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeCountryDetection()
  }, [])

  useEffect(() => {
    if (detectedCountry && preferences.showLocalContent) {
      loadCountrySpecificData(detectedCountry.country.code)
    }
  }, [detectedCountry, preferences.showLocalContent])

  const initializeCountryDetection = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load preferences
      const storedPrefs = loadStoredPreferences()
      setPreferences(storedPrefs)

      // Check for stored detection first
      const stored = countryDetectionService.getStoredCountryDetection()
      if (stored && storedPrefs.autoDetect) {
        setDetectedCountry(stored)
      }

      // Perform fresh detection if auto-detect is enabled
      if (storedPrefs.autoDetect) {
        const result = await countryDetectionService.detectUserCountry()
        setDetectedCountry(result)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Country detection failed"
      setError(errorMessage)
      console.error("Country detection initialization failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadCountrySpecificData = async (countryCode: string) => {
    try {
      const data = await countryDetectionService.getCountrySpecificData(countryCode)
      setCountryData(data)
    } catch (err) {
      console.error("Failed to load country-specific data:", err)
    }
  }

  const setManualCountry = async (countryCode: string) => {
    try {
      setLoading(true)
      setError(null)

      const result = await countryDetectionService.setManualCountry(countryCode)
      setDetectedCountry(result)

      // Update preferences to indicate manual override
      const updatedPrefs = {
        ...preferences,
        manualOverride: countryCode,
        lastUpdated: new Date().toISOString(),
      }
      setPreferences(updatedPrefs)
      savePreferences(updatedPrefs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set manual country"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = (prefs: Partial<CountryPreferences>) => {
    const updatedPrefs = {
      ...preferences,
      ...prefs,
      lastUpdated: new Date().toISOString(),
    }
    setPreferences(updatedPrefs)
    savePreferences(updatedPrefs)

    // Re-initialize if auto-detect setting changed
    if ("autoDetect" in prefs && prefs.autoDetect !== preferences.autoDetect) {
      initializeCountryDetection()
    }
  }

  const refreshDetection = async () => {
    try {
      setLoading(true)
      setError(null)

      // Clear cache and perform fresh detection
      const result = await countryDetectionService.detectUserCountry()
      setDetectedCountry(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh detection"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const importCountryData = async (source: "restcountries" | "worldbank" | "custom" = "restcountries") => {
    if (!detectedCountry) return

    try {
      setLoading(true)
      const data = await countryDetectionService.importCountryData(detectedCountry.country.code, source)
      setCountryData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to import country data"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loadStoredPreferences = (): CountryPreferences => {
    if (typeof window === "undefined") {
      return {
        autoDetect: true,
        showLocalContent: true,
        preferLocalCurrency: true,
        enableShippingCalculation: true,
        lastUpdated: new Date().toISOString(),
      }
    }

    try {
      const stored = localStorage.getItem("country-preferences")
      return stored
        ? JSON.parse(stored)
        : {
            autoDetect: true,
            showLocalContent: true,
            preferLocalCurrency: true,
            enableShippingCalculation: true,
            lastUpdated: new Date().toISOString(),
          }
    } catch (error) {
      console.error("Failed to load stored preferences:", error)
      return {
        autoDetect: true,
        showLocalContent: true,
        preferLocalCurrency: true,
        enableShippingCalculation: true,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  const savePreferences = (prefs: CountryPreferences) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("country-preferences", JSON.stringify(prefs))
    }
  }

  return (
    <CountryDetectionContext.Provider
      value={{
        detectedCountry,
        countryData,
        preferences,
        loading,
        error,
        setManualCountry,
        updatePreferences,
        refreshDetection,
        importCountryData,
      }}
    >
      {children}
    </CountryDetectionContext.Provider>
  )
}
