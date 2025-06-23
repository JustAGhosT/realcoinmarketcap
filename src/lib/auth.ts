import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"
import type { User } from "@/src/types/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function verifyAuth(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; email: string }

    const users = await sql`
      SELECT id, email, first_name, last_name, phone, address, city, postal_code, country, is_verified, is_seller, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postal_code,
      country: user.country,
      isVerified: user.is_verified,
      isSeller: user.is_seller,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}
