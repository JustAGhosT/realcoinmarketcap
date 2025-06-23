import type { User } from "./user" // Assuming User is defined in another file, e.g., src/types/user.ts

export interface StampCategory {
  id: number
  name: string
  description?: string
  createdAt: string
}

export interface Stamp {
  id: number
  saccNumber?: string
  title: string
  description?: string
  issueDate?: string
  faceValue?: number
  categoryId?: number
  category?: StampCategory
  seriesName?: string
  designer?: string
  printer?: string
  perforation?: string
  watermark?: string
  imageUrl?: string
  rarityLevel: "common" | "uncommon" | "rare" | "very_rare"
  createdAt: string
  updatedAt: string
}

export interface CollectionItem {
  id: number
  userId: number
  stampId: number
  stamp?: Stamp
  condition: "mint" | "very_fine" | "fine" | "good" | "poor"
  quantity: number
  purchasePrice?: number
  currentValue?: number
  notes?: string
  acquiredDate: string
  isForSale: boolean
  askingPrice?: number
  createdAt: string
}

export interface MarketplaceListing {
  id: number
  sellerId: number
  seller?: User
  collectionItemId: number
  collectionItem?: CollectionItem
  title: string
  description?: string
  price: number
  condition: string
  quantityAvailable: number
  isActive: boolean
  isFeatured: boolean
  viewsCount: number
  createdAt: string
  updatedAt: string
}

export interface WatchlistItem {
  id: number
  userId: number
  stampId: number
  stamp?: Stamp
  maxPrice?: number
  conditionPreference?: string
  createdAt: string
}
