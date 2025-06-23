import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const testResult = await sql`SELECT NOW() as current_time`
    console.log("Database connection successful:", testResult[0])

    // Check if coins table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'coins'
      ) as exists
    `
    console.log("Coins table exists:", tableExists[0].exists)

    if (!tableExists[0].exists) {
      return NextResponse.json({
        status: "error",
        message: "Coins table does not exist",
        suggestion: "Please run the database migration scripts",
      })
    }

    // Count coins
    const countResult = await sql`SELECT COUNT(*) as count FROM coins`
    console.log("Coins count:", countResult[0].count)

    return NextResponse.json({
      status: "success",
      database_connected: true,
      table_exists: tableExists[0].exists,
      coins_count: countResult[0].count,
      current_time: testResult[0].current_time,
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    )
  }
}
