import { BaseService } from "./base.service"
import type { CountryInfo, CountryDetectionResult, CountrySpecificData } from "@/src/types/country"

export class CountryDetectionService extends BaseService {
  private detectionCache: Map<string, CountryDetectionResult> = new Map()
  private countryDataCache: Map<string, CountrySpecificData> = new Map()

  async detectUserCountry(): Promise<CountryDetectionResult> {
    const cacheKey = "user-country-detection"

    // Check cache first
    if (this.detectionCache.has(cacheKey)) {
      const cached = this.detectionCache.get(cacheKey)!
      // Use cached result if less than 24 hours old
      if (Date.now() - new Date(cached.timestamp).getTime() < 24 * 60 * 60 * 1000) {
        return cached
      }
    }

    try {
      // Try multiple detection methods in order of reliability
      const results = await Promise.allSettled([this.detectByIP(), this.detectByTimezone(), this.detectByLanguage()])

      // Find the best result
      let bestResult: CountryDetectionResult | null = null
      let highestConfidence = 0

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.confidence > highestConfidence) {
          bestResult = result.value
          highestConfidence = result.value.confidence
        }
      }

      if (!bestResult) {
        // Fallback to default
        bestResult = await this.getDefaultCountry()
      }

      // Cache the result
      this.detectionCache.set(cacheKey, bestResult)

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("detected-country", JSON.stringify(bestResult))
      }

      return bestResult
    } catch (error) {
      console.error("Country detection failed:", error)
      return this.getDefaultCountry()
    }
  }

  private async detectByIP(): Promise<CountryDetectionResult> {
    try {
      // Use multiple IP geolocation services for redundancy
      const services = ["https://ipapi.co/json/", "https://ip-api.com/json/", "https://ipinfo.io/json"]

      for (const serviceUrl of services) {
        try {
          const response = await fetch(serviceUrl)
          if (!response.ok) continue

          const data = await response.json()
          const countryCode = data.country_code || data.countryCode || data.country

          if (countryCode) {
            const countryInfo = await this.getCountryInfo(countryCode)
            return {
              country: countryInfo,
              confidence: 0.9,
              method: "ip",
              timestamp: new Date().toISOString(),
            }
          }
        } catch (serviceError) {
          console.warn(`IP detection service failed: ${serviceUrl}`, serviceError)
          continue
        }
      }

      throw new Error("All IP detection services failed")
    } catch (error) {
      throw new Error("IP-based detection failed")
    }
  }

  private async detectByTimezone(): Promise<CountryDetectionResult> {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const countryCode = this.timezoneToCountry(timezone)

      if (countryCode) {
        const countryInfo = await this.getCountryInfo(countryCode)
        return {
          country: countryInfo,
          confidence: 0.7,
          method: "timezone",
          timestamp: new Date().toISOString(),
        }
      }

      throw new Error("Could not determine country from timezone")
    } catch (error) {
      throw new Error("Timezone-based detection failed")
    }
  }

  private async detectByLanguage(): Promise<CountryDetectionResult> {
    try {
      const languages = navigator.languages || [navigator.language]
      const primaryLanguage = languages[0]

      // Extract country code from language tag (e.g., en-US -> US)
      const match = primaryLanguage.match(/^[a-z]{2}-([A-Z]{2})$/)
      if (match) {
        const countryCode = match[1]
        const countryInfo = await this.getCountryInfo(countryCode)
        return {
          country: countryInfo,
          confidence: 0.5,
          method: "language",
          timestamp: new Date().toISOString(),
        }
      }

      throw new Error("Could not determine country from language")
    } catch (error) {
      throw new Error("Language-based detection failed")
    }
  }

  private timezoneToCountry(timezone: string): string | null {
    const timezoneMap: Record<string, string> = {
      "Africa/Johannesburg": "ZA",
      "America/New_York": "US",
      "America/Los_Angeles": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "Europe/London": "GB",
      "Europe/Paris": "FR",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Madrid": "ES",
      "Asia/Tokyo": "JP",
      "Asia/Shanghai": "CN",
      "Asia/Kolkata": "IN",
      "Australia/Sydney": "AU",
      "Australia/Melbourne": "AU",
      // Add more timezone mappings as needed
    }

    return timezoneMap[timezone] || null
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    try {
      const response = await this.get<CountryInfo>(`/countries/${countryCode}`)
      return response
    } catch (error) {
      // Fallback to basic country info
      return this.getBasicCountryInfo(countryCode)
    }
  }

  private getBasicCountryInfo(countryCode: string): CountryInfo {
    const basicCountries: Record<string, CountryInfo> = {
      ZA: {
        code: "ZA",
        name: "South Africa",
        nativeName: "South Africa",
        flag: "🇿🇦",
        currency: "ZAR",
        languages: ["en", "af", "zu", "xh"],
        timezone: "Africa/Johannesburg",
        continent: "Africa",
        region: "Southern Africa",
        coordinates: { lat: -30.5595, lng: 22.9375 },
        postalSystem: {
          established: "1910",
          format: "####",
          hasStamps: true,
          firstStamp: "1910-09-04",
        },
      },
      US: {
        code: "US",
        name: "United States",
        nativeName: "United States",
        flag: "🇺🇸",
        currency: "USD",
        languages: ["en"],
        timezone: "America/New_York",
        continent: "North America",
        region: "Northern America",
        coordinates: { lat: 37.0902, lng: -95.7129 },
        postalSystem: {
          established: "1775",
          format: "#####",
          hasStamps: true,
          firstStamp: "1847-07-01",
        },
      },
      GB: {
        code: "GB",
        name: "United Kingdom",
        nativeName: "United Kingdom",
        flag: "🇬🇧",
        currency: "GBP",
        languages: ["en"],
        timezone: "Europe/London",
        continent: "Europe",
        region: "Northern Europe",
        coordinates: { lat: 55.3781, lng: -3.436 },
        postalSystem: {
          established: "1840",
          format: "AA## #AA",
          hasStamps: true,
          firstStamp: "1840-05-06",
        },
      },
    }

    return basicCountries[countryCode] || basicCountries["US"]
  }

  private async getDefaultCountry(): Promise<CountryDetectionResult> {
    const defaultCountryInfo = this.getBasicCountryInfo("ZA") // Default to South Africa
    return {
      country: defaultCountryInfo,
      confidence: 0.1,
      method: "manual",
      timestamp: new Date().toISOString(),
    }
  }

  async getCountrySpecificData(countryCode: string): Promise<CountrySpecificData> {
    if (this.countryDataCache.has(countryCode)) {
      return this.countryDataCache.get(countryCode)!
    }

    try {
      const data = await this.get<CountrySpecificData>(`/countries/${countryCode}/data`)
      this.countryDataCache.set(countryCode, data)
      return data
    } catch (error) {
      console.warn(`Failed to load country-specific data for ${countryCode}`, error)
      return this.getDefaultCountryData()
    }
  }

  private getDefaultCountryData(): CountrySpecificData {
    return {
      stamps: {
        totalIssued: 0,
        categories: ["Definitive", "Commemorative", "Wildlife"],
        popularSeries: [],
        rarities: ["common", "uncommon", "rare", "very_rare"],
        priceRanges: {
          common: { min: 1, max: 10 },
          uncommon: { min: 10, max: 50 },
          rare: { min: 50, max: 200 },
          very_rare: { min: 200, max: 1000 },
        },
      },
      themes: {
        cultural: [],
        historical: [],
        natural: [],
        architectural: [],
      },
      marketplace: {
        preferredCurrency: "USD",
        shippingZones: [],
        taxRate: 0,
        popularPaymentMethods: ["card", "paypal"],
      },
      localization: {
        dateFormat: "MM/DD/YYYY",
        numberFormat: "en-US",
        addressFormat: ["street", "city", "state", "zip"],
        phoneFormat: "+1 (###) ###-####",
      },
    }
  }

  async setManualCountry(countryCode: string): Promise<CountryDetectionResult> {
    const countryInfo = await this.getCountryInfo(countryCode)
    const result: CountryDetectionResult = {
      country: countryInfo,
      confidence: 1.0,
      method: "manual",
      timestamp: new Date().toISOString(),
    }

    // Update cache and storage
    this.detectionCache.set("user-country-detection", result)
    if (typeof window !== "undefined") {
      localStorage.setItem("detected-country", JSON.stringify(result))
    }

    return result
  }

  getStoredCountryDetection(): CountryDetectionResult | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem("detected-country")
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Failed to parse stored country detection:", error)
      return null
    }
  }

  async importCountryData(
    countryCode: string,
    source: "restcountries" | "worldbank" | "custom" = "restcountries",
  ): Promise<CountrySpecificData> {
    try {
      const response = await this.post(`/countries/${countryCode}/import`, { source })
      this.countryDataCache.set(countryCode, response)
      return response
    } catch (error) {
      console.error(`Failed to import country data for ${countryCode}:`, error)
      throw error
    }
  }
}

// Export the service instance
export const countryDetectionService = new CountryDetectionService()
