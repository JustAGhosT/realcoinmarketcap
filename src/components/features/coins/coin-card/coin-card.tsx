"use client"

import type React from "react"
import { useState } from "react"
import type { Coin } from "@/src/types/coins"
import { useCoinCollection } from "@/src/hooks/use-coin-collection"
import styles from "./coin-card.module.css"

interface CoinCardProps {
  coin: Coin
  showAddToCollection?: boolean
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, showAddToCollection = false }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentSide, setCurrentSide] = useState<"obverse" | "reverse">("obverse")
  const { addToCollection, loading } = useCoinCollection()

  const handleAddToCollection = async (condition: string, purchasePrice?: number) => {
    try {
      await addToCollection({
        coinId: coin.id,
        condition: { grade: condition as any },
        quantity: 1,
        purchasePrice,
        notes: "",
      })
      setShowAddModal(false)
    } catch (error) {
      console.error("Failed to add to collection:", error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "extremely_rare":
        return "#8b5cf6"
      case "very_rare":
        return "#dc2626"
      case "rare":
        return "#ea580c"
      case "scarce":
        return "#d97706"
      case "uncommon":
        return "#059669"
      case "common":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  const getCompositionDisplay = () => {
    if (coin.composition.alloy && coin.composition.alloy.length > 0) {
      return coin.composition.alloy.map((a) => `${a.metal} ${a.percentage}%`).join(", ")
    }
    return `${coin.composition.primary} ${coin.composition.percentage}%`
  }

  const currentImage = currentSide === "obverse" ? coin.imageUrls.obverse : coin.imageUrls.reverse

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {currentImage ? (
          <img src={currentImage || "/placeholder.svg"} alt={`${coin.name} ${currentSide}`} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span>🪙</span>
            <p>No Image</p>
          </div>
        )}

        <div className={styles.imageControls}>
          <button
            onClick={() => setCurrentSide("obverse")}
            className={`${styles.sideButton} ${currentSide === "obverse" ? styles.active : ""}`}
          >
            Obverse
          </button>
          <button
            onClick={() => setCurrentSide("reverse")}
            className={`${styles.sideButton} ${currentSide === "reverse" ? styles.active : ""}`}
          >
            Reverse
          </button>
        </div>

        <div className={styles.rarityBadge} style={{ backgroundColor: getRarityColor(coin.rarity) }}>
          {coin.rarity.replace("_", " ").toUpperCase()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{coin.name}</h3>
          <div className={styles.denomination}>{formatCurrency(coin.denomination, coin.currency)}</div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Country:</span>
            <span>{coin.country}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Year:</span>
            <span>{coin.mintYear}</span>
          </div>

          {coin.mintMark && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Mint Mark:</span>
              <span>{coin.mintMark}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.label}>Category:</span>
            <span>{coin.category}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Composition:</span>
            <span>{getCompositionDisplay()}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Weight:</span>
            <span>{coin.weight}g</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Diameter:</span>
            <span>{coin.diameter}mm</span>
          </div>

          {coin.mintage && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Mintage:</span>
              <span>{coin.mintage.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className={styles.coinSides}>
          <div className={styles.sideInfo}>
            <h4>Obverse</h4>
            <p>{coin.obverse.description}</p>
            {coin.obverse.inscription && <p className={styles.inscription}>"{coin.obverse.inscription}"</p>}
          </div>
          <div className={styles.sideInfo}>
            <h4>Reverse</h4>
            <p>{coin.reverse.description}</p>
            {coin.reverse.inscription && <p className={styles.inscription}>"{coin.reverse.inscription}"</p>}
          </div>
        </div>

        {coin.description && <p className={styles.description}>{coin.description}</p>}

        {showAddToCollection && (
          <div className={styles.actions}>
            <button onClick={() => setShowAddModal(true)} className={styles.addButton} disabled={loading}>
              {loading ? "Adding..." : "Add to Collection"}
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToCollectionModal
          coin={coin}
          onAdd={handleAddToCollection}
          onClose={() => setShowAddModal(false)}
          loading={loading}
        />
      )}
    </div>
  )
}

interface AddToCollectionModalProps {
  coin: Coin
  onAdd: (condition: string, purchasePrice?: number) => void
  onClose: () => void
  loading: boolean
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ coin, onAdd, onClose, loading }) => {
  const [condition, setCondition] = useState("MS-63")
  const [purchasePrice, setPurchasePrice] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(condition, purchasePrice ? Number.parseFloat(purchasePrice) : undefined)
  }

  const coinGrades = [
    "P-1",
    "FR-2",
    "AG-3",
    "G-4",
    "G-6",
    "VG-8",
    "VG-10",
    "F-12",
    "F-15",
    "VF-20",
    "VF-25",
    "VF-30",
    "VF-35",
    "EF-40",
    "EF-45",
    "AU-50",
    "AU-53",
    "AU-55",
    "AU-58",
    "MS-60",
    "MS-61",
    "MS-62",
    "MS-63",
    "MS-64",
    "MS-65",
    "MS-66",
    "MS-67",
    "MS-68",
    "MS-69",
    "MS-70",
    "PF-60",
    "PF-61",
    "PF-62",
    "PF-63",
    "PF-64",
    "PF-65",
    "PF-66",
    "PF-67",
    "PF-68",
    "PF-69",
    "PF-70",
  ]

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add to Collection</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="condition">Grade:</label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={styles.select}
            >
              {coinGrades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="purchasePrice">Purchase Price (optional):</label>
            <input
              type="number"
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={styles.input}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Adding..." : "Add to Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
