import { NextResponse } from "next/server"

export async function GET() {
  try {
    // First, let's check if we have the environment variable
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: "DATABASE_URL environment variable is not set",
          status: "error",
        },
        { status: 500 },
      )
    }

    // Try to import and use neon
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    // Simple test query
    const result = await sql`SELECT 'Hello from database!' as message, NOW() as timestamp`

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: result[0],
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 500 },
    )
  }
}
