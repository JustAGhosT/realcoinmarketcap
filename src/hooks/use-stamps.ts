"use client"

import { useState, useEffect } from "react"
import type { Stamp } from "@/src/types/stamps"

interface UseStampsFilters {
  search?: string
  category?: string
  rarity?: string
  yearFrom?: string
  yearTo?: string
  page?: number
  limit?: number
}

interface UseStampsReturn {
  stamps: Stamp[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export const useStamps = (filters: UseStampsFilters = {}): UseStampsReturn => {
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseStampsReturn["pagination"]>(null)

  useEffect(() => {
    fetchStamps()
  }, [filters])

  const fetchStamps = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/stamps?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch stamps")
      }

      const data = await response.json()
      setStamps(data.stamps)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { stamps, loading, error, pagination }
}
