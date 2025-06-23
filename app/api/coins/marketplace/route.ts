import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const condition = searchParams.get("condition") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Build WHERE clause dynamically
    const conditions = ["cml.status = 'active'"]
    const params = []
    let paramIndex = 1

    if (search) {
      conditions.push(`(c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category) {
      conditions.push(`c.category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (condition) {
      conditions.push(`cml.condition = $${paramIndex}`)
      params.push(condition)
      paramIndex++
    }

    if (priceMin) {
      conditions.push(`cml.price >= $${paramIndex}`)
      params.push(Number.parseFloat(priceMin))
      paramIndex++
    }

    if (priceMax) {
      conditions.push(`cml.price <= $${paramIndex}`)
      params.push(Number.parseFloat(priceMax))
      paramIndex++
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM coin_marketplace_listings cml
      JOIN coins c ON cml.coin_id = c.id
      ${whereClause}
    `
    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Get listings with pagination
    const listingsQuery = `
      SELECT 
        cml.*,
        c.name,
        c.description,
        c.country,
        c.category,
        c.year,
        c.denomination,
        c.obverse_image,
        c.reverse_image
      FROM coin_marketplace_listings cml
      JOIN coins c ON cml.coin_id = c.id
      ${whereClause}
      ORDER BY cml.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    const listings = await sql(listingsQuery, [...params, limit, offset])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching marketplace listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, coinId, condition, price, quantity, description, images } = body

    const result = await sql`
      INSERT INTO coin_marketplace_listings (
        seller_id, coin_id, condition, price, quantity, description, 
        images, status, created_at, updated_at
      ) VALUES (
        ${sellerId}, ${coinId}, ${condition}, ${price}, ${quantity}, ${description},
        ${JSON.stringify(images)}, 'active', NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
