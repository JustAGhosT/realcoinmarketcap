export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  external_url?: string
  animation_url?: string
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: "boost_number" | "boost_percentage" | "number" | "date"
}

export interface StampNFT {
  id: string
  tokenId: string
  contractAddress: string
  stampId: number
  ownerId: number
  metadata: NFTMetadata
  mintedAt: string
  transactionHash: string
  isListed: boolean
  price?: number
  royalties: number
  creatorAddress: string
  currentOwnerAddress: string
}

export interface NFTListing {
  id: string
  nftId: string
  sellerId: number
  price: number
  currency: "ETH" | "MATIC" | "PLU"
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface MintRequest {
  stampId: number
  recipientAddress: string
  metadata: NFTMetadata
  royaltyPercentage: number
}
