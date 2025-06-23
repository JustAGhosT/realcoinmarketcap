import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Coins API called")

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL not found")
      return NextResponse.json(
        {
          error: "Database not configured",
          coins: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
        { status: 500 },
      )
    }

    // Import neon dynamically to catch import errors
    let sql
    try {
      const { neon } = await import("@neondatabase/serverless")
      sql = neon(process.env.DATABASE_URL)
      console.log("✅ Neon imported successfully")
    } catch (importError) {
      console.error("❌ Failed to import neon:", importError)
      return NextResponse.json(
        {
          error: "Database driver import failed",
          details: importError instanceof Error ? importError.message : "Unknown import error",
          coins: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
        { status: 500 },
      )
    }

    // Test basic connection
    try {
      const testResult = await sql`SELECT 1 as test`
      console.log("✅ Database connection test passed:", testResult)
    } catch (connectionError) {
      console.error("❌ Database connection failed:", connectionError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: connectionError instanceof Error ? connectionError.message : "Unknown connection error",
          coins: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
        { status: 500 },
      )
    }

    // For now, let's return mock data to test the frontend
    const mockCoins = [
      {
        id: 1,
        name: "Morgan Silver Dollar",
        description: "Classic American silver dollar featuring Lady Liberty",
        country: "United States",
        category: "Silver Dollar",
        year: 1921,
        denomination: "$1",
        composition: "90% Silver, 10% Copper",
        weight: 26.73,
        diameter: 38.1,
        thickness: 2.4,
        edge: "Reeded",
        mintage: 44690000,
        mint_mark: "",
        designer: "George T. Morgan",
        series: "Morgan Dollar",
        rarity: "Common",
        obverse_image: "/placeholder.svg?height=200&width=200&text=Morgan+Dollar+Obverse",
        reverse_image: "/placeholder.svg?height=200&width=200&text=Morgan+Dollar+Reverse",
        estimated_value: 35.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Peace Silver Dollar",
        description: "Commemorative dollar celebrating peace after WWI",
        country: "United States",
        category: "Silver Dollar",
        year: 1922,
        denomination: "$1",
        composition: "90% Silver, 10% Copper",
        weight: 26.73,
        diameter: 38.1,
        thickness: 2.4,
        edge: "Reeded",
        mintage: 51737000,
        mint_mark: "",
        designer: "Anthony de Francisci",
        series: "Peace Dollar",
        rarity: "Common",
        obverse_image: "/placeholder.svg?height=200&width=200&text=Peace+Dollar+Obverse",
        reverse_image: "/placeholder.svg?height=200&width=200&text=Peace+Dollar+Reverse",
        estimated_value: 38.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Walking Liberty Half Dollar",
        description: "Beautiful half dollar with Walking Liberty design",
        country: "United States",
        category: "Half Dollar",
        year: 1943,
        denomination: "50¢",
        composition: "90% Silver, 10% Copper",
        weight: 12.5,
        diameter: 30.6,
        thickness: 2.15,
        edge: "Reeded",
        mintage: 53190000,
        mint_mark: "",
        designer: "Adolph A. Weinman",
        series: "Walking Liberty",
        rarity: "Common",
        obverse_image: "/placeholder.svg?height=200&width=200&text=Walking+Liberty+Obverse",
        reverse_image: "/placeholder.svg?height=200&width=200&text=Walking+Liberty+Reverse",
        estimated_value: 18.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Mercury Dime",
        description: "Popular dime featuring Winged Liberty Head",
        country: "United States",
        category: "Dime",
        year: 1942,
        denomination: "10¢",
        composition: "90% Silver, 10% Copper",
        weight: 2.5,
        diameter: 17.9,
        thickness: 1.35,
        edge: "Reeded",
        mintage: 205432329,
        mint_mark: "",
        designer: "Adolph A. Weinman",
        series: "Mercury Dime",
        rarity: "Common",
        obverse_image: "/placeholder.svg?height=200&width=200&text=Mercury+Dime+Obverse",
        reverse_image: "/placeholder.svg?height=200&width=200&text=Mercury+Dime+Reverse",
        estimated_value: 2.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: "American Silver Eagle",
        description: "Modern silver bullion coin",
        country: "United States",
        category: "Bullion",
        year: 2023,
        denomination: "$1",
        composition: "99.9% Silver",
        weight: 31.101,
        diameter: 40.6,
        thickness: 2.98,
        edge: "Reeded",
        mintage: 0,
        mint_mark: "W",
        designer: "Adolph A. Weinman / John Mercanti",
        series: "Silver Eagle",
        rarity: "Common",
        obverse_image: "/placeholder.svg?height=200&width=200&text=Silver+Eagle+Obverse",
        reverse_image: "/placeholder.svg?height=200&width=200&text=Silver+Eagle+Reverse",
        estimated_value: 32.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Parse pagination parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "20")))

    console.log("📊 Returning mock data with pagination:", { page, limit, total: mockCoins.length })

    return NextResponse.json({
      coins: mockCoins,
      pagination: {
        page,
        limit,
        total: mockCoins.length,
        totalPages: Math.ceil(mockCoins.length / limit),
      },
    })
  } catch (error) {
    console.error("💥 Unexpected error in coins API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        coins: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // For now, just return the submitted data with an ID
    const newCoin = {
      id: Date.now(), // Simple ID generation
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(newCoin)
  } catch (error) {
    console.error("Error creating coin:", error)
    return NextResponse.json(
      {
        error: "Failed to create coin",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
