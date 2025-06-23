import type { User, MarketplaceListing } from "./someModule" // Assuming User and MarketplaceListing are declared in another module

export interface Order {
  id: number
  buyerId: number
  buyer?: User
  sellerId: number
  seller?: User
  totalAmount: number
  shippingCost: number
  taxAmount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  paymentIntentId?: string
  shippingAddress?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  listingId: number
  listing?: MarketplaceListing
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface CartItem {
  listingId: number
  listing: MarketplaceListing
  quantity: number
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}
