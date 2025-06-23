"use client"

import { useState } from "react"
import { coinService } from "@/src/services/coin.service"
import type { UserCoinCollection } from "@/src/types/coins"

interface AddToCoinCollectionData {
  coinId: number
  condition: any
  quantity: number
  purchasePrice?: number
  notes?: string
}

export const useCoinCollection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCollection = async (data: AddToCoinCollectionData): Promise<UserCoinCollection> => {
    setLoading(true)
    setError(null)

    try {
      const item = await coinService.addToCollection(data)
      return item
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add to collection"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateCollectionItem = async (id: number, data: Partial<UserCoinCollection>): Promise<UserCoinCollection> => {
    setLoading(true)
    setError(null)

    try {
      const item = await coinService.updateCollectionItem(id, data)
      return item
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update collection item"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCollection = async (id: number): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await coinService.removeFromCollection(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove from collection"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    addToCollection,
    updateCollectionItem,
    removeFromCollection,
    loading,
    error,
  }
}
