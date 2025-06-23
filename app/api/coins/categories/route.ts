import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT category, COUNT(*) as count
      FROM coins
      GROUP BY category
      ORDER BY count DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching coin categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
