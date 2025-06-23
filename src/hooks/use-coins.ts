"use client"

import { useState, useEffect } from "react"
import { coinService } from "@/src/services/coin.service"
import type { Coin } from "@/src/types/coins"

interface UseCoinsFilters {
  search?: string
  country?: string
  category?: string
  rarity?: string
  yearFrom?: string
  yearTo?: string
  page?: number
  limit?: number
}

interface UseCoinsReturn {
  coins: Coin[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export const useCoins = (filters: UseCoinsFilters = {}): UseCoinsReturn => {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseCoinsReturn["pagination"]>(null)

  useEffect(() => {
    fetchCoins()
  }, [JSON.stringify(filters)]) // Use JSON.stringify to properly compare filters

  const fetchCoins = async () => {
    console.log("useCoins.fetchCoins called with filters:", filters)
    setLoading(true)
    setError(null)

    try {
      // Convert string years to numbers if provided
      const processedFilters = {
        ...filters,
        yearFrom: filters.yearFrom ? Number.parseInt(filters.yearFrom) : undefined,
        yearTo: filters.yearTo ? Number.parseInt(filters.yearTo) : undefined,
      }

      console.log("Processed filters:", processedFilters)

      const data = await coinService.getCoins(processedFilters)
      console.log("useCoins received data:", data)

      setCoins(data.coins || [])
      setPagination(data.pagination || null)
    } catch (err) {
      console.error("Error in useCoins.fetchCoins:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching coins"
      setError(errorMessage)
      setCoins([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  return { coins, loading, error, pagination }
}
