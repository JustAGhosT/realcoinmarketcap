import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        uc.*,
        c.name,
        c.description,
        c.country,
        c.category,
        c.year,
        c.denomination,
        c.obverse_image,
        c.reverse_image,
        c.estimated_value
      FROM user_coin_collection uc
      JOIN coins c ON uc.coin_id = c.id
      WHERE uc.user_id = ${Number.parseInt(userId)}
      ORDER BY uc.created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching coin collection:", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, coinId, condition, quantity, purchasePrice, notes } = body

    const result = await sql`
      INSERT INTO user_coin_collection (
        user_id, coin_id, condition, quantity, purchase_price, notes, created_at, updated_at
      ) VALUES (
        ${userId}, ${coinId}, ${condition}, ${quantity}, ${purchasePrice}, ${notes}, NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error adding to collection:", error)
    return NextResponse.json({ error: "Failed to add to collection" }, { status: 500 })
  }
}
