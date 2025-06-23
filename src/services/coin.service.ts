import { BaseService } from "./base.service"
import type { Coin, UserCoinCollection, CoinMarketplaceListing } from "@/src/types/coins"

export class CoinService extends BaseService {
  async getCoins(filters?: {
    search?: string
    country?: string
    category?: string
    rarity?: string
    yearFrom?: number
    yearTo?: number
    page?: number
    limit?: number
  }): Promise<{
    coins: Coin[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      console.log("🪙 CoinService.getCoins called with filters:", filters)

      // Clean filters to remove empty values
      const cleanFilters: Record<string, any> = {}
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "" && value !== 0) {
            cleanFilters[key] = value
          }
        })
      }

      console.log("🧹 Clean filters:", cleanFilters)

      const result = await this.get("/coins", cleanFilters)
      console.log("✅ CoinService.getCoins success:", {
        coinsCount: result.coins?.length || 0,
        pagination: result.pagination,
      })

      return result
    } catch (error) {
      console.error("❌ Error in CoinService.getCoins:", error)

      // Return empty result with proper structure
      const fallbackResult = {
        coins: [],
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          total: 0,
          totalPages: 0,
        },
      }

      console.log("🔄 Returning fallback result:", fallbackResult)
      return fallbackResult
    }
  }

  async getCoin(id: number): Promise<Coin> {
    return this.get(`/coins/${id}`)
  }

  async createCoin(coin: Omit<Coin, "id" | "createdAt" | "updatedAt">): Promise<Coin> {
    return this.post("/coins", coin)
  }

  async updateCoin(id: number, coin: Partial<Coin>): Promise<Coin> {
    return this.put(`/coins/${id}`, coin)
  }

  async deleteCoin(id: number): Promise<void> {
    return this.delete(`/coins/${id}`)
  }

  async getUserCollection(userId: number): Promise<UserCoinCollection[]> {
    try {
      return await this.get(`/coins/collection/${userId}`)
    } catch (error) {
      console.error("Error fetching user collection:", error)
      return []
    }
  }

  async addToCollection(data: {
    coinId: number
    condition: any
    quantity: number
    purchasePrice?: number
    notes?: string
  }): Promise<UserCoinCollection> {
    return this.post("/coins/collection", data)
  }

  async updateCollectionItem(id: number, data: Partial<UserCoinCollection>): Promise<UserCoinCollection> {
    return this.put(`/coins/collection/${id}`, data)
  }

  async removeFromCollection(id: number): Promise<void> {
    return this.delete(`/coins/collection/${id}`)
  }

  async getMarketplaceListings(filters?: {
    search?: string
    category?: string
    priceMin?: number
    priceMax?: number
    condition?: string
    page?: number
    limit?: number
  }): Promise<{
    listings: CoinMarketplaceListing[]
    pagination: any
  }> {
    try {
      const cleanFilters: Record<string, any> = {}
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "" && value !== 0) {
            cleanFilters[key] = value
          }
        })
      }
      return await this.get("/coins/marketplace", cleanFilters)
    } catch (error) {
      console.error("Error fetching marketplace listings:", error)
      return {
        listings: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      }
    }
  }

  async createListing(
    data: Omit<CoinMarketplaceListing, "id" | "createdAt" | "updatedAt">,
  ): Promise<CoinMarketplaceListing> {
    return this.post("/coins/marketplace", data)
  }

  async getCoinsByCountry(countryCode: string): Promise<Coin[]> {
    try {
      return await this.get(`/coins/country/${countryCode}`)
    } catch (error) {
      console.error("Error fetching coins by country:", error)
      return []
    }
  }

  async searchCoins(query: string): Promise<Coin[]> {
    try {
      return await this.get("/coins/search", { q: query })
    } catch (error) {
      console.error("Error searching coins:", error)
      return []
    }
  }

  async getCoinCategories(): Promise<Array<{ category: string; count: number }>> {
    try {
      return await this.get("/coins/categories")
    } catch (error) {
      console.error("Error fetching coin categories:", error)
      return []
    }
  }

  async getCoinValue(
    coinId: number,
    condition: string,
  ): Promise<{
    estimatedValue: number
    marketTrend: "up" | "down" | "stable"
    lastUpdated: string
  }> {
    return this.get(`/coins/${coinId}/value`, { condition })
  }
}

// Export the service instance
export const coinService = new CoinService()
