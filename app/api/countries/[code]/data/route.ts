import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const { code } = params

  // Mock country-specific data
  const countrySpecificData = {
    ZA: {
      stamps: {
        totalIssued: 2500,
        categories: ["Definitive", "Commemorative", "Wildlife", "Heritage", "Sports"],
        popularSeries: ["Big Five", "Heritage Sites", "Mandela Series", "Freedom Series"],
        rarities: ["common", "uncommon", "rare", "very_rare"],
        priceRanges: {
          common: { min: 5, max: 25 },
          uncommon: { min: 25, max: 100 },
          rare: { min: 100, max: 500 },
          very_rare: { min: 500, max: 5000 },
        },
      },
      themes: {
        cultural: ["Traditional Art", "Music", "Dance", "Festivals"],
        historical: ["Apartheid Era", "Freedom Struggle", "Colonial Period"],
        natural: ["Kruger Park", "Table Mountain", "Drakensberg"],
        architectural: ["Cape Dutch", "Art Deco", "Modern"],
      },
      marketplace: {
        preferredCurrency: "ZAR",
        shippingZones: ["SADC", "Africa", "International"],
        taxRate: 0.15,
        popularPaymentMethods: ["card", "eft", "paypal"],
      },
      localization: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "en-ZA",
        addressFormat: ["street", "suburb", "city", "province", "postal_code"],
        phoneFormat: "+27 ## ### ####",
      },
    },
    US: {
      stamps: {
        totalIssued: 5000,
        categories: ["Definitive", "Commemorative", "Special Delivery", "Airmail"],
        popularSeries: ["Presidents", "National Parks", "Space Program", "Civil Rights"],
        rarities: ["common", "uncommon", "rare", "very_rare"],
        priceRanges: {
          common: { min: 1, max: 10 },
          uncommon: { min: 10, max: 50 },
          rare: { min: 50, max: 500 },
          very_rare: { min: 500, max: 10000 },
        },
      },
      themes: {
        cultural: ["Native American", "Jazz", "Hollywood", "Baseball"],
        historical: ["Civil War", "Independence", "World Wars", "Civil Rights"],
        natural: ["Yellowstone", "Grand Canyon", "Everglades"],
        architectural: ["Skyscrapers", "Colonial", "Art Deco", "Modern"],
      },
      marketplace: {
        preferredCurrency: "USD",
        shippingZones: ["Domestic", "Canada", "International"],
        taxRate: 0.08,
        popularPaymentMethods: ["card", "paypal", "apple_pay", "google_pay"],
      },
      localization: {
        dateFormat: "MM/DD/YYYY",
        numberFormat: "en-US",
        addressFormat: ["street", "city", "state", "zip"],
        phoneFormat: "+1 (###) ###-####",
      },
    },
  }

  const data = countrySpecificData[code as keyof typeof countrySpecificData]

  if (!data) {
    return NextResponse.json({ error: "Country data not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
