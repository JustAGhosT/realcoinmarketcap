import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const { code } = params

  // Mock country data - in production, this would come from a database or external API
  const countryData = {
    ZA: {
      code: "ZA",
      name: "South Africa",
      nativeName: "South Africa",
      flag: "🇿🇦",
      currency: "ZAR",
      languages: ["en", "af", "zu", "xh", "st", "tn", "ss", "ve", "ts", "nr", "nso"],
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

  const country = countryData[code as keyof typeof countryData]

  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 })
  }

  return NextResponse.json(country)
}
