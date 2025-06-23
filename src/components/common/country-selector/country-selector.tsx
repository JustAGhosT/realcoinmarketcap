"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCountryDetection } from "@/src/hooks/use-country-detection"
import { useI18n } from "@/src/hooks/use-i18n"
import styles from "./country-selector.module.css"

interface Country {
  code: string
  name: string
  flag: string
}

export const CountrySelector: React.FC = () => {
  const { detectedCountry, setManualCountry, preferences, updatePreferences, loading } = useCountryDetection()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      const response = await fetch("/api/countries")
      if (response.ok) {
        const data = await response.json()
        setCountries(data.countries)
      }
    } catch (error) {
      console.error("Failed to load countries:", error)
      // Fallback countries
      setCountries([
        { code: "ZA", name: "South Africa", flag: "🇿🇦" },
        { code: "US", name: "United States", flag: "🇺🇸" },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
        { code: "DE", name: "Germany", flag: "🇩🇪" },
        { code: "FR", name: "France", flag: "🇫🇷" },
        { code: "JP", name: "Japan", flag: "🇯🇵" },
        { code: "AU", name: "Australia", flag: "🇦🇺" },
        { code: "CA", name: "Canada", flag: "🇨🇦" },
      ])
    }
  }

  const handleCountrySelect = async (countryCode: string) => {
    try {
      await setManualCountry(countryCode)
      setIsOpen(false)
      setSearchTerm("")
    } catch (error) {
      console.error("Failed to set country:", error)
    }
  }

  const toggleAutoDetect = () => {
    updatePreferences({ autoDetect: !preferences.autoDetect })
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDetectionMethodLabel = (method: string) => {
    switch (method) {
      case "ip":
        return "Detected by IP"
      case "timezone":
        return "Detected by timezone"
      case "language":
        return "Detected by language"
      case "manual":
        return "Manually selected"
      default:
        return "Unknown"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "#10b981" // green
    if (confidence >= 0.6) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  if (loading) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonFlag}></div>
        <div className={styles.skeletonText}></div>
      </div>
    )
  }

  return (
    <div className={styles.selector}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.flag}>{detectedCountry?.country.flag || "🌍"}</span>
        <div className={styles.countryInfo}>
          <span className={styles.countryName}>{detectedCountry?.country.name || "Unknown"}</span>
          {detectedCountry && (
            <span className={styles.detectionInfo}>
              {getDetectionMethodLabel(detectedCountry.method)}
              <span className={styles.confidence} style={{ color: getConfidenceColor(detectedCountry.confidence) }}>
                ({Math.round(detectedCountry.confidence * 100)}%)
              </span>
            </span>
          )}
        </div>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <label className={styles.autoDetectToggle}>
              <input type="checkbox" checked={preferences.autoDetect} onChange={toggleAutoDetect} />
              <span>Auto-detect location</span>
            </label>
          </div>

          <div className={styles.countryList} role="listbox">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`${styles.countryOption} ${
                  country.code === detectedCountry?.country.code ? styles.selected : ""
                }`}
                role="option"
                aria-selected={country.code === detectedCountry?.country.code}
              >
                <span className={styles.flag}>{country.flag}</span>
                <span className={styles.countryName}>{country.name}</span>
                {country.code === detectedCountry?.country.code && (
                  <svg className={styles.checkmark} fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {detectedCountry && (
            <div className={styles.detectionDetails}>
              <h4>Detection Details</h4>
              <div className={styles.detailRow}>
                <span>Method:</span>
                <span>{getDetectionMethodLabel(detectedCountry.method)}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Confidence:</span>
                <span style={{ color: getConfidenceColor(detectedCountry.confidence) }}>
                  {Math.round(detectedCountry.confidence * 100)}%
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>Detected:</span>
                <span>{new Date(detectedCountry.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  )
}
