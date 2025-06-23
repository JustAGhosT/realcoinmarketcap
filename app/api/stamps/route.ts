import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const rarity = searchParams.get("rarity")
    const yearFrom = searchParams.get("yearFrom")
    const yearTo = searchParams.get("yearTo")

    const offset = (page - 1) * limit

    const whereConditions = []
    const params: any[] = []

    if (category) {
      whereConditions.push(`s.category_id = $${params.length + 1}`)
      params.push(Number.parseInt(category))
    }

    if (search) {
      whereConditions.push(
        `(s.title ILIKE $${params.length + 1} OR s.description ILIKE $${params.length + 1} OR s.sacc_number ILIKE $${params.length + 1})`,
      )
      params.push(`%${search}%`)
    }

    if (rarity) {
      whereConditions.push(`s.rarity_level = $${params.length + 1}`)
      params.push(rarity)
    }

    if (yearFrom) {
      whereConditions.push(`EXTRACT(YEAR FROM s.issue_date) >= $${params.length + 1}`)
      params.push(Number.parseInt(yearFrom))
    }

    if (yearTo) {
      whereConditions.push(`EXTRACT(YEAR FROM s.issue_date) <= $${params.length + 1}`)
      params.push(Number.parseInt(yearTo))
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const stamps = await sql`
      SELECT 
        s.*,
        sc.name as category_name,
        sc.description as category_description
      FROM stamps s
      LEFT JOIN stamp_categories sc ON s.category_id = sc.id
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY s.issue_date DESC, s.title
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalCount = await sql`
      SELECT COUNT(*) as count
      FROM stamps s
      ${whereClause ? sql.unsafe(whereClause) : sql``}
    `

    return NextResponse.json({
      stamps: stamps.map((stamp) => ({
        id: stamp.id,
        saccNumber: stamp.sacc_number,
        title: stamp.title,
        description: stamp.description,
        issueDate: stamp.issue_date,
        faceValue: stamp.face_value,
        categoryId: stamp.category_id,
        category: stamp.category_name
          ? {
              id: stamp.category_id,
              name: stamp.category_name,
              description: stamp.category_description,
            }
          : null,
        seriesName: stamp.series_name,
        designer: stamp.designer,
        printer: stamp.printer,
        perforation: stamp.perforation,
        watermark: stamp.watermark,
        imageUrl: stamp.image_url,
        rarityLevel: stamp.rarity_level,
        createdAt: stamp.created_at,
        updatedAt: stamp.updated_at,
      })),
      pagination: {
        page,
        limit,
        total: Number.parseInt(totalCount[0].count),
        totalPages: Math.ceil(Number.parseInt(totalCount[0].count) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching stamps:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
