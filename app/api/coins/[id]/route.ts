import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const result = await sql`SELECT * FROM coins WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching coin:", error)
    return NextResponse.json({ error: "Failed to fetch coin" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const result = await sql`
      UPDATE coins 
      SET ${sql(body)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating coin:", error)
    return NextResponse.json({ error: "Failed to update coin" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const result = await sql`DELETE FROM coins WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Coin deleted successfully" })
  } catch (error) {
    console.error("Error deleting coin:", error)
    return NextResponse.json({ error: "Failed to delete coin" }, { status: 500 })
  }
}
