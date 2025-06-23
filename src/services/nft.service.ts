import { BaseService } from "./base.service"
import type { StampNFT, NFTListing, MintRequest, NFTMetadata } from "@/src/types/nft"

export class NFTService extends BaseService {
  async mintStampNFT(request: MintRequest): Promise<StampNFT> {
    return this.post("/nft/mint", request)
  }

  async getUserNFTs(userId: number): Promise<StampNFT[]> {
    return this.get(`/nft/user/${userId}`)
  }

  async getNFTById(id: string): Promise<StampNFT> {
    return this.get(`/nft/${id}`)
  }

  async listNFTForSale(nftId: string, price: number, currency: string): Promise<NFTListing> {
    return this.post(`/nft/${nftId}/list`, { price, currency })
  }

  async buyNFT(listingId: string, paymentMethod: "wallet" | "card"): Promise<{ transactionHash: string }> {
    return this.post(`/nft/buy/${listingId}`, { paymentMethod })
  }

  async transferNFT(nftId: string, toAddress: string): Promise<{ transactionHash: string }> {
    return this.post(`/nft/${nftId}/transfer`, { toAddress })
  }

  async getNFTMarketplace(filters?: {
    category?: string
    priceMin?: number
    priceMax?: number
    rarity?: string
  }): Promise<NFTListing[]> {
    return this.get("/nft/marketplace", filters)
  }

  async generateNFTMetadata(stampId: number): Promise<NFTMetadata> {
    return this.post("/nft/metadata/generate", { stampId })
  }
}

export const nftService = new NFTService()
