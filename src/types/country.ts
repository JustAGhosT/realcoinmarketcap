export interface CountryInfo {
  code: string
  name: string
  nativeName: string
  flag: string
  currency: string
  languages: string[]
  timezone: string
  continent: string
  region: string
  coordinates: {
    lat: number
    lng: number
  }
  postalSystem: {
    established: string
    format: string
    hasStamps: boolean
    firstStamp?: string
  }
}

export interface CountryDetectionResult {
  country: CountryInfo
  confidence: number
  method: "ip" | "timezone" | "language" | "manual"
  timestamp: string
}

export interface CountrySpecificData {
  stamps: {
    totalIssued: number
    categories: string[]
    popularSeries: string[]
    rarities: string[]
    priceRanges: {
      common: { min: number; max: number }
      uncommon: { min: number; max: number }
      rare: { min: number; max: number }
      very_rare: { min: number; max: number }
    }
  }
  themes: {
    cultural: string[]
    historical: string[]
    natural: string[]
    architectural: string[]
  }
  marketplace: {
    preferredCurrency: string
    shippingZones: string[]
    taxRate: number
    popularPaymentMethods: string[]
  }
  localization: {
    dateFormat: string
    numberFormat: string
    addressFormat: string[]
    phoneFormat: string
  }
}

export interface CountryPreferences {
  autoDetect: boolean
  manualOverride?: string
  showLocalContent: boolean
  preferLocalCurrency: boolean
  enableShippingCalculation: boolean
  lastUpdated: string
}
