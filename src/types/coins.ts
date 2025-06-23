export interface Coin {
  id: number
  catalogNumber?: string
  name: string
  description?: string
  country: string
  denomination: number
  currency: string
  mintYear: number
  mintMark?: string
  mintage?: number
  composition: CoinComposition
  diameter: number // in mm
  weight: number // in grams
  thickness?: number // in mm
  edge: EdgeType
  obverse: CoinSide
  reverse: CoinSide
  series?: string
  designer?: string
  engraver?: string
  rarity: RarityLevel
  category: CoinCategory
  imageUrls: CoinImages
  createdAt: string
  updatedAt: string
}

export interface CoinComposition {
  primary: string // e.g., "Gold", "Silver", "Copper"
  percentage: number
  alloy?: Array<{
    metal: string
    percentage: number
  }>
  purity?: number // for precious metals
}

export interface CoinSide {
  description: string
  inscription?: string
  motif: string
  designer?: string
}

export interface CoinImages {
  obverse?: string
  reverse?: string
  edge?: string
  packaging?: string
}

export type EdgeType = "plain" | "reeded" | "lettered" | "decorated" | "security"
export type RarityLevel = "common" | "uncommon" | "scarce" | "rare" | "very_rare" | "extremely_rare"
export type CoinCategory =
  | "circulation"
  | "commemorative"
  | "proof"
  | "bullion"
  | "pattern"
  | "error"
  | "ancient"
  | "medieval"
  | "modern"

export interface CoinCondition {
  grade: CoinGrade
  service?: string // NGC, PCGS, etc.
  certificationNumber?: string
  notes?: string
}

export type CoinGrade =
  | "P-1"
  | "FR-2"
  | "AG-3"
  | "G-4"
  | "G-6"
  | "VG-8"
  | "VG-10"
  | "F-12"
  | "F-15"
  | "VF-20"
  | "VF-25"
  | "VF-30"
  | "VF-35"
  | "EF-40"
  | "EF-45"
  | "AU-50"
  | "AU-53"
  | "AU-55"
  | "AU-58"
  | "MS-60"
  | "MS-61"
  | "MS-62"
  | "MS-63"
  | "MS-64"
  | "MS-65"
  | "MS-66"
  | "MS-67"
  | "MS-68"
  | "MS-69"
  | "MS-70"
  | "PF-60"
  | "PF-61"
  | "PF-62"
  | "PF-63"
  | "PF-64"
  | "PF-65"
  | "PF-66"
  | "PF-67"
  | "PF-68"
  | "PF-69"
  | "PF-70"

export interface UserCoinCollection {
  id: number
  userId: number
  coinId: number
  coin?: Coin
  condition: CoinCondition
  quantity: number
  purchasePrice?: number
  currentValue?: number
  purchaseDate?: string
  notes?: string
  isForSale: boolean
  askingPrice?: number
  location?: string
  insurance?: {
    insured: boolean
    value?: number
    provider?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CoinMarketplaceListing {
  id: number
  sellerId: number
  collectionItemId: number
  title: string
  description?: string
  price: number
  condition: CoinCondition
  quantityAvailable: number
  shippingCost?: number
  acceptsOffers: boolean
  isActive: boolean
  isFeatured: boolean
  viewsCount: number
  watchersCount: number
  createdAt: string
  updatedAt: string
}
