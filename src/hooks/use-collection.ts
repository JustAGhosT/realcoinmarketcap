"use client"

import { useState } from "react"
import type { CollectionItem } from "@/src/types/stamps"

interface AddToCollectionData {
  stampId: number
  condition: "mint" | "very_fine" | "fine" | "good" | "poor"
  quantity: number
  purchasePrice?: number
  notes?: string
}

export const useCollection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCollection = async (data: AddToCollectionData): Promise<CollectionItem> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const { item } = await response.json()
      return item
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add to collection"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { addToCollection, loading, error }
}
